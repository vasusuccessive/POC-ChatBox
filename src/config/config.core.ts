import dotenv = require('dotenv');
import { EnvVars } from '../libs/constants';
import ICoreConfig from './ICoreConfig';

dotenv.config();

export const config: ICoreConfig = {
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: 'http://localhost',
  mongoDBName: process.env.MONGODB_DATABASE || 'Growers',
  cosmosDbConnectionString: process.env.MONGODB_CONNECTION_STRING ? process.env.MONGODB_CONNECTION_STRING : '',
  debug: process.env.DEBUG === 'true',
  nodeEnv: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 9000,
  envName: process.env.ENV_NAME || 'local',
  timeoutIntervalInSec: process.env.TIMEOUT_INTERVAL_INSEC || '120s',
  secret: process.env.JWTSECRET,
  userDetails: {
    name: process.env.NAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    userType: process.env.USERTYPE,
  },
  userTypeValues: process.env.USERTYPEVALUES || 'SUPER_ADMIN, USER, PRODUCT_OWNER',
  fireBaseDataBaseUrl: process.env.FIREBASE_REAL_TIME_DATA_BASE_URL || ''
};
