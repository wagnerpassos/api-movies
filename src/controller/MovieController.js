import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";


class MovieController {
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
        res.send("READ OK");
    }

    async update(req, res) {
        res.send("UPDATE OK");
    }

    async delete(req, res) {
        res.send("DELETE OK");
    }
}

export default MovieController;