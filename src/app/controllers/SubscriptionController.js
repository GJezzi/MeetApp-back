import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import CreateSubscriptionService from '../services/CreateSubscriptionService';

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
    const subscription = await CreateSubscriptionService.run({
      meetup_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
