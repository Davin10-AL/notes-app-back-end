import jwt from 'jsonwebtoken';
import response from '../utils/response.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response(res, 401, 'Missing or invalid Authorization header', null);
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.userId = payload.userId;
    return next();
  } catch {
    return response(res, 401, 'Access token tidak valid', null);
  }
};

export default authMiddleware;
