import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";

class TagController {
    async create(req, res) {
        const { name, note_id } = req.body;
        const queryInsert = `INSERT INTO movie_tags (name, note_id)
                    values(?, ?)`;

        try {
            const validName = this.validatorName(name);
            const validMovieId = this.validatorMovieId(note_id);

            if (validName.statusError)
                throw new Error(validName.message);
            if(validMovieId.statusError)
                throw new Error(validMovieId.message);

            const existingMovie = await this.getMovieById(note_id);

            if(!existingMovie)
                throw new Error("A nota de filme informada não existe na base de dados");

            const values = [name, note_id];
            const tag = await new Promise((resolve, reject) => {
                db.query(queryInsert, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(tag);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async read(req, res) {
        const querySelect = `SELECT * FROM movie_tags`;

        try {
            const movieTags = await new Promise((resolve, reject) => {
                db.query(querySelect, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(movieTags);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        const queryUpdate = `UPDATE movie_tags 
                    SET name = ?
                    WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O valor ${id} não é valido para ID`);

            const tag = await this.getTagById(id);

            if (!tag)
                throw new Error(`A TAG não foi encontrada`);

            if (name) {
                const validName = this.validatorName(name);

                if (validName.statusError)
                    throw new Error(validName.message);
                tag.name = name;
            }

            const values = [tag.name, id];
            const data = await new Promise((resolve, reject) => {
                db.query(queryUpdate, values, (error, data) => {
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

    async delete(req, res) {
        const { id } = req.body;
        const queryDelete = `DELETE FROM movie_tags 
                     WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O valor ${id} não é valido para ID`);
            if (!(await this.getTagById(id)))
                throw new Error(`A TAG não foi encontrada`);

            const values = [id];
            const tag = await new Promise((resolve, reject) => {
                db.query(queryDelete, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(tag);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default TagController;