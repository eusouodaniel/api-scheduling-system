import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Schedule from '../models/Schedule';
import User from '../models/User';

class ScheduleController {
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

    return res.json(schedule);
  }
}

export default new ScheduleController();
