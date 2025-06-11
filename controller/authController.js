import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto'; // Import crypto for secure random string generation

export const registerController = async (req , res)=>{
    try {
        const {name , email , password , phone , address , answer} = req.body

        // Validation
        if(!name){
            return res.status(400).send({ success: false, message:'Name is required'})
        }
        if(!email){
            return res.status(400).send({ success: false, message:'Email is required'})
        }
        if(!password){
            return res.status(400).send({ success: false, message:'Password is required'})
        }
        if(!phone){
            return res.status(400).send({ success: false, message:'Phone is required'})
        }
        if(!address){
            return res.status(400).send({ success: false, message:'Address is required'})
        }
        if(!answer){
            return res.status(400).send({ success: false, message:'Answer is required'})
        }

        // Check if user already exists
        const existinguser = await userModel.findOne({email})
        if(existinguser){
            return res.status(409).send({ // 409 Conflict for existing resource
                success: false, // Changed to false as it's not a new successful registration
                message:'User already registered. Please login.'
            })
        }

        // Register user
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
            isGoogleUser: false // Explicitly set for traditional registration
        });

        await user.save(); // <-- Moved this here, before sending response

        res.status(201).send({ // 201 Created for successful resource creation
            success: true,
            message:'User registered successfully',
            user: { // Exclude sensitive info from response
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                blocked: user.blocked,
                isGoogleUser: user.isGoogleUser
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success :false ,
            message:'Error in registration',
            error: error.message // Send error message for debugging if needed, or a generic one
        })
    }
}

//POST method for LOGIN
export const loginController = async (req , res)=>{
    try {
        const {email , password} = req.body

        // Validation
        if(!email || !password){
            return res.status(400).send({ // 400 Bad Request
                success:false ,
                message:'Invalid email or password'
            })
        }

        // Check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({ // 404 Not Found
                success:false ,
                message:'Email not registered'
            })
        }

        // Check if user is a Google user and disallow traditional login
        if (user.isGoogleUser) {
            return res.status(401).send({
                success: false,
                message: 'This account was registered with Google. Please use "Sign in with Google".'
            });
        }
        
        // Decryption and password match
        const match = await comparePassword(password , user.password)
        if(!match){
            return res.status(401).send({ // 401 Unauthorized
                success:false ,
                message:'Invalid password'
            })
        }

        // Token
        const token = await JWT.sign({_id:user._id} , process.env.JWT_SECRET , {expiresIn:"7d"} );

        res.status(200).send({
            success:true ,
            message:"Login successful" ,
            user: { // Exclude sensitive info from response
                _id: user._id,
                name:user.name ,
                email:user.email ,
                phone:user.phone,
                address:user.address,
                role: user.role,
                blocked: user.blocked,
                isGoogleUser: user.isGoogleUser
            },
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success :false ,
            message:'Error in login',
            error: error.message
        })
    }
}

//forgot password controller
export const forgotPasswordController = async (req , res)=>{
    try {
        const {email , answer , newPassword} = req.body

        if(!email){
            return res.status(400).send({ success: false, message:'Email is required'})
        }
        if(!answer){
            return res.status(400).send({ success: false, message:'Answer is required'})
        }
        if(!newPassword){
            return res.status(400).send({ success: false, message:'New password is required'})
        }

        // checking
        const user = await userModel.findOne({email , answer})

        //validation
        if(!user){
            return res.status(404).send({ // 404 Not Found
                success:false ,
                message:"Wrong email or answer"
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id , {password: hashed}, { new: true }) // Added new: true to return updated doc
        res.status(200).send({
            success:true ,
            message: "Password reset successful",
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ // Corrected typo: ststus -> status
            success:false ,
            message:"Something went wrong" ,
            error: error.message
        })
    }
}

//test controller
export const testController = (req , res)=>{
    console.log("Protected routes");
    res.send("Protected routes")
}

// Controller to get all users
export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password -answer"); // Exclude password and answer
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

export const updateUserRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (role === undefined || (role !== 0 && role !== 1)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Role must be 0 (user) or 1 (admin).",
            });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { role },
            { new: true, select: "-password -answer" } // Exclude sensitive fields
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Role updated to ${user.role === 1 ? "Admin" : "User"}`,
            user,
        });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({
            success: false,
            message: "Error updating role",
            error: error.message
        });
    }
};

export const toggleBlockStatusController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Toggle the blocked status
        user.blocked = !user.blocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
            user: { // Return updated user without sensitive info
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                blocked: user.blocked,
                isGoogleUser: user.isGoogleUser
            }
        });
    } catch (error) {
        console.error("Error toggling block status:", error);
        res.status(500).json({
            success: false,
            message: "Error toggling block status",
            error: error.message
        });
    }
};

//delete user
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

//single user
export const getUserDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select("-password -answer"); // Exclude sensitive info
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
            error: error.message
        });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await userModel.findOne({ email });

        if (!user) {
            // User does not exist, create a new one
            // Generate a secure random password for non-traditional login
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await hashPassword(randomPassword);

            user = await new userModel({
                name,
                email,
                googleId,
                password: hashedPassword, // Store a securely hashed random string
                phone: "", // Set as empty or a default string, consider if truly required by schema
                address: "", // Set as empty or a default string, consider if truly required by schema
                answer: "", // Set as empty or a default string, consider if truly required by schema
                isGoogleUser: true // Mark as Google-authenticated user
            }).save();
        } else {
            // User exists, but might not have googleId (e.g., if they first registered with email)
            // If existing user does not have googleId, update it
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            // If user is a traditional user and now logging in with Google, you might want to link accounts.
            // For now, if they are not marked as a Google user, we mark them if email matches
            if (!user.isGoogleUser) {
                user.isGoogleUser = true;
                await user.save();
            }
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: "Google login successful",
            user: { // Exclude sensitive info from response
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                blocked: user.blocked,
                isGoogleUser: user.isGoogleUser
            },
            token,
        });
    } catch (error) {
        console.log("Google Login Error:", error);
        res.status(401).send({
            success: false,
            message: "Invalid Google token or authentication failed.",
            error: error.message
        });
    }
};

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        // req.user._id is populated by requireSignIn middleware
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the fields
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: { // Exclude sensitive info from response
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                blocked: user.blocked,
                isGoogleUser: user.isGoogleUser
            },
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
};