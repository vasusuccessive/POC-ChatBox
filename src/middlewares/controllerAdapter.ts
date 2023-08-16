import Logger from '../libs/logger';
import { APIError } from '../entities/errors';
import { SuccessResponse } from '../entities/responses';
import { SERVICE_NAME } from '../libs/constants';

const logger = new Logger();

// tslint:disable-next-line:no-null-keyword
export default function controllerAdapter(controller: any = null, functionName: string = '', additionalLocal: any = {}) {
  return async (req: any, res: any, next: any) => {
    const {
      params,
      query,
      body,
      user
    } = req;
    const { locals } = res;
    if (Object.keys(additionalLocal).length > 0) {
      Object.keys(additionalLocal).forEach(key => {
        locals[key] = additionalLocal[key];
      });
    }
    try {
      if (locals.isHit) {
        return next();
      }
      const startTime = Date.now();
      const result = await controller[functionName]({
        body,
        locals,
        params,
        query,
        user,
      });
      const endTime = Date.now();
      const timeElapsed = `${endTime - startTime} ms`;
      logger.debug(`${JSON.stringify({ api: 'controllerAdapter', custom: { component: SERVICE_NAME, controller: functionName, timeElapsed } })}`);
      res.locals.isHit = true;
      if (result.type === APIError.name) {
        return next(result);
      } else {
        const response = new SuccessResponse(result);
        res.locals.response = response;
        res.json(response);
        return;
      }
    } catch (error) {
      logger.error(`${JSON.stringify({ api: 'controllerAdapter', custom: { component: SERVICE_NAME, controller: functionName, error } })}`);
      return next(error);
    }
  };
}
