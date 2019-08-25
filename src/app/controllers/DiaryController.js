import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import File from '../models/File';
import Schedule from '../models/Schedule';
import User from '../models/User';

class DiaryController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Problem with provider' });
    }

    const { date } = req.query;
    const parsedDate = date ? parseISO(date) : new Date();

    const schedules = await Schedule.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'user',
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

    return res.json(schedules);
  }
}

export default new DiaryController();
