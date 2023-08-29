import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import socketIo from 'socket.io';
import admin  from 'firebase-admin';
import { config } from '../config/config.core';
import Logger from '../libs/logger';
import UserRepository from '../repositories/business/user/Repository';
import { BCRYPT_SALT_ROUNDS, SERVICE_NAME } from '../libs/constants';
import { DuplicateKeyError, UnAuthorizedError, BadRequestError } from '../entities/errors';



const logger = new Logger();

const serviceAccount = require('../../test-chat-c76f6-firebase-adminsdk-ca12l-1bb354af2f.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.fireBaseDataBaseUrl
});

const db = admin.database();


export default class UserService {

    private _userRepository: UserRepository;
    private _socketIo: socketIo.Server;
    constructor(socketIoInstance: socketIo.Server) {
      this._userRepository = new UserRepository();
      this._socketIo = socketIoInstance;
    }

    public async createUser(data) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users', custom: {
                  component: SERVICE_NAME,
                  service: 'createUser',
                  functionParms: { ...data },
                },
              })}`);
            const { name, email, password, userType } = data;
            const checkUserExist = await this._userRepository.findOneByQuery({email});
            if (checkUserExist) {
                throw new DuplicateKeyError('service', '');
            }
            const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
            const userdata = { name, email, password: hash, userType };
            const startTime = Date.now();
            const user = await this._userRepository.create(userdata);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'createUser', timeElapsed }})}`);
            return user;
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'createUser', error }})}}`);
            throw error;
        }
    }

    public async userUpdate(data, id, role, originalId) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/users/{id}', custom: {
                component: SERVICE_NAME,
                service: 'userUpdate',
                functionParms: { ...data },
              },
            })}`);
          const { name, email, password, userType } = data;
          if ((userType === config.userDetails.userType && role !== config.userDetails.userType  || id !== originalId)) {
            throw new BadRequestError([
              {
                location: 'body',
                msg: `You are not authorize to access`,
                param: '',
                value: ``,
              },
            ]);
          }
          const checkUserExist = await this._userRepository.get(id);
          if (!checkUserExist) {
            throw new BadRequestError([
                {
                  location: 'body',
                  msg: `user is not exist in db`,
                  param: '',
                  value: ``,
                },
              ]);
        }
        const userdata = {
          ...{name} && name ? {name} : {},
          ...email && email ? {email} : {},
          ...password && password ? { password: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS) } : {},
          ...userType && userType ? {userType} : {},
          originalId: id
        };
          const startTime = Date.now();
          const user = await this._userRepository.update(userdata);
          const endTime = Date.now();
          const timeElapsed = `${endTime - startTime} ms`;
          logger.debug(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, service: 'userUpdate', timeElapsed }})}`);
          return user;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, service: 'userUpdate', error }})}}`);
          throw error;
      }
    }

    public async userDelete(id, originalId, userType) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/users', custom: {
                component: SERVICE_NAME,
                service: 'userDelete',
                functionParms: { id },
              },
            })}`);
          if (userType === config.userDetails.userType || id !== originalId) {
            throw new BadRequestError([
              {
                location: 'body',
                msg: `You are not authorize to delete`,
                param: '',
                value: ``,
              },
            ]);
          }
          const startTime = Date.now();
          await this._userRepository.delete(id);
          const endTime = Date.now();
          const timeElapsed = `${endTime - startTime} ms`;
          logger.debug(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'userDelete', timeElapsed }})}`);
          return 'User deleted successfully';
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'userDelete', error }})}}`);
          throw error;
      }
    }

    public async getUser(id, originalId, userType) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users/{id}', custom: {
                  component: SERVICE_NAME,
                  service: 'getUser',
                  functionParms: { id },
                },
              })}`);
            if (id !== originalId && userType !== config.userDetails.userType) {
                throw new BadRequestError([
                    {
                      location: 'body',
                      msg: `You are not authorize to access`,
                      param: '',
                      value: ``,
                    },
                  ]);
            }
            const startTime = Date.now();
            const pipline = [
              { $match: { originalId: id, deletedAt: null } },
              { $sort: { createdAt: -1 } },
              { $project: { _id: 0, name: 1, email: 1, originalId: 1, createdAt: 1} }
            ];
            const user = await this._userRepository.getAllAggregation(pipline);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, service: 'getUser', timeElapsed }})}`);
            return user;
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, service: 'getUser', error }})}}`);
            throw error;
        }
    }

    public async getAllUsers(limit, skip, sort, userType) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users', custom: {
                  component: SERVICE_NAME,
                  service: 'getAllUsers',
                  functionParms: { limit, skip, sort },
                },
              })}`);
            if (userType !== config.userDetails.userType) {
                throw new BadRequestError([
                    {
                      location: 'body',
                      msg: `You are not authorize to access`,
                      param: '',
                      value: ``,
                    },
                  ]);
            }
            const startTime = Date.now();
            const pipeline = [
                { $match: { deletedAt: null } },
                { $sort: { createdAt: sort === 'asc' ? -1 : 1 } },
                { $skip: skip },
                { $limit: limit },
                { $project: { _id: 0, name: 1, email: 1, originalId: 1, createdAt: 1 } }
              ];
            const user = await this._userRepository.getAllAggregation(pipeline);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'getAllUsers', timeElapsed }})}`);
            return user;
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, service: 'getAllUsers', error }})}}`);
            throw error;
        }
    }

    public async login(email, password) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users/login', custom: {
                  component: SERVICE_NAME,
                  service: 'login',
                  functionParms: { email, password },
                },
              })}`);
            const startTime = Date.now();
            const pipeline = [
                { $match: { email } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
            ];
            const checkUserExist = await this._userRepository.getAllAggregation(pipeline);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users/login', custom: { component: SERVICE_NAME, service: 'login', timeElapsed }})}`);
            let token;
            if (checkUserExist) {
                const validPassword = await bcrypt.compare(password, checkUserExist[0].password);
                if (validPassword) {
                    token = token = jwt.sign({email: checkUserExist[0].email, userType: checkUserExist[0].userType, originalId: checkUserExist[0].originalId}, config.secret, { expiresIn: '1d' });
                    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
                    const {name, userType, originalId} = checkUserExist[0];
                    const userdata = { name, email, password: hash, userType, originalId };
                    if (checkUserExist[0].deletedAt) {
                      const startTime1 = Date.now();
                      await this._userRepository.update(userdata);
                      const endTime1 = Date.now();
                      const timeElapsed1 = `${endTime1 - startTime1} ms`;
                      logger.debug(`${ JSON.stringify({ api: 'api/users/login', custom: { component: SERVICE_NAME, service: 'login', timeElapsed1 }})}`);
                    }
                } else {
                    throw new UnAuthorizedError('service', 'UnAuthorized');
                }
            } else {
                throw new UnAuthorizedError('service', 'UnAuthorized');
            }
            return `Bearer ${token}`;
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'api/users/login', custom: { component: SERVICE_NAME, service: 'login', error }})}}`);
            throw error;
        }
    }

    public async storeChat(senderId, receiverId, message, user, senderUserType, receiverUserType) {
      try {
        logger.info(`${ JSON.stringify({
          api: 'api/send', custom: {
            component: SERVICE_NAME,
            service: 'storeChat',
            functionParms: { senderId, receiverId, message },
          },
        })}`);
        const checkUserExist = await this._userRepository.findData({
          originalId: {
            $in: [senderId, receiverId]
          }
        }, {originalId: 1, userType: 1, _id: 0});
        function findMatchingOriginalId(dataToMatch, dataArray) {
          for (const item of dataArray) {
            if (dataArray.length !== 2) {
              return false;
            }
            if (item.originalId === dataToMatch.originalId) {
              return true;
            }
          }
          return false;
        }

        const isMatch = findMatchingOriginalId(user, checkUserExist);
        if (senderId === receiverId) {
          throw new BadRequestError([
            {
              location: 'body',
              msg: `You can't send message to your own`,
              param: '',
              value: ``,
            },
          ]);
        }
        if (!isMatch) {
          throw new BadRequestError([
            {
              location: 'body',
              msg: `Invalid Id`,
              param: '',
              value: ``,
            },
          ]);
        }
        if (senderUserType !== receiverUserType) {
          throw new BadRequestError([
            {
              location: 'body',
              msg: `You are not authorise to access`,
              param: '',
              value: ``,
            },
          ]);
        }
        const senderRef = db.ref(`chats/${senderId}/${receiverId}`).push();
        await senderRef.set({
          message,
          timestamp: admin.database.ServerValue.TIMESTAMP,
          sender: senderId,
          receiver: receiverId,
          // senderUserType,
          // receiverUserType,
        });
        const receiverRef = db.ref(`chats/${receiverId}/${senderId}`).push();
        logger.info(`${ JSON.stringify({
          api: 'api/send', custom: {
            component: SERVICE_NAME,
            service: 'storeChat',
            dataFlow: { receiverRef },
          },
        })}`);
        const startTime = Date.now();
        await receiverRef.set({
          message,
          timestamp: admin.database.ServerValue.TIMESTAMP,
          sender: senderId,
          receiver: receiverId,
          // senderUserType,
          // receiverUserType,
        });
        const endTime = Date.now();
        const timeElapsed = `${endTime - startTime} ms`;
        logger.debug(`${ JSON.stringify({ api: 'api/send', custom: { component: SERVICE_NAME, service: 'storeChat', timeElapsed }})}`);
        this._socketIo.to(receiverId).emit('newMessage', { message, sender: senderId });
        return { success: true };
      } catch (error) {
        logger.error(`${ JSON.stringify({ api: 'api/send', custom: { component: SERVICE_NAME, service: 'storeChat', error }})}}`);
        throw error;
      }
    }

    public async getChatMessages(userId, chatId, user, limit, page) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/user/getMessage', custom: {
                component: SERVICE_NAME,
                service: 'getChatMessages',
                functionParms: { userId, chatId },
              },
            })}`);
            const checkUserExist = await this._userRepository.findData({
              originalId: {
                $in: [userId, chatId]
              }
            }, {originalId: 1, userType: 1, _id: 0});
            function findMatchingOriginalId(dataToMatch, dataArray) {
              for (const item of dataArray) {
                if (dataArray.length !== 2) {
                  return false;
                }
                if (item.originalId === dataToMatch.originalId) {
                  return true;
                }
              }
              return false;
            }

            function validateUserTypesNotSame(dataArray) {
              const userTypeSet = new Set();

              for (const item of dataArray) {
                if (userTypeSet.has(item.userType)) {
                  return false;
                }
                userTypeSet.add(item.userType);
              }

              return true;
            }

            const isValid = validateUserTypesNotSame(checkUserExist);
            const isMatch = findMatchingOriginalId(user, checkUserExist);
            if (userId === chatId) {
              throw new BadRequestError([
                {
                  location: 'body',
                  msg: `You can't send message to your own`,
                  param: '',
                  value: ``,
                },
              ]);
            }
            if (!isMatch) {
              throw new BadRequestError([
                {
                  location: 'body',
                  msg: `Invalid Id`,
                  param: '',
                  value: ``,
                },
              ]);
            }
            if (!isValid) {
              throw new BadRequestError([
                {
                  location: 'body',
                  msg: `You are not authorise to access`,
                  param: '',
                  value: ``,
                },
              ]);
            }
            const startIndex = parseInt(limit) * (parseInt(page) - 1);
            const snapshot = await db
                                    .ref(`chats/${userId}/${chatId}`)
                                    .orderByChild('timestamp')
                                    .limitToLast(parseInt(limit) + startIndex)
                                    .once('value');
            const messages = [];
            const startTime = Date.now();
            snapshot.forEach(childSnapshot => {
              messages.push(childSnapshot.val());
            });
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/user/getMessage', custom: { component: SERVICE_NAME, service: 'getChatMessages', timeElapsed }})}`);
            this._socketIo.to(userId).emit('newMessages', messages);
            return messages;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/user/getMessage', custom: { component: SERVICE_NAME, service: 'getChatMessages', error }})}}`);
          throw error;
      }
  }

  public async deleteBuldMessage(userId, recipientId, user) {
    try {
        logger.info(`${ JSON.stringify({
            api: 'api/message/:userId/:recipientId', custom: {
              component: SERVICE_NAME,
              service: 'deleteBuldMessage',
              functionParms: { userId, recipientId },
            },
          })}`);
          const checkUserExist = await this._userRepository.findData({
            originalId: {
              $in: [userId, recipientId]
            }
          }, {originalId: 1, userType: 1, _id: 0});
          function findMatchingOriginalId(dataToMatch, dataArray) {
            for (const item of dataArray) {
              if (dataArray.length !== 2) {
                return false;
              }
              if (item.originalId === dataToMatch.originalId) {
                return true;
              }
            }
            return false;
          }

          function validateUserTypesNotSame(dataArray) {
            const userTypeSet = new Set();

            for (const item of dataArray) {
              if (userTypeSet.has(item.userType)) {
                return false;
              }
              userTypeSet.add(item.userType);
            }

            return true;
          }

          const isValid = validateUserTypesNotSame(checkUserExist);
          const isMatch = findMatchingOriginalId(user, checkUserExist);
          if (userId === recipientId) {
            throw new BadRequestError([
              {
                location: 'body',
                msg: `You can't send message to your own`,
                param: '',
                value: ``,
              },
            ]);
          }
          if (!isMatch) {
            throw new BadRequestError([
              {
                location: 'body',
                msg: `Invalid Id`,
                param: '',
                value: ``,
              },
            ]);
          }
          if (!isValid) {
            throw new BadRequestError([
              {
                location: 'body',
                msg: `You are not authorise to access`,
                param: '',
                value: ``,
              },
            ]);
          }
          
          const startTime = Date.now();
          await db.ref(`chats/${userId}/${recipientId}`).remove();
          const endTime = Date.now();
          const timeElapsed = `${endTime - startTime} ms`;
          logger.debug(`${ JSON.stringify({ api: 'api/message/:userId/:recipientId', custom: { component: SERVICE_NAME, service: 'deleteBuldMessage', timeElapsed }})}`);
          this._socketIo.to(recipientId).emit('chatHistoryDeleted', { userId });
          return { success: true };
    } catch (error) {
        logger.error(`${ JSON.stringify({ api: 'api/message/:userId/:recipientId', custom: { component: SERVICE_NAME, service: 'deleteBuldMessage', error }})}}`);
        throw error;
    }
}
}

