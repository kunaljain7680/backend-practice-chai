// in files pe focus mt krna nahi smjh arha chhod do 

class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data;
        this.message=message
        this.sucess=statusCode<400  // 400 stauts code se niche koi bhi ho vo response hoga uske upar vala send through apiError
    }
}

export {ApiResponse}