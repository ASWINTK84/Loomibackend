import express from 'express'
import { registerController ,loginController, testController, forgotPasswordController, getAllUsersController, updateUserRoleController, toggleBlockStatusController, deleteUserController, getUserDetailsController, googleLoginController, updateProfile } from "../controller/authController.js";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';


const router = express.Router();





router.post('/register', registerController)




router.post('/login', loginController)

//Forgot password || post is the  method

router.post('/forgot-password' , forgotPasswordController)


//test Route 

router.get('/test', requireSignIn ,isAdmin ,testController)


//Protected user Route auth

router.get('/user-auth' , requireSignIn , (req , res) =>{
    res.status(200).send({ok: true})
})




//Protected Route admin auth

router.get('/admin-auth' , requireSignIn, isAdmin , (req , res) =>{
    res.status(200).send({ok: true})
})

router.get('/all-users', getAllUsersController);


// PUT: Update role
router.put("/update-role/:id", updateUserRoleController);

// (Optional) PUT: Toggle block status
router.put("/toggle-block/:id", toggleBlockStatusController);
 
//dellete routes

router.delete("/delete/:id", deleteUserController);


//single user
router.get("/user-details/:id", getUserDetailsController);

//google route
router.post('/google-login', googleLoginController);

//update
router.put('/update-profile', requireSignIn, updateProfile);




export default router