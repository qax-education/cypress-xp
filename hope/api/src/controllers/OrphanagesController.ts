import { Request, Response } from 'express';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';

export default {
  async index(request: Request, response: Response) {
    
    const { name } = request.query

    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    await schema.validate(request.query, { abortEarly: false });

    let query: any = { name: new RegExp(String(name), 'i') }

    const orphanages = await Orphanage.find(name ? query : {}, {}, { sort: '-date' });

    return response.json(orphanages);
  },

  async show(request: Request, response: Response) {

    const schema = Yup.object().shape({
      _id: Yup.string().required(),
    });

    await schema.validate(request.params, { abortEarly: false });

    const { _id } = request.params;


    const orphanage = await Orphanage.findById(_id);

    if (!orphanage)
      return response.status(404).end()

    return response.json(orphanage);
  },

  async create(request: Request, response: Response) {

    const {
      name,
      latitude,
      longitude,
      description,
      opening_hours,
      open_on_weekends
    } = request.body;

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return {
        file_name: image.filename
      }
    });

    console.log(images)

    const data = {
      name,
      latitude,
      longitude,
      description,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      description: Yup.string().max(300).required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(Yup.object().shape({
        file_name: Yup.string().required(),
      })),
    });

    await schema.validate(data, { abortEarly: false });

    const found = await Orphanage.findOne({ name: data.name })

    if (found)
      return response.status(400).json({bcode: 1001, message: 'Orphanage already registered.'});

    const orphanage = new Orphanage(data);
    const result = await orphanage.save();

    response.set('_id', String(result._id))

    return response.status(201).json(result);
  },

  async removeByName(request: Request, response: Response) {

    const { name } = request.query

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    await schema.validate(request.query, { abortEarly: false });

    const user: any = await Orphanage.deleteMany({ name: name })

    if (!user)
        return response.status(204).end()

    return response.status(204).end()
  },


};
