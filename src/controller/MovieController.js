import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";


class MovieController {
    constructor() {
        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
    }

    async getMovieById(id = 0) {
        const query = `SELECT * FROM movie_notes WHERE id = ${id}`;

        const movie = await new Promise((resolve, reject) => {
            db.query(query, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return movie[0];
    }

    async getUserById(id = 0) {
        const query = `SELECT * FROM users WHERE id = ${id}`;

        const user = await new Promise((resolve, reject) => {
            db.query(query, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return user[0];
    }

    validatorTitle(title) {
        const minCharacters = 2;
        const maxCharacters = 40;

        if (title) {
            if (title.length >= minCharacters && title.length <= maxCharacters)
                return { statusError: false, message: `Título correto` };
            return { statusError: true, message: `O título do filme deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
        }
        return { statusError: true, message: `Não foi informado um título` };
    }

    validatorDescription(description) {
        const minCharacters = 0;
        const maxCharacters = 999;

        if (description) {
            if (description.length >= minCharacters && description.length <= maxCharacters)
                return { statusError: false, message: `Descrição correto` };
            return { statusError: true, message: `A descrição deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
        }
        return { statusError: true, message: `Não foi informada uma descrição` };
    }

    validatorRating(rating) {
        const minRating = 0;
        const maxRating = 10;

        if (!NaN && Number.isInteger(rating) && rating >= minRating && rating <= maxRating)
            return { statusError: false, message: `Nota de classificação correta` };
        return { statusError: true, message: `A nota de classificação deverá ser um número inteiro entre ${minRating} e ${maxRating}` };
    }

    validatorUserId(id) {
        if (!NaN && Number.isInteger(id))
            return { statusError: false, message: `Id de usuário correto` };
        return { statusError: true, message: `O id de usuário apresenta problemas` };
    }

    async create(req, res) {
        const { title, description, rating, user_id } = req.body;
        const queryInsert = `INSERT INTO movie_notes (title, description, rating, user_id)
                    values(?, ?, ?, ?)`;

        try {
            const validTitle = this.validatorTitle(title);
            const validDescription = this.validatorDescription(description);
            const validUserId = this.validatorUserId(user_id);

            if (validTitle.statusError)
                throw new Error(validTitle.message);
            if (validDescription.statusError)
                throw new Error(validDescription.message);
            if(rating){
                const validRating = this.validatorRating(rating);

                if(validRating.statusError)
                    throw new Error(validRating.message);
            }
            if(validUserId.statusError)
                throw new Error(validUserId.message);

            const existingUser = await this.getUserById(user_id);

            if(!existingUser)
                throw new Error("O usuário informado não existe na base de dados");

            const values = [title, description, rating, user_id];
            const data = await new Promise((resolve, reject) => {
                db.query(queryInsert, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(data);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async read(req, res) {
        const querySelect = `SELECT * FROM movie_notes`;

        try {
            const movieNotes = await new Promise((resolve, reject) => {
                db.query(querySelect, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(movieNotes);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { title, description, rating } = req.body;

        const queryUpdate = `UPDATE movie_notes 
                    SET title = ?, description = ?, rating = ?, updated_at = ?
                    WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O valor ${id} não é valido para ID`);

            const movie = await this.getMovieById(id);

            if (!movie)
                throw new Error(`A nota do filme não foi encontrada`);

            if (title) {
                const validTitle = this.validatorTitle(title);

                if (validTitle.statusError)
                    throw new Error(validTitle.message);
                movie.title = title;
            }

            if (description) {
                const validDescription = this.validatorDescription(description);

                if (validDescription.statusError)
                    throw new Error(validDescription.message);
                movie.description = description;
            }

            if(rating){
                const validRating = this.validatorRating(rating);

                if(validRating.statusError)
                    throw new Error(validRating.message);
                movie.rating = rating;
            }

            const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const values = [movie.title, movie.description, movie.rating, formattedDate, id];
            const data = await new Promise((resolve, reject) => {
                db.query(queryUpdate, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(movie);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async delete(req, res) {
        const { id } = req.body;
        const queryDelete = `DELETE FROM movie_notes 
                     WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O valor ${id} não é valido para ID`);
            if (!(await this.getMovieById(id)))
                throw new Error(`A nota do filme não foi encontrada`);

            const values = [id];
            const movie = await new Promise((resolve, reject) => {
                db.query(queryDelete, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(movie);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default MovieController;