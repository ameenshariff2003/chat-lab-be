import {body,validationResult} from "express-validator"

export function validate(req,res,next){
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    next()
}


export const validators ={
    login:()=>
       [ body("email")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isEmail().withMessage("please provide valid email adress"),

        body("password")
        .notEmpty().withMessage("Passcode is Required"),

        validate
       ]


    
}