import { body } from "express-validator";

export const registerValidation = [
    body('firstName').isLength({min: 2, max: 25}).withMessage('Enter a firstName between 2 and 15 characters long')
    .matches(/^[a-zA-Zа-яА-Я]+([- ][a-zA-Zа-яА-Я]+)*$/).withMessage('Incorrect firstname'),

    body('lastName').isLength({min: 2, max: 25}).withMessage('Enter a lastName between 2 and 15 characters long')
    .matches(/^[a-zA-Zа-яА-Я]+([- ][a-zA-Zа-яА-Я]+)*$/).withMessage('Incorrect laststname'),
    
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 25}).withMessage('Enter a password between 5 and 25 characters long')
]

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 25}).withMessage('Enter a password between 5 and 25 characters long')
]