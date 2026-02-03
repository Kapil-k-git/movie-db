import type { Request, Response } from "express";
import Movie from "../models/Movie";

export const getMovieList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movies = await Movie.find().limit(20);
    res.status(200).json(movies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { year, genre, type, personName } = req.query;

    const matchStage: any = {};

    if (year) matchStage.year = Number(year);
    if (type) matchStage.type = type;
    if (genre) {
      const cleanGenre = String(genre).replace(/['"]/g, '');
      matchStage.genres = { $in: [cleanGenre] };
    }

    const peopleNameRegex =
      personName && String(personName).trim()
        ? new RegExp(String(personName).trim(), 'i')
        : null;

    const moviesWithPersons = await Movie.aggregate([
      { $match: matchStage },
      { $limit: 100 },

      // Join people (optionally filter by personName inside the join)
      peopleNameRegex
        ? {
            $lookup: {
              from: 'people',
              let: { movieId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ['$$movieId', '$knownFor'] },
                    name: { $regex: peopleNameRegex },
                  },
                },
                { $project: { name: 1, profession: 1 } },
              ],
              as: 'people',
            },
          }
        : {
            $lookup: {
              from: 'people',
              localField: '_id',
              foreignField: 'knownFor',
              as: 'people',
            },
          },

      // If personName is provided, only keep movies that have at least one matching person
      ...(peopleNameRegex ? [{ $match: { 'people.0': { $exists: true } } }] : []),

      // 4️⃣ Shape response
      {
        $project: {
          title: 1,
          year: 1,
          type: 1,
          genres: 1,
          runtimeMinutes: 1,
          people: { name: 1, profession: 1 },
        },
      },
    ]);

    res.status(200).json(moviesWithPersons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
