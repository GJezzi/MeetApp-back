import { Op } from 'sequelize';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class SubscriptionController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const subscription = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['id', 'title', 'desc', 'location', 'date_time'],
          where: {
            date_time: {
              [Op.gt]: new Date(),
            },
          },
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['meetup', 'date_time']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(subscription);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (meetup.user_id === req.userId) {
      return res.status(400).json({
        error: 'Você não pode se inscrever em um Meetup criado por você mesmo',
      });
    }

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup inexistente.' });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: 'Não é possível se inscrever em um Meetup passado',
      });
    }

    const isSubscribed = await Subscription.findOne({
      where: {
        meetup_id: meetup.id,
        user_id: req.userId,
      },
    });

    if (isSubscribed) {
      return res.status(400).json({
        error: 'Você já está inscrito neste meetup',
      });
    }

    const sameTimeMeetup = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date_time: meetup.date_time,
          },
        },
      ],
    });

    if (sameTimeMeetup) {
      return res.status(400).json({
        error: 'Há outro meetup acontecendo no mesmo horário',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const user = await User.findByPk(req.userId);

    await Notification.create({
      content: `${user.name} se inscreveu para o meetup ${meetup.title}.`,
      user: meetup.user_id,
    });

    await Notification.create({
      content: `Prezado ${user.name}, você se inscreveu para o meetup ${meetup.title}`,
      user: req.userId,
    });

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Inscrição Confirmada',
      template: 'confirmation',
      context: {
        user: user.name,
        meetup: meetup.title,
        date_time: format(
          meetup.date_time,
          "'dia' dd 'de' MMMM', às' H:mm'hrs'",
          {
            locale: ptBR,
          }
        ),
      },
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
