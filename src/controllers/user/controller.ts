import { Server as SocketIOServer } from 'socket.io';
import { SERVICE_NAME } from '../../libs/constants';
import Logger from '../../libs/logger';
import UserService from '../../service/userService';

const logger = new Logger();
const io = new SocketIOServer();

class User {

    private userService: any;
    constructor() {
        this.userService = new UserService(io);
    }

    public async getUserById(
      { params: { id },
       user: { originalId, userType},
     }
      : { params: any, user: any}
      ) {
      try {
        logger.info(`${JSON.stringify({
          api: 'api/users/{id}', custom: {
            component: SERVICE_NAME,
            controller: 'get',
            reqParams: { id },
          },
        })}`);
        const startTime = Date.now();
        const result = this.userService.getUser(id, originalId, userType);
        const endTime = Date.now();
        const timeElapsed = `${endTime - startTime} ms`;
        logger.debug(`${JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, controller: 'get', timeElapsed } })}`);
        return result;
      } catch (error) {
        logger.error(`${JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, controller: 'get', error: `${error}` } })}`);
        throw error;
      }
    }

    public async getUsers(
      {
      query: { limit = 10, skip = 0, sort = 'asc' },
      user: { userType},
     }
      : {
      query: { limit: number, skip: number, sort: string},
     user: any,
    }
      ) {
      try {
        logger.info(`${JSON.stringify({
          api: 'api/users', custom: {
            component: SERVICE_NAME,
            controller: 'get',
            reqQuery: { limit, skip, sort },
          },
        })}`);
        const startTime = Date.now();
        const result = this.userService.getAllUsers(limit, skip, sort, userType);
        const endTime = Date.now();
        const timeElapsed = `${endTime - startTime} ms`;
        logger.debug(`${JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, controller: 'getUsers', timeElapsed } })}`);
        return result;
      } catch (error) {
        logger.error(`${JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, controller: 'getUsers', error: `${error}` } })}`);
        throw error;
      }
    }

    public async addUser({
        body: { name, email, userType, password },
      }: {
        body: any;
      }) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users', custom: {
                  component: SERVICE_NAME,
                  controller: 'addUser',
                  reqBody: { name, email, password, userType },
                },
              })}`);
              const startTime = Date.now();
              const result = this.userService.createUser({name, email, password, userType});
              const endTime = Date.now();
              const timeElapsed = `${endTime - startTime} ms`;
              logger.debug(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, controller: 'addUser', timeElapsed }})}`);
              return result;
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'api/users', custom: { component: SERVICE_NAME, controller: 'addUser', error }})}}`);
            throw error;
        }
    }

    public async updateUser({
      body: { name, email, userType, password },
      user: { originalId, userType: role},
      params: { id }
    }: {
      body: any;
      user: { originalId: string, userType: string },
      params: { id: string }
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/users/{id}', custom: {
                component: SERVICE_NAME,
                controller: 'updateUser',
                reqBody: { name, email, password, userType },
                reqParams: {id}
              },
            })}`);
            const startTime = Date.now();
            const result = this.userService.userUpdate({name, email, password, userType}, id, role, originalId);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, controller: 'updateUser', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/users/{id}', custom: { component: SERVICE_NAME, controller: 'updateUser', error }})}}`);
          throw error;
      }
    }

    public async deleteUser({
      params: { id },
      user: { originalId, userType}
    }: {
      user: any;
      params: { id: string }
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/users/list', custom: {
                component: SERVICE_NAME,
                controller: 'list',
                reqParams: { id },
              },
            })}`);
            const startTime = Date.now();
            const result = this.userService.userDelete(id, originalId, userType);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users/list', custom: { component: SERVICE_NAME, controller: 'list', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/users/list', custom: { component: SERVICE_NAME, controller: 'list', error }})}}`);
          throw error;
      }
    }


    public async loginUser({
      body: { email, password },
    }: {
      body: { email: string, password: string};
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/users/login', custom: {
                component: SERVICE_NAME,
                controller: 'list',
                reqBody: { email, password },
              },
            })}`);
            const startTime = Date.now();
            const result = await this.userService.login(email, password);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/users/login', custom: { component: SERVICE_NAME, controller: 'list', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/users/login', custom: { component: SERVICE_NAME, controller: 'list', error }})}}`);
          throw error;
      }
    }

    public async getMessage({
      body: { userId, chatId },
      query: { limit = '5', page = '1' },
      user
    }: {
      body: { userId: string, chatId: string, message: string };
      user: any,
      query: {limit: string, page: string}
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/getMessage', custom: {
                component: SERVICE_NAME,
                controller: 'getMessage',
                reqBody: { userId, chatId },
              },
            })}`);
            const startTime = Date.now();
            const result = this.userService.getChatMessages(userId, chatId, user, limit, page);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/getMessage', custom: { component: SERVICE_NAME, controller: 'getMessage', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/getMessage', custom: { component: SERVICE_NAME, controller: 'getMessage', error }})}}`);
          throw error;
      }
    }


    public async sendMessage({
      body: { senderId, receiverId, message, senderUserType, receiverUserType },
      user
    }: {
      body: { senderId: string, receiverId: string, message: string, senderUserType: '', receiverUserType: '' };
      user: any
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'ap/user/send', custom: {
                component: SERVICE_NAME,
                controller: 'sendMessage',
                reqBody: { senderId, receiverId, message },
              },
            })}`);
            const startTime = Date.now();
            const result = this.userService.storeChat(senderId, receiverId, message, user, senderUserType, receiverUserType);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/user/send', custom: { component: SERVICE_NAME, controller: 'sendMessage', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/user/send', custom: { component: SERVICE_NAME, controller: 'sendMessage', error }})}}`);
          throw error;
      }
    }

    public async deleteAllMessage({
      params: { userId, recipientId },
      user
    }: {
      params: { userId: string, recipientId: string, };
      user: any,
      query: {limit: string, page: string}
    }) {
      try {
          logger.info(`${ JSON.stringify({
              api: 'api/message/:userId/:recipientId', custom: {
                component: SERVICE_NAME,
                controller: 'deleteAllMessage',
                reqBody: { userId, recipientId },
              },
            })}`);
            const startTime = Date.now();
            const result = this.userService.deleteBuldMessage(userId, recipientId, user);
            const endTime = Date.now();
            const timeElapsed = `${endTime - startTime} ms`;
            logger.debug(`${ JSON.stringify({ api: 'api/message/:userId/:recipientId', custom: { component: SERVICE_NAME, controller: 'deleteAllMessage', timeElapsed }})}`);
            return result;
      } catch (error) {
          logger.error(`${ JSON.stringify({ api: 'api/message:userId/:recipientId', custom: { component: SERVICE_NAME, controller: 'deleteAllMessage', error }})}}`);
          throw error;
      }
    }

}

export default new User();