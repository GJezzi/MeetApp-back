import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string(),
      desc: Yup.string(),
      location: Yup.string(),
      date_time: Yup.date(),
      banner_id: Yup.number(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Failed Validation', messages: error.inner });
  }
};
