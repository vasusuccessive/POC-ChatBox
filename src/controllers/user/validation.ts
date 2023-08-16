import { body, param, query } from 'express-validator';
import { config } from '../../config/config.core';

const roleValues = config.userTypeValues.split(',');


export default {
    create: [
    body('name')
    .exists().withMessage('Name is required.')
    .isLength({ min: 3 }).withMessage('Name should be at least 3 characters.')
    .matches(/(.*[a-z]){3}/i)
    .withMessage('Name should contain at least three letters.'),

    body('email')
    .exists().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.'),

    body('password')
    .exists().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password should be at least 6 characters.'),

    body('userType')
    .exists().withMessage('userType is required.')
    .custom(value => {
      return ['FARMER', 'RETAILER'].includes(value.toUpperCase());
    }).withMessage('Invalid userType'),
    ],

    createBySuperUser: [
        body('name')
        .exists().withMessage('Name is required.')
        .isLength({ min: 3 }).withMessage('Name should be at least 3 characters.')
        .matches(/(.*[a-z]){3}/i)
        .withMessage('Name should contain at least three letters.'),

        body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.'),

        body('password')
        .exists().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password should be at least 6 characters.'),

        body('userType')
        .exists().withMessage('Role is required.')
        .custom(value => {
          return roleValues.includes(value.toUpperCase());
        }).withMessage('Invalid userType'),
        ],

    delete: [
        param('id')
            .exists().withMessage('Id is required.')
    ],

    get: [
        param('id')
            .exists().withMessage('Id is required.')
    ],

    getAll: [
        query('skip')
            .optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Skip is required')
            .default(1)
            .toInt(),
        query('limit')
            .optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Limit is required')
            .default(10)
            .toInt(),
    ],

    update: [
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isEmail().withMessage('Email is invalid'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('usertype').optional().custom(value => {
            return roleValues.includes(value.toUpperCase());
          }).withMessage('Invalid userType'),
    ],

    login: [
    body('email')
    .exists().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.'),

    body('password')
    .exists().withMessage('Password is required.')
    ],

    message: [
        body('userId')
        .exists().withMessage('userId is required.'),
    
      body('chatId')
        .exists().withMessage('chatId is required.')
    ],

    send: [
    body('senderId')
    .exists().withMessage('senderId is required.'),

    body('receiverId')
    .exists().withMessage('receiverId is required.'),

    body('message')
    .exists().withMessage('Message is required.')
    .isLength({ min: 1 }).withMessage('Message should be at least 1 characters.')
    ]
};
