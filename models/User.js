import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User' } ]
    
})

export default mongoose.model('User', UserSchema)