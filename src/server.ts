import * as socketIo from 'socket.io';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as timeout from 'connect-timeout';
import * as cors from 'cors';
import * as express from 'express';
import * as morganBody from 'morgan-body';
import * as helmet from 'helmet';

import Database from './libs/Database';
import Swagger from './libs/Swagger';
import { errorHandler, notFoundHandler } from './middlewares';
import router from './router';
import Logger from './libs/logger';


const logger = new Logger();


export default class Server {
  private app: express.Express;
  public httpServer: http.Server;
  private io: socketIo.Server;
  constructor(private config: any) {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new socketIo.Server(this.httpServer);
  }

  get application() {
    return this.app;
  }

  /**
   * To enable all the setting on our express app
   * @returns -Instance of Current Object
   */
  public bootstrap() {
    this.initJsonParser();
    this.initWebSocket();
    this.initLogger();
    this.initHelmet();
    this.initCompress();
    this.initCors();

    this.initSwagger();
    this.setupRoutes();
    return this.app;
  }


//   const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

  /**
   * This will Setup all the routes in the system
   *
   * @returns -Instance of Current Object
   * @memberof Server
   */
  public setupRoutes() {
    const { env, apiPrefix } = this.config;
    this.app.use(timeout(this.config.timeoutIntervalInSec));
    // mount all routes on /api path
    this.app.use(apiPrefix, async (req, res, next) => {
      next();
    }, router);

    // catch 404 and forward to error handler
    this.app.use(notFoundHandler);

    // error handler, send stacktrace only during development
    this.app.use(errorHandler(env));
  }
  /**
   * This will run the server at specified port after opening up of Database
   *
   * @returns -Instance of Current Object
   */
  public run() {
    // open Database & listen on port config.port
    const { port, env, mongo, mongoDBName } = this.config;
    Database.open({ mongoUri: mongo, dbName: mongoDBName }).then(() => {
      this.app.listen(port, () => {
        const message = `|| App is running at port '${port}' in '${env}' mode ||`;
        logger.info(message.replace(/[^]/g, '-'));
        logger.info(message);
        logger.info(message.replace(/[^]/g, '-'));
        logger.info('Press CTRL-C to stop\n');
      });
    });

    return this;
  }

  /**
   * Initialize WebSocket
   */
     private initWebSocket() {
      try {
        this.io.on('connection', (socket: socketIo.Socket) => {
          console.log('A user connected');

          socket.on('disconnect', () => {
            console.log('User disconnected');
          });
        });

        this.io.on('error', error => {
          console.error('WebSocket error:', error);
        });
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
      }
    }


  /**
   *
   *
   * @returns Promise
   *
   */
  public testDBConnect() {
    const { mongo, mongoDBName } = this.config;
    return Database.open({ mongoUri: mongo, dbName: mongoDBName });
  }

  /**
   * Close the connected Database
   *
   * @returns Promise
   * @memberof Server
   */
  public closeDB() {
    return Database.close();
  }

  /**
   * Compression of the output
   */
  private initCompress() {
    this.app.use(compress());
  }


  /**
   *
   * Lets you to enable cors
   */
  private initCors() {
    this.app.use(
      cors({
        optionsSuccessStatus: 200,
        origin: this.config.corsOrigin.split(','),
        // credentials: true,
      }),
    );
  }

  /**
   *
   * Helmet helps you secure your Express apps by setting various HTTP headers.
   */
  private initHelmet() {
    this.app.use(helmet());
 }

  /**
   *  - Parses urlencoded bodies & JSON
   */
  private initJsonParser() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /**
   * Enabling Logger for Development Environment
   */
  private initLogger() {
    morganBody(this.app);
  }

  /**
   * Initialize Swagger
   */
  private initSwagger() {
    const { swaggerDefinition, swaggerUrl } = this.config;

    const swaggerSetup = new Swagger();

    // JSON route
    this.app.use(
      `${swaggerUrl}.json`,
      swaggerSetup.getRouter({
        swaggerDefinition,
      }),
    );

    // UI route
    const { serve, setup } = swaggerSetup.getUI(swaggerUrl);

    this.app.use(swaggerUrl, serve, setup);
  }
}
