import Meetup from '../models/Meetup';

class UpdateMeetupService {
  async run({ user_id, body, meetup_id }) {
    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      throw new Error('Meetup não encontrado');
    }

    if (meetup.user_id !== user_id) {
      throw new Error('Atualização não autorizada');
    }

    await meetup.update(body);
    return meetup;
  }
}

export default new UpdateMeetupService();
