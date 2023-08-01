import db from "../database/db.js";

class UserController {
    async create(req, res) {
        const {name, email} = req.body;

        res.json({"message": "CREATE", "name": name, "email": email});
    }

    async read(req, res) {
        const query = `SELECT * FROM users`;

        db.query(query, (err, data) => {
            if(err) {
                return res.json({'error': err.message});
            }
            return res.json(data);
        });

        
    }

    async update(req, res) {
        res.json({"message": "UPDATE"});
    }

    async delete(req, res) {
        res.json({"message": "DELETE"});
    }
}

export default UserController;