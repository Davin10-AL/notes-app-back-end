const response = (res, statusCode, message, data) => {
  return res
    .status(statusCode)
    .json({
      status: statusCode < 400 ? 'success' : statusCode === 403 ? 'fail' : 'failed',
      message,
      data,
    })
    .end();
};
 
export default response;