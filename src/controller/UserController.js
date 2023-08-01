import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";


class UserController {
    async create(req, res) {
        const { name, email } = req.body;

        res.json({ "message": "CREATE", "name": name, "email": email });
    }

    async read(req, res) {
        const query = `SELECT * FROM users`;

        try {
            const user = await new Promise((resolve, reject) => {
                    db.query(query, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });
            
            res.json(user[0]);
        } catch (error) {
            appErrorInstance.throwError(res, error.message );
        }        
    }

    async update(req, res) {
        res.json({ "message": "UPDATE" });
    }   

    async delete(req, res) {
        res.json({ "message": "DELETE" });
    }
}

export default UserController;