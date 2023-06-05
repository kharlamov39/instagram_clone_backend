import { body } from "express-validator";

export const registerValidation = [
    body('firstName').isLength({min: 2}),
    body('lastName').isLength({min: 2}),
    body('email').isEmail(),
    body('password').isLength({min: 5})
]

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5})
]