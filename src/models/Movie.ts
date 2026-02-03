import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  tconst: string;
  title: string;
  type: string;
  year?: number;
  runtimeMinutes?: number;
  genres: string[];
}

const MovieSchema = new Schema(
  {
    tconst: { type: String, unique: true, index: true },
    title: { type: String, index: true },
    type: String,
    year: Number,
    runtimeMinutes: Number,
    genres: [String]
  },
  { timestamps: true }
);

export default mongoose.model<IMovie>('Movie', MovieSchema);
