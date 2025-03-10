import userModel from "../models/user-model.js"
import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import TokenService from "./token-service.js"

import tokenModel from "../models/token-model.js"
import UserDto from "../dtos/user-dto.js"
import ApiError from "../exceptions/api-error.js"
import mediaService from "./media-service.js"
import User from "../models/user-model.js"
import mediaModel from "../models/media-model.js"
import userStatusService from "./userStatus-service.js"


class userService{
    async registration(username, email, password){
            console.log('aaaa')
            const exist_user = await userModel.findOne({email})
            if (exist_user){
                throw ApiError.BadRequest(`user with same email already exist`)
            }
            const exist_user2 = await userModel.findOne({username})
            if (exist_user2){
                throw ApiError.BadRequest(`user with such username already exist`)
            }

            

            const hashPassword = await bcrypt.hash(password, 3)
            const activationLink = uuid.v4()
            const user = await userModel.create({email, password: hashPassword, username, name: username, activationLink})

       
            user.save()

          
            const userData = new UserDto(user)
            const tokens = TokenService.generateTokens({...userData})
            await TokenService.saveToken(userData.id, tokens.refreshToken)

            return {
                ...tokens,
                user: userData
            }
    }


    async login(email, password){
        const user = await userModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest(`user with such email does not exist`)
        }

        const passPassword = await bcrypt.compare(password, user.password)

        if(!passPassword){
            throw ApiError.BadRequest(`uncorrect password`)
        }

        const userData = new UserDto(user)
        const tokens = TokenService.generateTokens({...userData})
        await TokenService.saveToken(userData.id, tokens.refreshToken)

        return {
            ...tokens,
            user
        }
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnathorizedError()
        }

        const tokenData = TokenService.validateToken(refreshToken)

        const tokenInDb = await tokenModel.findOne({refreshToken})
        if(!tokenInDb || !tokenData){
            throw ApiError.UnathorizedError()
        }

        const user = await userModel.findOne({_id: tokenData.id}).populate('avatar')//.populate({path: 'publicChats', populate: {path: 'last_message', populate: 'from_user'}}).populate( {path: 'privateChats', populate: ['with_user', 'last_message']}).populate({path: 'savedMessages', populate: 'last_message'})

        if(!user){
            throw ApiError.UnathorizedError()
        }

        const userData = new UserDto(user)
        
        const tokens = TokenService.generateTokens({...userData})
        await TokenService.saveToken(userData.id, tokens.refreshToken)

        return {
            ...tokens,
            user
        }
    }

    async changeUserInfo({user, name, description, username, avatar}){
        
        if(avatar){
            const uploadFile = await mediaService.saveFile(avatar, 'avatars')
            if (!uploadFile) throw ApiError.BadRequest('error when upploading file')
            const media = new mediaModel({
                url: uploadFile.url,
                width: uploadFile.width,
                height: uploadFile.height,
                aspectRatio: uploadFile.aspectRatio,
                type: 'image', 
            })
            media.save()
            console.log(media)
            user.avatar = media
        }
        if(name){
            user.name = name
        }
        if(username){
            user.username = username
        }
        if(description){
            user.description = description
        }

        user.save()
        return user
    }

    async searchUsers(query) {
        try {
            const users = await User.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } }
            ]
            }).select('username name _id avatar').populate('avatar');
            return users;
        } catch (error) {
            throw ApiError.BadRequest('error when fiding users')
        }
      }

    async getUser(id){
        console.log(id)
        const user = await User.findOne({_id: id}).populate('avatar').lean()
        if(!user){
            throw ApiError.BadRequest('error when fiding user')
        }
        const status = userStatusService.isUserOnline(id)
        user.online = status;
        return ({user, userIdsForSubscription: [id]})
    }
}



let UserService = new userService()
export default UserService