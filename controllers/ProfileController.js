import UserModel from "../models/User.js"
import PostModel from "../models/Post.js"
import CommentModel from "../models/Comment.js"

export const getProfile = async (req, res) => {
    try{
        const profileId = req.params.id
        const profile = await UserModel.findOne({_id: profileId}, '-passwordHash -v').populate({path: 'posts', select: 'text image' })

        if(!profile) {
            return res.status(404).json({
                message: 'нет такого айди'
            })
        }

        const { ...profileData} = profile._doc
        // profileData.posts.reverse()
        res.json({...profileData})
        
    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: 'не удалось найти профиль!!'
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        if(req.userId !== req.params.id) {
            return res.status(400).json({
                message: 'Нельзя обновить профиль'
            })
        }

        const profile = await UserModel.findByIdAndUpdate( 
            {_id: req.params.id}, 
            {
                firstName: req.body.firstName, 
                lastName: req.body.lastName,
                avatar: req.body.avatar
            }, 
            { new: true}
        )
        
        const { passwordHash, __v, ...profileData } = profile._doc
        res.json(profileData)
    } catch(err) {
        res.status(400).json({
            message: 'Не удалось обновить профиль'
        })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        if(req.userId !== req.params.id) {
            return res.status(400).json({
                message: 'Нельзя удалить профиль'
            })
        }
        const comments = await CommentModel.deleteMany({user: req.userId})
        const posts = await PostModel.deleteMany({user: req.userId})
        const profile = await UserModel.findOneAndDelete({_id: req.userId})
        res.json({
            message: 'Профиль удален'
        })
    } catch(err) {
        res.status(400).json({
            message: 'не удалось найти userId'
        })
    }
}

export const searchProfiles = async (req, res) => {
    try{
        const search = new RegExp(`^${req.body.search}`, 'i')
        const profiles = await UserModel.find({lastName: search}, '-passwordHash -posts')
        if(!profiles.length) {
            return res.json({
                message: "Ничего не найдено"
            })
        }

        res.json(profiles)
    } catch(err) {
        console.log(err)
        res.status(404).json({
            message: 'Ошибка при попытке поиска'
        })
    }
}