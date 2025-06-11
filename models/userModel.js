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
        // Password is not required if the user is a Google user
        required: function() {
            return !this.isGoogleUser;
        },
    },
    phone: {
        type: String,
        required: true, // Consider if phone/address are truly required for Google users
    },
    address: {
        type: String,
        required: true, // Consider if phone/address are truly required for Google users
    },
    answer:{
        type: String,
        // Answer is not required if the user is a Google user
        required: function() {
            return !this.isGoogleUser;
        },
    },
    role: {
        type: Number,
        enum: [0, 1], // Restrict role to 0 (user) or 1 (admin)
        default: 0,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    googleId: { // New field to store Google user ID
        type: String,
        unique: true,
        sparse: true, // Allows null values, so unique constraint only applies to non-null values
    },
    isGoogleUser: { // New flag to identify users signed up via Google
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

export default mongoose.model('users', userSchema)