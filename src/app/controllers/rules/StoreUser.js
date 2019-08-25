import * as Yup from 'yup';

class StoreUser {
  async create(body) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    return schema.isValid(body);
  }

  async update(body) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        oldPassword ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    return schema.isValid(body);
  }
}

export default new StoreUser();
