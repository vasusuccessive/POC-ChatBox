import { Router } from 'express';
import { validationHandler, controllerAdapter } from '../../middlewares';
import userSchema from './validation';
import UserRoutes from './controller';
import authMiddleWare from '../../middlewares/authMiddleWare';
import roleBasedAuthMiddleware from '../../middlewares/roleBasedAuthMiddleware'

const router = Router();

/**
 * @swagger
 * /user/{id}:
 *  get:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Returns a user by the given ID
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: The user ID
 *      schema:
 *        type: string
 *   responses:
 *     200:
 *      description: Single user object
 *      content:
 *        application/json:
 *         schema:
 *           properties:
 *            id:
 *              type: string
 *            originalId:
 *              type: string
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            role:
 *              type: string
 *            createdAt:
 *              type: string
 *            deletedAt:
 *              type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.get('/:id', authMiddleWare(), userSchema.get, validationHandler, controllerAdapter(UserRoutes, 'getUserById'));

/**
 * @swagger
 * /user:
 *  post:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Creates a new user
 *   parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email
 *             password:
 *               type: string
 *               description: Password
 *             name:
 *               type: string
 *               description: Name
 *             userType:
 *               type: string
 *               description: UserType
 *   responses:
 *     200:
 *      description: User created successfully
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              id:
 *                type: string
 *              originalId:
 *                type: string
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *              createdAt:
 *                type: string
 *              deletedAt:
 *                type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.post('/', userSchema.create, validationHandler, controllerAdapter(UserRoutes, 'addUser'));

/**
 * @swagger
 * /user:
 *  get:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Returns all users
 *   parameters:
 *    - in: query
 *      name: limit
 *      required: false
 *      description: Number of users to return
 *      schema:
 *        type: number
 *        default: 10
 *    - in: query
 *      name: skip
 *      required: false
 *      description: Number of users to skip
 *      schema:
 *        type: number
 *        default: 0
 *    - in: query
 *      name: sort
 *      required: false
 *      description: Sort order
 *      schema:
 *        type: string
 *        default: 'asc'
 *   responses:
 *     200:
 *      description: Array of users
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              properties:
 *                id:
 *                  type: string
 *                originalId:
 *                  type: string
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                role:
 *                  type: string
 *                createdAt:
 *                  type: string
 *                deletedAt:
 *                  type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.get('/', authMiddleWare(), roleBasedAuthMiddleware(['SUPER_ADMIN']), userSchema.getAll, validationHandler, controllerAdapter(UserRoutes, 'getUsers'));

/**
 * @swagger
 * /user/login:
 *  post:
 *     tags:
 *       -  users
 *     description: Add new app and its dimension
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email
 *             password:
 *               type: string
 *               description: Password
 *     responses:
 *       200:
 *         description: object of application and it's dimensions
 *         schema:
 *           type: object
 *           properties:
 *            data:
 *              type: string
 *            metadata:
 *              properties:
 *                code:
 *                  type: number
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: ""
 *                timestamp:
 *                  type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.post('/login', userSchema.login, validationHandler, controllerAdapter(UserRoutes, 'loginUser'));

/**
 * @swagger
 * /user/addUser:
 *  post:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Creates a new user
 *   parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email
 *             password:
 *               type: string
 *               description: Password
 *             name:
 *               type: string
 *               description: Name
 *             userType:
 *               type: string
 *               description: UserType
 *   responses:
 *     200:
 *      description: User created successfully
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              id:
 *                type: string
 *              originalId:
 *                type: string
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *              createdAt:
 *                type: string
 *              deletedAt:
 *                type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.post('/addUser', authMiddleWare(), roleBasedAuthMiddleware(['SUPER_ADMIN']), userSchema.createBySuperUser, validationHandler, controllerAdapter(UserRoutes, 'addUser'));

/**
 * @swagger
 * /user/update/{id}:
 *  patch:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Update a user
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the user to update
 *      schema:
 *        type: string
 *    - in: body
 *      name: body
 *      schema:
 *          type: object
 *          properties:
 *              email:
 *                 type: string
 *                 description: Email
 *              password:
 *                  type: string
 *                  description: Password
 *              name:
 *                  type: string
 *                  description: Name
 *              userType:
 *                  type: string
 *                  description: UserType
 *   responses:
 *     200:
 *      description: User updated successfully
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              id:
 *                type: string
 *              originalId:
 *                type: string
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *              createdAt:
 *                type: string
 *              deletedAt:
 *                type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.patch('/update/:id', authMiddleWare(), userSchema.update, validationHandler, controllerAdapter(UserRoutes, 'updateUser'));

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *   security:
 *       - Bearer: []
 *   tags:
 *    - users
 *   description: Delete a user
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: ID of the user to delete
 *      schema:
 *        type: string
 *   responses:
 *     200:
 *      description: User deleted successfully
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              message:
 *                type: string
 *     401:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     403:
 *      description: Forbidden
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     500:
 *      description: Internal Server Error
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.delete('/:id', authMiddleWare(), userSchema.delete, validationHandler, controllerAdapter(UserRoutes, 'deleteUser'));

router.post('/send',  userSchema.send, validationHandler, authMiddleWare(), controllerAdapter(UserRoutes, 'sendMessage'))

router.post('/message',  userSchema.message, validationHandler, authMiddleWare(), authMiddleWare(), controllerAdapter(UserRoutes, 'getMessage'))

export default router;