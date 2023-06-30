import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }] 
}, {timestamps: true})

export default mongoose.model('Post', PostSchema)