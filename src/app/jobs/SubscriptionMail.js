import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { user, meetup } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Inscrição Confirmada',
      template: 'confirmation',
      context: {
        user: user.name,
        meetup: meetup.title,
        date_time: format(
          parseISO(meetup.date_time),
          "'dia' dd 'de' MMMM', às' H:mm'hrs'",
          {
            locale: ptBR,
          }
        ),
      },
    });
  }
}

export default new SubscriptionMail();
