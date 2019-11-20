import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import CreateMeetupService from '../services/CreateMeetupService';
import UpdateMeetupService from '../services/UpdateMeetupService';
import DeleteMeetupService from '../services/DeleteMeetupService';

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
    const meetup = await CreateMeetupService.run({
      body: req.body,
      user_id: req.userId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await UpdateMeetupService.run({
      user_id: req.userId,
      body: req.body,
      meetup_id: req.params.id,
    });

    return res.json(meetup);
  }

  async delete(req, res) {
    await DeleteMeetupService.run({
      meetup_id: req.params.id,
      user_id: req.userId,
    });

    return res.send();
  }
}

export default new MeetupController();
