import TokenManager from '../../../utils/token-manager.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import response from '../../../utils/response.js';

export const postAuthentication = async (req, res, next) => {
  try {
    const { username, password } = req.validated;

    const userId = await AuthenticationRepositories.verifyUserCredential({ username, password });

    const accessToken = TokenManager.generateAccessToken({ userId });
    const refreshToken = TokenManager.generateRefreshToken({ userId });

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

    const { userId } = TokenManager.verifyRefreshToken(refreshToken);

    const accessToken = TokenManager.generateAccessToken({ userId });

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
