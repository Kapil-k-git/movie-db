import type { Request, Response } from "express";
import Movie from "../models/Movie";
import Person from "../models/Person";


export const getPersonList = async (req: Request, res: Response): Promise<void> => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPeople = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, profession, movieTitle } = req.query;

    const personQuery: any = {};

    if (name) {
      personQuery.name = { $regex: name, $options: 'i' };
    }

    if (profession) {
      personQuery.profession = { $in: [profession] };
    }

    if (movieTitle) {
      const movies = await Movie.find({
        title: { $regex: movieTitle as unknown as string, $options: 'i' }
      });

      personQuery.knownFor = { $in: movies.map(m => m._id) };
    }

    const people = await Person.find(personQuery)
      .populate('knownFor', 'title year type')
      .select('name birthYear deathYear profession knownFor');

    res.status(200).json(people);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
