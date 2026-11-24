const response = (res, statusCode, message, data) => {
  return res
    .status(statusCode)
    .json({
      status: statusCode < 400 ? 'success' : 'failed',
      message,
      data,
    })
    .end();
};
 
export default response;