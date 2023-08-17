
import { config } from './config/config.core';
import Database from './libs/Database';
import Server from './server';
import { getConfig } from './libs/utilities';
import Logger from './libs/logger';
const { fork } = require('child_process');


const logger = new Logger();


// DB Connection
Database.open({ mongoUri: config.cosmosDbConnectionString, dbName: config.mongoDBName })
.then(() => {

  const child = fork(__dirname + '/childProcess/seeding');
  child.on('error', error => {
    console.log(error);
  });
  child.send('START');
})
  .then(() => {
let runningServer: any;
    // Restart handler for handling the update of configurations

    const configurations = getConfig();

    logger.info('::::GOT CONFIGURATIONS FROM CONFIGURATION SERVICE::::');

    const server = new Server(configurations);

    if (runningServer) {
      logger.info('AuthMiddleware is initialising once again');
    } else {
      server.bootstrap();

      runningServer = server.httpServer.listen(config.port);


      runningServer.on('listening', async () => {
        const ann = `|| App is running at port '${config.port}' in '${config.nodeEnv}' mode ||`;
        logger.info('::::Report Cron job Set ::::');
        logger.info(ann.replace(/[^]/g, '-'));
        logger.info(ann);
        logger.info(ann.replace(/[^]/g, '-'));
        logger.info('Press CTRL-C to stop\n');
      });

      runningServer.on('error', (err: any) => {
        console.log(':::::: GOT ERROR IN STARTING SERVER ::::::', err);
        logger.error(err);
      });
    }
  }

    // Initialising the configuration client for craeting connection with configuration service
  )
  .catch(err => {
    console.log(':::::: GOT ERROR IN CREATING CONNECTION WITH DB ::::::');
    logger.error(err);
  });
