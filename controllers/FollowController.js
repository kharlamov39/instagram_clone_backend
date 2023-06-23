import UserModel from "../models/User.js";

export const follow = async (req, res) => {
    try {
        const userId = req.params.userId

        await UserModel.findByIdAndUpdate( userId, {
            $addToSet: { followers: req.userId }
        })

        await UserModel.findByIdAndUpdate( req.userId, {
            $addToSet: { following: userId }
        })

        res.json({
            message: 'Success',
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error subscribe'
        })

    }
}

export const unfollow = async (req, res) => {
    try {
        const userId = req.params.userId

        await UserModel.findByIdAndUpdate( userId, {
            $pull: { followers: req.userId }
        })

        await UserModel.findByIdAndUpdate( req.userId, {
            $pull: { following: userId }
        })

        res.json({
            message: 'Success',
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error subscribe'
        })
    }
}

export const getFollowers = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).populate({ path: 'followers', select: 'firstName lastName email avatar' })

        res.json(user.followers)

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error get followers'
        })
    }
}

export const getFollowing = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).populate({ path: 'following', select: 'firstName lastName email avatar' })

        res.json(user.following)

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: 'Error get following'
        })
    }
}