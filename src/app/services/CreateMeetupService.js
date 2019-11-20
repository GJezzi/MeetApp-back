import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class CreateMeetupService {
  async run({ user_id, body, date_time }) {
    const meetup = await Meetup.create({
      user_id,
      ...body,
    });
    const parsedDate = parseISO(date_time);

    if (isBefore(parsedDate, new Date())) {
      throw new Error('Não é possível criar um Meetup em uma hora passada');
    }

    return meetup;
  }
}

export default new CreateMeetupService();
