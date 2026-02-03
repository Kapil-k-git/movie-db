import type { Request, Response } from "express";
import Movie from "../models/Movie";

export const searchMovies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { year, genre, type, personName, limit } = req.query;

    const matchStage: any = {};
    if (year) matchStage.year = Number(year);
    if (type) matchStage.type = type;
    if (genre) {
      const cleanGenre = String(genre).replace(/['"]/g, "");
      matchStage.genres = { $in: [cleanGenre] };
    }

    const peopleNameRegex =
      personName && String(personName).trim()
        ? new RegExp(String(personName).trim(), "i")
        : null;

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "people",
          let: { movieId: "$_id", movieIdStr: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $in: ["$$movieId", "$knownFor"] },
                    { $in: ["$$movieIdStr", "$knownFor"] },
                  ],
                },
                // Add name filter only if personName is provided
                ...(peopleNameRegex
                  ? { name: { $regex: peopleNameRegex } }
                  : {}),
              },
            },
            { $project: { name: 1, profession: 1 } },
          ],
          as: "people",
        },
      },
    ];

    if (peopleNameRegex) {
      pipeline.push({ $match: { "people.0": { $exists: true } } });
    }

    pipeline.push({ $limit: Number(limit) || 20 });

    pipeline.push({
      $project: {
        title: 1,
        year: 1,
        type: 1,
        genres: 1,
        runtimeMinutes: 1,
        people: { name: 1, profession: 1 },
      },
    });

    const moviesWithPersons = await Movie.aggregate(pipeline);

    res.status(200).json(moviesWithPersons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
