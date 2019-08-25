import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancelMail {
  get key() {
    return 'CancelMail';
  }

  async handle({ data }) {
    const { schedule } = data;
    await Mail.sendMail({
      to: `${schedule.provider.name} <${schedule.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelSchedule',
      context: {
        provider: schedule.provider.name,
        user: schedule.user.name,
        date: format(
          parseISO(schedule.date),
          "'Dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancelMail();
