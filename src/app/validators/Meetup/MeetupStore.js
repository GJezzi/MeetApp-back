import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      desc: Yup.string().required(),
      location: Yup.string().required(),
      date_time: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Failed Validation', messages: error.inner });
  }
};
