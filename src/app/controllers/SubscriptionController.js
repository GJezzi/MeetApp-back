import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

class SubscriptionController {
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
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in a Meetup you created' });
    }

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found.' });
    }

    if (meetup.past) {
      return res.status(400).json({
        error:
          'It is not possible to subscript in Meetup that has already happened',
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
        error: 'You are already subscribed to this meetup',
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
        error:
          'There is another Meetup you are subscribed happening on the same time',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
