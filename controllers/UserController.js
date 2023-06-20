import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const isUser = await UserModel.findOne({email: req.body.email}).populate('posts')
        if(isUser) {
            return res.status(403).json({
                message: "User with this email already exists"
            })
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            passwordHash: hash
        })

        const user = await doc.save()
        const token = jwt.sign({_id: user._id,}, 'secret123', {expiresIn: '30d'})

        const { passwordHash, __v, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to register'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if(!user) {
            return res.status(404).json({
                message: 'User is not found'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if(!isValidPassword) {
            return res.status(400).json({
                message: 'Wrong login or password'
            })
        }

        const token = jwt.sign( { _id: user._id}, 'secret123', { expiresIn: '30d'} )

        const { passwordHash, __v, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to login'
        })
    }
}

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId, '-passwordHash')
        if(!user) {
            res.status(404).json({
                message: "User is not found"
            })
        }

        const { __v, ...userData} = user._doc
        res.json({
            ...userData
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to auth'
        })
    }
}