import * as mongoose from 'mongoose';
export interface IDatabaseConfig {
  mongoUri: string;
  dbName: string;
}

export default class Database {
  public static open({ mongoUri, dbName }: IDatabaseConfig) {
    return new Promise((resolve, reject) => {
      // Mongoose options
      const options = {
        bufferMaxEntries: 0,
        // keepAlive: 1,
        poolSize: 10, // Maintain up to 10 socket connections
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      // Mock the mongoose for testing purpose using Mockgoose
      // connect to mongo db
      mongoose.connect(mongoUri, options, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(mongoUri);
      });

    });
  }


  public static close() {
    mongoose.disconnect();
  }
}


mongoose.connection.on('connected', () => {
  console.log(`[Connected] Number of MongoDB connections: ${mongoose?.connections?.length}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`[Disconnected] Number of MongoDB connections: ${mongoose?.connections?.length}`);
});
