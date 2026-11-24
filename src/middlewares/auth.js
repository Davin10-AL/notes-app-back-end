import TokenManager from '../security/token-manager.js';
import { AuthenticationError } from '../exceptions/index.js';
import response from '../utils/response.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response(res, 401, 'Missing or invalid Authorization header', null);
  }

  const token = authHeader.slice(7);

  try {
    const payload = TokenManager.verifyAccessToken(token);
    req.userId = payload.userId;
    return next();
  } catch (err) {
    if (err instanceof AuthenticationError) {
      return response(res, err.statusCode, err.message, null);
    }
    return next(err);
  }
};

export default authMiddleware;
