import { IUserConfig } from './IUserConfig';
export default interface ICoreConfig {
  apiPrefix: string;
  corsOrigin: string;
  cosmosDbConnectionString: string;
  debug: boolean;
  mongoDBName: string;
  nodeEnv: string;
  port: string | number;
  envName: string;
  timeoutIntervalInSec?: string;
  secret: string;
  userDetails: IUserConfig;
  userTypeValues: string;
}
