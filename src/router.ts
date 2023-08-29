import { Router } from 'express';
import Logger from './libs/logger';
import  { UserRoutes } from './controllers';


const logger = new Logger();

const router = Router();


/**
 * @swagger
 * /health-check:
 *   get:
 *     tags:
 *       - General
 *     description: Health Check for server
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I am OK
 */

router.get('/health-check', (req, res) => {
 return res.send('I am OK');
});
router.use('/user', UserRoutes);


export default router;