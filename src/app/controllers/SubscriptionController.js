import { startOfHour, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Notification from '../schemas/Notification';

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
    // const hourStart = startOfHour(parseISO(req.body.date_time));
    // const formattedDate = format(
    //   hourStart,
    //   "'dia' dd 'de' MMMM', às H:mm'hrs'",
    //   { locale: pt }
    // );

    await Notification.create({
      content: `${user.name} se inscreveu para o meetup ${meetup.title}. `,
      user: meetup.user_id,
    });

    await Notification.create({
      content: `Prezado ${user.name}, você se inscreveu para o meetup ${meetup.title}`,
      user: req.userId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
