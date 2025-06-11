import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';


//Protected routes - tocken baesed
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

       if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }


    const token = authHeader.split(" ")[1]; // extract token from "Bearer <token>"

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("Token error:", error.message);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// admin access

export const isAdmin = async (req , res , next)=>{
    try {

        const user = await userModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(401).send({
                success:false ,
                message : "Unautherized access"
            })
        } else{
            next()
        }
        
    } catch (error) {
        console.log(error);
       res.status(401).send({
        message:"error in admin  middleware",
        success:false,
        error
       })
        
        
    }
}