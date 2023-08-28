import db from "../database/db.js";

async function getUserByEmail(email) {
    const query = ` SELECT * 
                    FROM users 
                    WHERE email = ?`;

    const data = await new Promise((resolve, reject) => {
        db.query(query, [email], (error, data) => {
            if (error)
                reject(error);
            resolve(data);
        });
    });

    return data[0];
}

export { getUserByEmail };