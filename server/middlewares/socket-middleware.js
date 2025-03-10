import jwt from 'jsonwebtoken';
import TokenService from '../services/token-service.js';
import User from '../models/user-model.js';

async function socketMiddleware(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  try {
    const decoded = TokenService.validateToken(token);
    const user = await User.findOne({ email: decoded.email }).populate('avatar');
    if (!user) {
      throw ApiError.BadRequest("Invalid token");
    }
    socket.user = user; 
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
}

export default socketMiddleware