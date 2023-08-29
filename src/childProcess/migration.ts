import UserService from './helper';
import Logger from '../libs/logger';
import { SERVICE_NAME } from '../libs/constants';
import { config } from '../config/config.core';

const logger = new Logger();

class Migration {
    private userService: any;
    constructor() {
        this.userService = new UserService();
    }
    public async syncJob () {
        try {
            logger.info(`${ JSON.stringify({
                api: 'Migration', custom: {
                  component: SERVICE_NAME,
                },
              })}`);
              const startTime = Date.now();
              const result = await this.userService.createUser(config.userDetails);
              const endTime = Date.now();
              const timeElapsed = `${endTime - startTime} ms`;
              logger.debug(`${ JSON.stringify({ api: 'Migration', custom: { component: SERVICE_NAME, timeElapsed }})}`);
              logger.info(result);
        } catch (error) {
            logger.error(`${ JSON.stringify({ api: 'Migration', custom: { component: SERVICE_NAME, error }})}}`);
            throw error;
        }
    }
}

export default Migration;