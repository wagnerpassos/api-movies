import db from "../database/db.js";
import { getUserById } from "./userService.js"

function validatorTitle(title) {
    const minCharacters = 2;
    const maxCharacters = 40;

    if (title) {
        if (title.length >= minCharacters && title.length <= maxCharacters)
            return { statusError: false, message: `Título correto` };
        return { statusError: true, message: `O título do filme deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informado um título` };
}

function validatorDescription(description) {
    const minCharacters = 0;
    const maxCharacters = 999;

    if (description) {
        if (description.length >= minCharacters && description.length <= maxCharacters)
            return { statusError: false, message: `Descrição correto` };
        return { statusError: true, message: `A descrição deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informada uma descrição` };
}

function validatorRating(rating) {
    const minRating = 0;
    const maxRating = 10;

    if (!NaN && Number.isInteger(rating) && rating >= minRating && rating <= maxRating)
        return { statusError: false, message: `Nota de classificação correta` };
    return { statusError: true, message: `A nota de classificação deverá ser um número inteiro entre ${minRating} e ${maxRating}` };
}

async function createMovie({ movie }) {
    const { title, description, rating, user_id } = movie;
    const queryInsert = `   INSERT INTO movie_notes
                            (title, description, rating, user_id)
                            values(?, ?, ?, ?)`;

    try {
        const validTitle = validatorTitle(title);
        const validDescription = validatorDescription(description);

        if (validTitle.statusError)
            throw new Error(validTitle.message);
        if (validDescription.statusError)
            throw new Error(validDescription.message);
        if (rating) {
            const validRating = validatorRating(rating);

            if (validRating.statusError)
                throw new Error(validRating.message);
        }

        const existingUser = await getUserById(user_id);

        if (!existingUser)
            throw new Error("O usuário informado não existe na base de dados");

        const values = [title, description, rating, user_id];
        const data = await new Promise((resolve, reject) => {
            db.query(queryInsert, values, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllMovies() {
    const querySelect = `   SELECT * 
                            FROM movie_notes`;

    try {
        const data = await new Promise((resolve, reject) => {
            db.query(querySelect, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getMovieById(id = 0) {
    const query = `SELECT * FROM movie_notes WHERE id = ?`;

    const data = await new Promise((resolve, reject) => {
        db.query(query, [id], (error, data) => {
            if (error)
                reject(error);
            resolve(data);
        });
    });

    return data[0];
}

async function updateMovie({ movie }) {
    const { id, title, description, rating } = movie;
    const queryUpdate = `UPDATE movie_notes 
                    SET title = ?, 
                    description = ?, 
                    rating = ?, 
                    updated_at = ?
                    WHERE id = ?`;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);

        const movieTmp = await getMovieById(id);

        if (!movieTmp)
            throw new Error(`A nota do filme não foi encontrada`);

        if (title) {
            const validTitle = validatorTitle(title);

            if (validTitle.statusError)
                throw new Error(validTitle.message);
            movieTmp.title = title;
        }

        if (description) {
            const validDescription = alidatorDescription(description);

            if (validDescription.statusError)
                throw new Error(validDescription.message);
            movieTmp.description = description;
        }

        if (rating) {
            const validRating = validatorRating(rating);

            if (validRating.statusError)
                throw new Error(validRating.message);
            movieTmp.rating = rating;
        }

        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const values = [movieTmp.title, movieTmp.description, movieTmp.rating, formattedDate, id];
        const data = await new Promise((resolve, reject) => {
            db.query(queryUpdate, values, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteMovie(id = 0) {
    const queryDelete = `   DELETE FROM movie_notes 
                            WHERE id = ?`;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);
        if (!(await getMovieById(id)))
            throw new Error(`A nota do filme não foi encontrada`);

        const data = await new Promise((resolve, reject) => {
            db.query(queryDelete, [id], (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};