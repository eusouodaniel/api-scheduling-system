import * as Yup from 'yup';
import { format, startOfHour, parseISO, isBefore, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import File from '../models/File';
import Schedule from '../models/Schedule';
import User from '../models/User';
import Notification from '../schemas/Notification';

import CancelMail from '../jobs/CancelMail';
import Queue from '../../lib/Queue';

class ScheduleController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const schedules = await Schedule.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: page ? (page - 1) * 20 : 0,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    res.json(schedules);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation field fails' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Problem with provider' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Problem with date schedule' });
    }

    const checkAvailability = await Schedule.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Problem with date availability' });
    }

    const schedule = await Schedule.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} no ${formattedDate}`,
      user: provider_id,
    });

    return res.json(schedule);
  }

  async delete(req, res) {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['name', 'email'] },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });

    if (schedule.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorization' });
    }

    const dateWithSub = subHours(schedule.date, 1);
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel schedule 1 hour in advance' });
    }

    schedule.canceled_at = new Date();

    await schedule.save();

    Queue.add(CancelMail.key, {
      schedule,
    });

    return res.json(schedule);
  }
}

export default new ScheduleController();
