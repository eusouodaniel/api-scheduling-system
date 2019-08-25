import { format } from "url";

import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Schedule from '../models/Schedule';

class AvailabilityController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    const formatDate = Number(date);

    const schedules = await Schedule.findAll({
      where: {
        provider_id: req.params.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(formatDate), endOfDay(formatDate)],
        },
      },
    });

    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

    const disponibility = hours.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(formatDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        disponibility: isAfter(value, new Date()) && !schedules.find(schedule => {
          return format(schedule.date, 'HH:mm') == time
        })
      };
    });

    return res.json(disponibility);
  }
}

export default new AvailabilityController();
