import db from "../database/db.js";
import { getAllMovies, getMovieById, updateMovie, createMovie, deleteMovie } from "../services/movieService.js";
import appErrorInstance from "../util/AppError.js";

class MovieController {

    async create(req, res) {
        const { title, description, rating, user_id } = req.body;

        try {
        const response = await createMovie({movie: {title, description, rating, user_id}})

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async read(req, res) {
        const querySelect = `SELECT * FROM movie_notes`;

        try {
            const response = await getAllMovies();

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async readById(req, res) {
        const { id } = req.params;

        try {
            if (!id)
                throw new Error(`O valor ${id} não é valido para ID`);

            const movie = await getMovieById(id);

            if (!movie)
                throw new Error(`A nota do filme não foi encontrada`);

            res.json(movie);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { title, description, rating } = req.body;

        try{
            const data = updateMovie({movie: {id,title, description, rating}});

            res.json(data);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async delete(req, res) {
        const { id } = req.body;

        try {
            const movie = await deleteMovie(id);

            res.json(movie);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default MovieController;