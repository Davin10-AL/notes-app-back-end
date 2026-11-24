import jwt from 'jsonwebtoken';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';

export const postAuthentication = async (req, res, next) => {
  try {
    const { username, password } = req.validated;

    const userId = await AuthenticationRepositories.verifyUserCredential({ username, password });

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY);

    await AuthenticationRepositories.addRefreshToken(refreshToken);

    return response(res, 201, 'Authentication berhasil ditambahkan', { accessToken, refreshToken });
  } catch (err) {
    return next(err);
  }
};

export const putAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    await AuthenticationRepositories.verifyRefreshToken(refreshToken);

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    const accessToken = jwt.sign({ userId: payload.userId }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30m' });

    return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
  } catch (err) {
    return next(err);
  }
};

export const deleteAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    await AuthenticationRepositories.deleteRefreshToken(refreshToken);

    return response(res, 200, 'Refresh token berhasil dihapus', null);
  } catch (err) {
    return next(err);
  }
};
