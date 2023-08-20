import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";
import { getUserById, createUser, getAllUsers, deleteUser, updateUser } from "../services/userservice.js";

class UserController {
    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            const response = await createUser({user:{name, email, password}});
            
            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async read(req, res) {
        const querySelect = `SELECT * FROM users`;

        try {
            const response = await getAllUsers();

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async readById(req, res) {
        const { id } = req.params;

        try {
            const user = await getUserById(id);

            if (!user)
                throw new Error(`O usuário não foi encontrado`);

            res.json(user);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const { id } = req.params;

        try {
            const response = updateUser({user:{name, email, password, old_password, id}})

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            const response = deleteUser(id);

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default UserController;