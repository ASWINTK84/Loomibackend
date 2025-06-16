import mongoose, { Types } from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        
        required: function() {
            return !this.isGoogleUser;
        },
    },
    phone: {
        type: String,
        required: false, 
    },
    address: {
        type: String,
        required: false, 
    },
    answer:{
        type: String,
        
        required: function() {
            return !this.isGoogleUser;
        },
    },
    role: {
        type: Number,
        enum: [0, 1], 
        default: 0,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    googleId: { 
        type: String,
        unique: true,
        sparse: true, 
    },
    isGoogleUser: { 
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

export default mongoose.model('users', userSchema)