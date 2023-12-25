const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// -----------------------------------------------------------------------------------------------
//                                      USING TRY CATCH METHOD
// -----------------------------------------------------------------------------------------------

// const fn1 = () => {}
// const fn1 = (fn2) => () => {}
// const fn1 = (fn2) => async (fn3) => {}

//=================================================================================================
/* whenever we want to execute the next function one after one semulteniously then we use .next it is an example of higher order function.  */
// ================================================================================================

// const asyncHandler = (functionName) => async (req, res, next) => {
//     try{

//     } catch (error) {
//         res.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         })
//     }
// }

// export { asyncHandler }
