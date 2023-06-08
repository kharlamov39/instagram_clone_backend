import MessageModel from '../models/Message.js'
import ChatModel from '../models/Chat.js'
import UserModel from '../models/User.js'

export const sendMessage = async (req, res) => {
    try {
        const { content, chatId} = req.body

        if(!content || !chatId) {
            return res.status(400).json({
                message: 'Нет сообщения или айди чата'
            })
        }

        const doc = new MessageModel({
            sender: req.userId,
            content: content,
            chat: chatId
        })

        let message = await doc.save()
        message = await message.populate('sender', 'firstName lastName avatar')
        message = await message.populate('chat')       
        // message = await UserModel.populate(message, {
        //     path: 'chat.users',
        //     select: 'firstName lastName avatar'
        // }) 

        await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: message
        })

        res.json(message)

    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: 'Ошибка при отправки сообщения'
        })
    }
}


export const allMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({chat: req.params.chatId})
        .populate('sender', 'firstName lastName avatar')
        .populate('chat')
        
        res.json(messages)

    } catch(err) {
        console.log(err)
        res.status(400).json({
            message: 'Не удалось получить все сообщения'
        })
    }
}