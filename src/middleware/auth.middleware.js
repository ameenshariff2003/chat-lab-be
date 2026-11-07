import jwt from "jsonwebtoken"


export const middlewareAll = {
   getme:async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            msg:"user is not authenticated",
            success:false,
            err:"No Token Provided"
        })
    }
    try {
        const decode = jwt.verify(token,process.env.JWTTOKEN)
    
    req.user=decode;
    
    next()
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg:"Unauthorized",
            success:false,
            err:"invalid token"
        })
        
    }
    

   }
}