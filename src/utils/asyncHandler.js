
// using promises to handle async errors
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

/* 
using async/await to handle async errors
const asyncHandler = (fn) => async(req,res,next) => {
  try {
    await fn(req,res,next);
  } catch (error) {
    res.status(500||error.code).json({
      success:false,
      message: error.message,
      code: error.code,
    });
  }
}
*/
