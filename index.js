import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { loginValidation, registerValidation } from "./validations/validation.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as ProfileController from "./controllers/ProfileController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";
import * as ChatController from "./controllers/ChatController.js";
import * as MessageController from "./controllers/MessageController.js";
import * as FollowController from "./controllers/FollowController.js";
import cors from "cors";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import fs from "fs";
import { Server } from "socket.io";

mongoose
.connect('mongodb+srv://kharlamov39:eden@cluster0.lgvw0dz.mongodb.net/myapp?retryWrites=true&w=majority')
// .connect(process.env.MONGODB_URI)
.then( () => console.log('DB ok'))
.catch( (err) => console.log(err, 'DB error'))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb( null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use('/uploads', express.static('uploads'))

app.use(express.json()) // команда для считывания json с наших запросов 
app.use(cors())



app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)  // регистрация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login) // авторизация
app.get('/auth/me', checkAuth, UserController.authMe) // аунтефикация

app.get('/profile/:id', ProfileController.getProfile ) // получение профиля
app.patch('/profile/:id', checkAuth, ProfileController.updateProfile ) // обновление профиля
app.delete('/profile/:id', checkAuth, ProfileController.deleteProfile ) // удаление профиля
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {  // загрузка картинок
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/search', ProfileController.searchProfiles ) // поиск профилей по фамилии

app.get('/post/:id', PostController.getOnePost) // получение одного поста
app.get('/post', PostController.getAllPosts) // получение постов в ленте
app.post('/post', checkAuth, PostController.createPost) // создание поста
app.patch('/post/:id', checkAuth, PostController.updatePost) // обновление(редактирование) поста
app.delete('/post/:id', checkAuth, PostController.deletePost)  // удаление поста


app.post('/comment/:postId', checkAuth, CommentController.createComment) // создание комментария
app.get('/comment/:postId', CommentController.getPostComments) // получение комментариев поста


app.post('/chat', checkAuth, ChatController.accessChat ) // создание чата(диалога) с конкретным юзером
app.get('/chat', checkAuth, ChatController.fetchChats ) // загрузка всех чатов пользователя

app.post('/message', checkAuth, MessageController.sendMessage) // отправка сообщения в конкретном чате
app.get('/message/:chatId', checkAuth, MessageController.allMessages) // получение сообщений в конкретном чате

app.get('/follow/:userId/followers', checkAuth, FollowController.getFollowers) // получение подписчиков конкретного профиля
app.get('/follow/:userId/following', checkAuth, FollowController.getFollowing) // получение подписок конкретного профиля
app.post('/follow/:userId', checkAuth, FollowController.follow ) // подписаться
app.delete('/follow/:userId', checkAuth, FollowController.unfollow ) // отписаться


const port = process.env.PORT || 1111

const server = app.listen( port, (err) => err ? console.log(err) : console.log('Server Ok') );

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket) => {
    console.log('connected socket io')

    socket.on('message', (data) => {
        const chat = data.chat

        if(!chat.users) return console.log('chat users in not defined')

        chat.users.forEach( (user) => {
            io.emit('res', data)
            console.log(data)
            if(user == data.sender._id ) return; 
            // socket.in(user).emit('response, data')
            io.emit('response', data)
        })
    })


    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})
