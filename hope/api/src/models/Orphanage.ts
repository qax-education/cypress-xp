import { Schema, model } from 'mongoose';

interface IPictures {
  file_name: string;
}

interface IOrphanage {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  open_on_weekends: boolean;
  images: IPictures[];
}

const schema = new Schema<IOrphanage>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  opening_hours: { type: String, required: true },
  open_on_weekends: { type: Boolean, required: true },
  images: [{
    file_name: { type: String }
  }]
}, { versionKey: false });

export default model<IOrphanage>('Orphanages', schema);