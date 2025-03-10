import mediaService from "../services/media-service.js"


class ChatController {
    async uploadFile(req, res, next){
        try {
            const {file} = req.files
            const {folder} = req.query
            const uploadedFile = await mediaService.saveFile(file, folder)
            return res.json(uploadedFile)
        } catch (error) {
            next(error)
        }
    }
}

export default new ChatController()