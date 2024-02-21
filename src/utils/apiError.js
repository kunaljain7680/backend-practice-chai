// centralised error handling 
// in files pe focus mt krna nahi smjh arha chhod do 

class ApiError extends Error{

    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""  // error stack
    ){
        // overriding

        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}