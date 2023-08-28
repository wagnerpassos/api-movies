import db from "../database/db.js";
import { getMovieById } from "./movieService.js";

function validatorName(tagName) {
    const minCharacters = 2;
    const maxCharacters = 40;

    if (tagName) {
        if (tagName.length >= minCharacters && tagName.length <= maxCharacters)
            return { statusError: false, message: `TAG correto` };
        return { statusError: true, message: `A TAG do filme deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informado um nome de TAG` };
}

async function createTag({ tag }) {
    const { name, note_id } = tag;
    const queryInsert = `   INSERT INTO movie_tags 
                            (name, note_id)
                            values(?, ?)`;

    try {
        const validName = validatorName(name);

        if (validName.statusError)
            throw new Error(validName.message);

        const existingMovie = await getMovieById(note_id);

        if (!existingMovie)
            throw new Error("A nota de filme informada não existe na base de dados");

        const values = [name, note_id];
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

async function getAllTags() {
    const querySelect = `   SELECT * 
                            FROM movie_tags`;

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

async function getTagById(id = 0) {
    const query = ` SELECT * 
                    FROM movie_tags 
                    WHERE id = ?`;

    const data = await new Promise((resolve, reject) => {
        db.query(query, [id], (error, data) => {
            if (error)
                reject(error);
            resolve(data);
        });
    });

    return data[0];
}

async function updateTag({ tag }) {
    const {id, name} = tag;
    const queryUpdate = `   UPDATE movie_tags 
                            SET name = ?
                            WHERE id = ?`;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);

        const tagTmp = await getTagById(id);

        if (!tag)
            throw new Error(`A TAG não foi encontrada`);

        if (name) {
            const validName = validatorName(name);

            if (validName.statusError)
                throw new Error(validName.message);
            tagTmp.name = name;
        }

        const values = [tagTmp.name, id];
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

async function deleteTag(id = 0) {
    const queryDelete = `   DELETE FROM movie_tags 
                            WHERE id = ?`;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);
        if (!(await getTagById(id)))
            throw new Error(`A TAG não foi encontrada`);

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
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
};