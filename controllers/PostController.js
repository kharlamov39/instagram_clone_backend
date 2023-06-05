import PostModel from '../models/Post.js'
import CommentModel from '../models/Comment.js'
import UserModel from '../models/User.js'

export const createPost = async (req, res) => {
    try{
        const doc = new PostModel({
            text: req.body.text,
            image: req.body.image,
            user: req.userId
        })

        const post = await doc.save()

        await UserModel.findByIdAndUpdate( req.userId, {
            $push: { posts: post }
        })

        res.json(post)
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "Не удалось создать пост"
        })
    }
}

export const updatePost = async (req, res) => {
    try{

        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate({_id: postId}, { text: req.body.text}, { new: true})

        if(!post) {
            res.status(400).json({
                message: "Пост не найден"
            })
        }

        res.json(post)

    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: "Не удалось обновить пост"
        })
    }
}

export const deletePost = async (req, res) => {
    try{
        const postId = req.params.id
        const post = await PostModel.findOneAndDelete({_id: postId})

        if(!post) {
            res.json({
                message: 'Пост не найден'
            })
        }

        res.json({
            message: 'Пост удален'
        })
    } catch(err) {
        res.status(400).json({
            message: 'не удалось удалить пост'
        })
    }
}

export const getOnePost = async (req, res) => {
    try{
        const postId = req.params.id
        const post = await PostModel.findOne({_id: postId}).populate({ path: 'user', select: 'firstName lastName email avatar' })
        // const comments = await CommentModel.find({ post: postId });

        if(!post) {
            res.status(400).json({
                message: "Пост не найден"
            })
        }

        const {...postData} = post._doc

        res.json({
            ...postData
        }) 
    } catch (err) {
        console.log(err)
        res.status(403).json({
            message: "Не удалось получить пост"
        })
    }
}

export const getAllPosts = async (req, res) => {
    try{
        const posts = await PostModel.find().populate({ path: 'user', select: 'firstName lastName email avatar' })
        if(!posts) {
            return res.json({
                message: "постов еще нет"
            })
        }

        res.json(posts.reverse())
    } catch(err) {
        console.log(err)
        res.status(404).json({
            message: "Ошибка в получении постов"
        })
    }
}