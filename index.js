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
import cors from "cors";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import fs from 'fs';
import { Server } from 'socket.io'


const app = express()
app.use(express.json()) // команда для считывания json с наших запросов 
app.use(cors())
app.use('/uploads', express.static('uploads'))

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

mongoose
.connect('mongodb+srv://kharlamov39:eden@cluster0.lgvw0dz.mongodb.net/myapp?retryWrites=true&w=majority')
.then( () => console.log('DB ok'))
.catch( (err) => console.log(err, 'DB error'))

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)  // регистрация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login) // авторизация
app.get('/auth/me', checkAuth, UserController.authMe) // аунтефикация

app.get('/profile/:id', ProfileController.getProfile )
app.patch('/profile/:id', checkAuth, ProfileController.updateProfile )
app.delete('/profile/:id', checkAuth, ProfileController.deleteProfile )
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/search', ProfileController.searchProfiles )

app.get('/post/:id', PostController.getOnePost)
app.get('/post', PostController.getAllPosts)
app.post('/post', checkAuth, PostController.createPost)
app.patch('/post/:id', checkAuth, PostController.updatePost)
app.delete('/post/:id', checkAuth, PostController.deletePost)


app.post('/comment/:postId', checkAuth, CommentController.createComment)
app.get('/comment/:postId', CommentController.getPostComments)


app.post('/chat', checkAuth, ChatController.accessChat )
app.get('/chat', checkAuth, ChatController.fetchChats )

app.post('/message', checkAuth, MessageController.sendMessage)
app.get('/message/:chatId', checkAuth, MessageController.allMessages)



app.listen(1111, (err) => err ? console.log(err) : console.log('Server Ok') );

// const io = new Server(server)

// const ioServer = io(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: 'http://localhost:1111'
//     }
// } )

// ioServer.on('connection', (socket) => {
//     console.log('connected socket io')
// })

// var io = require('socket.io')(server);
// io.on(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: 'http://localhost:1111'
//     }
// })

// io.on('connection', (socket) => {
//     console.log('connected socket io')
// })

// io(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: 'http://localhost:1111'
//     }
// }) 

// io.on('connection', (socket) => {
//     console.log('connected socket io')
// })