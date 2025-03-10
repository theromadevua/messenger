import UserService from "../services/user-service.js"
import UserModel from '../models/user-model.js'

class userController {
    
    async getUser(req, res, next){
        try {
            const {id} = req.params
            const userData = await UserService.getUser(id)
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }


   async registration(req, res, next){
        try {
            const {
                username,
                email,
                password
            } = req.body

            const userData = await UserService.registration(username, email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, SameSite: 'None'})
            return res.json(userData)
        } catch (error) {
            next(error)
        } 
   }

    async login(req, res, next){
        try {
            const {email, password} = req.body
            const userData = await UserService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, secure: false, httpOnly: true, SameSite: 'None'})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next){
        try {
            res.clearCookie('refreshToken')
            return res.json()
        } catch (error) {
            next(error)
        }
    }


    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', token.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, secure: false, httpOnly: true, SameSite: 'None'})
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }


    async changeProfile(req, res, next){
        try {
            const {name, username, description} = req.body
            const {avatar} = req.files || {}
            console.log(avatar)
            const changedUser = await UserService.changeUserInfo({user: req.user, name, username, description, avatar: avatar || null})
            return res.json(changedUser)
        } catch (error) {
            next(error)
        }
    }

    async searchUsers(req, res, next){
        try {
            const {query} = req.query
            const users = await UserService.searchUsers(query)
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }

}

let UserController = new userController()
export default UserController