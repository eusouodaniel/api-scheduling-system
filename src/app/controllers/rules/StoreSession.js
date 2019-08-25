import * as Yup from 'yup';

class StoreSession {
  async create(body) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    return schema.isValid(body);
  }
}

export default new StoreSession();
