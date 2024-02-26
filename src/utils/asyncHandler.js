// as bar bar try catch wala call prevent krne ke lie make one wrapper we will pass our function into this asyncHandler method

// s-1 const asyncHandler=()=>{}

// s-2 const asyncHandler=(func)=>{()=>{}}

// s-3 const asyncHandler=(func)=>async()=>{}  // passed function as a parameters and remove curly braces

// using try catch

// function ko further ek async function me pass krdia

// const asyncHandler=(fn)=>async(req,res,next)=>{

//     try {
        
//         await fn(req,res,next) // jo function liya h usko execute krna h
//     } catch (err) {
        
//         res.status(err.code||500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }

// using promises (production-level)

// 1. const asyncHandler = (requestHandler) => { ... }

// This declares a constant named asyncHandler and assigns it an arrow function.
// The arrow function takes a single argument named requestHandler, which is expected to be a function with the signature (req, res, next).
// 2. (req, res, next) => { ... }

// This defines another function within the asyncHandler function. This inner function is the actual middleware that will be used in Express.
// It takes three arguments:
// req: Represents the incoming HTTP request object.
// res: Represents the outgoing HTTP response object.
// next: A function that allows the middleware to pass control to the next middleware in the chain.
// 3. Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))

// This line uses Promises to handle the execution of the requestHandler function.
// Promise.resolve(requestHandler(req, res, next)):
// This calls the requestHandler function with the provided req, res, and next objects.
// Regardless of whether the requestHandler function throws an error or returns a value, Promise.resolve wraps the result in a resolved Promise. This ensures consistent handling of both successful and failed outcomes.
// .catch((err) => next(err)):
// This attaches a .catch handler to the Promise returned by Promise.resolve. This means if the requestHandler function throws an error, the error will be caught here.
// Inside the .catch handler, the error is passed to the next function. This is a common way to handle errors in Express middleware. By calling next(err), you signal to Express that an error occurred and allow it to be handled by the appropriate error handler middleware.

const asyncHandler=(requestHandler)=>{

    // accept as a function return as a function
    
    return (req,res,next)=>{

        // resolve me request hamdler execute krdo 
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))  // if error
    } 
}

export {asyncHandler}