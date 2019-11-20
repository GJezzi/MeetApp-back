import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class CreateSubscriptionService {
  async run({ meetup_id, user_id }) {
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (meetup.user_id === user_id) {
      throw new Error(
        'Você não pode se inscrever em um Meetup criado por você mesmo'
      );
    }

    if (!meetup) {
      throw new Error('Meetup inexistente.');
    }

    if (meetup.past) {
      throw new Error('Não é possível se inscrever em um Meetup passado');
    }

    const isSubscribed = await Subscription.findOne({
      where: {
        meetup_id,
        user_id,
      },
    });

    if (isSubscribed) {
      throw new Error('Você já está inscrito neste meetup');
    }

    const sameTimeMeetup = await Subscription.findOne({
      where: {
        user_id,
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
      throw new Error('Há outro meetup acontecendo no mesmo horário');
    }

    const subscription = await Subscription.create({
      user_id,
      meetup_id: meetup.id,
    });

    const user = await User.findByPk(user_id);

    await Notification.create({
      content: `${user.name} se inscreveu para o meetup ${meetup.title}.`,
      user: meetup.user_id,
    });

    await Notification.create({
      content: `Prezado ${user.name}, você se inscreveu para o meetup ${meetup.title}`,
      user: user_id,
    });

    await Queue.add(SubscriptionMail.key, {
      user,
      meetup,
    });

    return subscription;
  }
}

export default new CreateSubscriptionService();
