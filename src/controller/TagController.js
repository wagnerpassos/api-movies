import db from "../database/db.js";
import { createTag, deleteTag, getAllTags, updateTag } from "../services/tagService.js";
import appErrorInstance from "../util/AppError.js";

class TagController {
    async create(req, res) {
        const { name, note_id } = req.body;

        try {
            const response = await createTag({tag: {name, note_id}})

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async read(req, res) {
        try {
            const response = await getAllTags();

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const response = await updateTag({tag: {id, name}})

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            const response = await deleteTag(id);

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default TagController;