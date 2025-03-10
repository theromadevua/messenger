import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model.js'

class tokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.SECRET_REY, {expiresIn: '10m'})
        const refreshToken = jwt.sign(payload, process.env.SECRET_REY, {expiresIn: '30d'})
        return {
            accessToken, refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }

    validateToken(token){
        try {
            const userData = jwt.verify(token, process.env.SECRET_REY)
            return userData
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }
}

const TokenService = new tokenService()
export default TokenService