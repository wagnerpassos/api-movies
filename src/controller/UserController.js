import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";
import bcryptjs from 'bcryptjs';


class UserController {
    constructor() {
        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
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

    validatorPassword(password) {
        const minCharacters = 3;
        const maxCharacters = 10;

        if (password) {
            if (password.length >= minCharacters && password.length <= maxCharacters)
                return { statusError: false, message: `Nome correto` };
            return { statusError: true, message: `A senha deve ter de ${minCharacters} até ${maxCharacters} caracteres` };
        }
        return { statusError: true, message: `Não foi informada uma senha` };
    }

    validatorName(name) {
        const minCharacters = 4;
        const maxCharacters = 20;

        if (name) {
            if (name.length >= minCharacters && name.length <= maxCharacters)
                return { statusError: false, message: `Nome correto` };
            return { statusError: true, message: `O nome deve ter de ${minCharacters} até ${maxCharacters} caracteres` };
        }
        return { statusError: true, message: `Não foi informado um nome` };
    }

    validatorEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        if (email && emailRegex.test(email)) {
            return { statusError: false, message: `Email correto` };
        }

        return { statusError: true, message: `O email informado não está em um padrão válido` };
    }


    async create(req, res) {
        const { name, email, password } = req.body;
        const queryInsert = `INSERT INTO users (name, email, password)
                    values(?, ?, ?)`;

        try {
            const validName = this.validatorName(name);
            const validEmail = this.validatorEmail(email);
            const validPassword = this.validatorPassword(password);

            if (validName.statusError)
                throw new Error(validName.message);
            if (validEmail.statusError)
                throw new Error(validEmail.message);
            if (validPassword.statusError)
                throw new Error(validPassword.message);

            const values = [name, email, password];

            const user = await new Promise((resolve, reject) => {
                db.query(queryInsert, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json({ user });
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }



    }



    async read(req, res) {
        const querySelect = `SELECT * FROM users`;

        try {
            const user = await new Promise((resolve, reject) => {
                db.query(querySelect, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(user[0]);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
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