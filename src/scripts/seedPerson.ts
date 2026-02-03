import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from '../models/Person';
import Movie from '../models/Movie';

dotenv.config({ path: '.env' });

const filePath = path.join(__dirname, '../../data/person.tsv');

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/movie-db');
  console.log('Connected to MongoDB');

  fs.createReadStream(filePath)
    .pipe(csv({ separator: '\t' }))
    .on('data', async (row) => {
      const movieDocs = await Movie.find({
        tconst: { $in: row.knownForTitles?.split(',') || [] }
      });

      await Person.updateOne(
        { nconst: row.nconst },
        {
          nconst: row.nconst,
          name: row.primaryName,
          birthYear: Number(row.birthYear) || null,
          deathYear: Number(row.deathYear) || null,
          profession: row.primaryProfession?.split(',') || [],
          knownFor: movieDocs.map(m => m._id)
        },
        { upsert: true }
      );
    })
    .on('end', () => {
      console.log('People seeded');
      process.exit(0);
    });
};

run();
