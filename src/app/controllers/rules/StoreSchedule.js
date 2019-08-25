import * as Yup from 'yup';

class StoreSchedule {
  async create(body) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    return schema.isValid(body);
  }
}

export default new StoreSchedule();
