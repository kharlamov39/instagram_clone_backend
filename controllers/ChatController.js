import Chat from '../models/Chat.js'
import ChatModel from '../models/Chat.js'
import UserModel from '../models/User.js'

export const accessChat = async (req, res) => {
    try {
        const { userId } = req.body
        
        if(!userId) {
            return res.status(400).json({
                message: 'Не отправлен userId'
            })
        }

        let isChat = await ChatModel.find({
            $and: [
                {users: { $elemMatch: {$eq: req.userId}} },
                {users: { $elemMatch: {$eq: userId}} },
            ]
        }).populate('users', '-passwordHash -posts').populate('latestMessage')

        isChat = await UserModel.populate(isChat, {path: 'latestMessage.sender', select: 'firstName lastName avatar'}) 

        if(isChat.length) {
            res.json(isChat)
        } else {
            const doc = new ChatModel({
                users: [req.userId, userId]
            })
    
            const chat = await doc.save()
            const { _id } = chat._doc
            const fullChat = await ChatModel.findById(_id).populate('users', '-passwordHash -posts').populate('latestMessage')
            res.status(200).json(fullChat)
        }

    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: 'Ошибка в access chat'
        })
    }
}

export const fetchChats = async (req, res) => {
    try {

        const chats = await ChatModel.find({users: { $elemMatch: {$eq: req.userId} }})
        .populate('users', '-passwordHash -posts')
        .populate('latestMessage')
        .sort({updateAt: -1})
        .then( async (results) => {
            results = await UserModel.populate(results, {
                path: 'latestMessage.sender',
                select: 'firstName lastName avatar'
            })
            res.json(results)
        })

    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: 'Не удалось отобразить все чаты'
        })
    }
}