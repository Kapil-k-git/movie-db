import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie';

dotenv.config({ path: '.env' });

const filePath = path.join(__dirname, '../../data/movie.tsv');

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/movie-db');
  console.log('Connected to MongoDB');

  fs.createReadStream(filePath)
    .pipe(csv({ separator: '\t' }))
    .on('data', async (row: any) => {
      if (row.isAdult === '1' || !row.startYear) return;

      const year = Number(row.startYear);
      if (Number.isNaN(year)) return;

      await Movie.updateOne(
        { tconst: row.tconst },
        {
          tconst: row.tconst,
          title: row.primaryTitle,
          type: row.titleType,
          year,
          runtimeMinutes: Number(row.runtimeMinutes) || null,
          genres: row.genres?.split(',') || []
        },
        { upsert: true }
      );
    })
    .on('end', () => {
      console.log('Movies seeded');
      process.exit(0);
    });
};

run();
