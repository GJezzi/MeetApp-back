import { isBefore } from 'date-fns';

import Meetup from '../models/Meetup';

class DeleteMeetupService {
  async run({ meetup_id, user_id }) {
    const meetup = await Meetup.findByPk(meetup_id);

    if (meetup.user_id !== user_id) {
      throw new Error('Você não tem permissão para cancelar este Meetup');
    }

    if (isBefore(meetup.past, new Date())) {
      throw new Error('Meetup não pode ser cancelado');
    }

    meetup.canceled_at = new Date();

    await meetup.save();

    await meetup.destroy();
  }
}

export default new DeleteMeetupService();
