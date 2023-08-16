import * as bcrypt from 'bcrypt';
import Logger from '../libs/logger';
import { BCRYPT_SALT_ROUNDS, SERVICE_NAME } from '../libs/constants';
import UserRepository from '../repositories/business/user/Repository';

const logger = new Logger();

class Cron {

    private _userRepository: UserRepository;
    constructor() {
        this._userRepository = new UserRepository();
    }

    public async createUser(data) {
        try {
            logger.info(`${ JSON.stringify({
                api: 'api/users/list', custom: {
                  component: SERVICE_NAME,
                  service: 'createUser',
                  functionParms: { ...data },
                },
              })}`);
            const { name, email, password, userType } = data;
            const checkUserExist = await this._userRepository.findOneByQuery({email});
            if (checkUserExist) {
                return 'user is already exist';
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
}

export default Cron;
