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

            const hashedPassword = bcryptjs.hashSync(password, 8);
            const values = [name, email, hashedPassword];

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
        const { id } = req.params;
        const { name, email, password, old_password } = req.body;

        const queryUpdate = `UPDATE users 
                    SET name = ?, email = ?, password = ?, updated_at = ?
                    WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O id: ${id} não existe`);

            const user = await this.getUserById(id);

            if (!user)
                throw new Error(`O usuário não foi encontrado`);

            if (name) {
                const validName = this.validatorName(name);

                if (validName.statusError)
                    throw new Error(validName.message);
                user.name = name;
            }

            if (email) {
                const validEmail = this.validatorEmail(email);

                if (validEmail.statusError)
                    throw new Error(validEmail.message);
                user.email = email;
            }

            if (password && old_password) {
                const validPassword = this.validatorPassword(password);
                const validOldPassword = this.validatorPassword(old_password);

                if (validPassword.statusError)
                    throw new Error(validPassword.message);
                if (validOldPassword.statusError)
                    throw new Error(validOldPassword.message);
                if (!(await bcryptjs.compare(old_password, user.password)))
                    throw new Error(`A senha anterior não confere com a informada`);

                user.password = bcryptjs.hashSync(password, 8);
            }

            const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const values = [user.name, user.email, user.password, formattedDate, id];
            const data = await new Promise((resolve, reject) => {
                db.query(queryUpdate, values, (error, data) => {
                    if (error)
                        reject(error);
                    resolve(data);
                });
            });

            res.json(user);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async delete(req, res) {
        const { id } = req.body;
        const queryDelete = `DELETE FROM users 
                     WHERE id = ?`;

        try {
            if (!id)
                throw new Error(`O id: ${id} não existe`);
            if (!(await this.getUserById(id)))
                throw new Error(`O usuário não foi encontrado`);
            const values = [id];
            const data = await new Promise((resolve, reject) => {
                db.query(queryDelete, values, (error, data) => {
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
}

export default UserController;