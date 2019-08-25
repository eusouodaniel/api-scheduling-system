import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        already_passed: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancel_option: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 1));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: `user_id`, as: 'user' });
    this.belongsTo(models.User, { foreignKey: `provider_id`, as: 'provider' });
  }
}

export default Schedule;
