import { config } from '../config/config.core';
import Database from '../libs/Database';
import migration from './migration';

const Migration = new migration();

process.on('message', async message => {
  if (message === 'START') {
    console.log('Child process received START message');
    Database.open({ mongoUri: config.cosmosDbConnectionString, dbName: config.mongoDBName })
    .then(() => {
    Migration.syncJob();
    process.send('CAN_START_ANOTHER_PROCESS');
    });
  }
});
