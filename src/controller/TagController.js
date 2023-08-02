import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";


class TagController {
    constructor() {
        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
    }

    async create(req, res) {
        res.send("CREATE OK");
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
        res.send("UPDATE OK");
    }

    async delete(req, res) {
        res.send("DELETE OK");
    }
}

export default TagController;