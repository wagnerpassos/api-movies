import db from "../database/db.js";

validatorName(tagName) {
    const minCharacters = 2;
    const maxCharacters = 40;

    if (tagName) {
        if (tagName.length >= minCharacters && tagName.length <= maxCharacters)
            return { statusError: false, message: `TAG correto` };
        return { statusError: true, message: `A TAG do filme deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informado um nome de TAG` };
}

async function createTag({ movie }) {
   
}

async function getAllTags() {
    
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
   
}

async function deleteTag(id = 0) {
    
}

export {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
};