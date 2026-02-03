import mongoose, { Schema, Document } from 'mongoose';
import Movie from './Movie';

export interface IPerson extends Document {
  nconst: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  profession: string[];
  knownFor: mongoose.Types.ObjectId[];
}

const PersonSchema = new Schema(
  {
    nconst: { type: String, unique: true, index: true },
    name: { type: String, index: true },
    birthYear: Number,
    deathYear: Number,
    profession: [String],
    knownFor: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
  },
  { timestamps: true }
);

export default mongoose.model<IPerson>('Person', PersonSchema);
