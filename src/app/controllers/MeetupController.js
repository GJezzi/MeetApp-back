import * as Yup from 'yup';
import {
  startOfHour,
  parseISO,
  isBefore,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { date_time } = req.query;
    const parsedDate = parseISO(date_time);

    const meetup = await Meetup.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
        date_time: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'title', 'desc', 'location', 'date_time'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: ['date_time'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(meetup);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      desc: Yup.string().required(),
      location: Yup.string().required(),
      date_time: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de Validação' });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id: req.userId,
    });

    const hourStart = startOfHour(parseISO(req.body.date_time));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Não é possível criar um Meetup em uma hora passada',
      });
    }

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      desc: Yup.string(),
      location: Yup.string(),
      date_time: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não encontrado' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({ error: 'Atualização não autorizada' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    const meetupTime = meetup.date_time;

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({ error: 'Cancelamento não autorizado' });
    }

    if (isBefore(meetupTime, new Date())) {
      return res.status(400).json({ error: 'Meetup não pode ser cancelado' });
    }

    meetup.canceled_at = new Date();

    await meetup.save();

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
