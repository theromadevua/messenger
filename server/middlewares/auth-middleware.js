import ApiError from "../exceptions/api-error.js";
import User from "../models/user-model.js";
import TokenService from "../services/token-service.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = TokenService.validateToken(token);
    const user = await User.findOne({ email: decoded.email }).populate('avatar');
    if (!user) {
      throw ApiError.BadRequest("Invalid token");
    }
    req.user = user;
    next(); 
  } catch (error) {
    return next(ApiError.BadRequest("Invalid token"));
  }
};

export default authenticateToken;
