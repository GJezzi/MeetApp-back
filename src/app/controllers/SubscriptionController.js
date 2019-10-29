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

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found.' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });
    console.log('Meetup Id: ', meetup.id);
    console.log('User Id: ', req.userId);

    return res.json(subscription);
  }
}

export default new SubscriptionController();
