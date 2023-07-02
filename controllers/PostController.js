import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

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

        const page = parseInt(req.query.page) || 1
        const limit = 5
        const startIndex = (page - 1) * limit

        const posts = await PostModel.find()
        .populate({ path: 'user', select: 'firstName lastName email avatar' })
        .sort({createdAt: -1})
        .skip(startIndex)
        .limit(limit)

        const count = await PostModel.countDocuments()

        if(!posts) {
            return res.json({
                message: "постов еще нет"
            })
        }

        res.json({
            posts, 
            currentPage: page, 
            limit,
            totalPages: Math.ceil(count/limit), 
            totalPosts: count
        })
    } catch(err) {
        console.log(err)
        res.status(404).json({
            message: "Ошибка в получении постов"
        })
    }
}