import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const createComment = async (req, res) => {
    try {  
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
        })

        const comment = await doc.save()

        await PostModel.findByIdAndUpdate( req.params.postId, {
            $push: { comments: comment }
        } )

        res.json(comment)
        
    } catch(err) {
        console.log(err)
        res.status(403).json({
            message: 'Не удалось создать комментарий'
        })
    }
}

export const getPostComments = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId).populate({path: 'comments', options: {sort: {updatedAt: -1} } })
        const list = await Promise.all(
            post.comments.map( (comment) => {
                return CommentModel.findById(comment).populate({path: 'user', select: 'firstName lastName _id email avatar'})
            })
        )

        res.json(list)
    } catch(err) {
        console.log(err)
        res.status(403).json({
            message: 'Не удалось получить комментарии'
        })
    }
}