import { BadRequestError, DuplicateKeyError, ForbiddenError, NotFoundError, UnprocessableError } from '../entities/errors';

import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  TimeOutResponse,
  UnAuthorizedResponse,
  UnprocessableResponse,
} from '../entities/responses';

import IResponse from '../entities/responses/IResponse';
import { EnvVars, StatusCodes } from '../libs/constants';

import Logger from '../libs/logger';


const logger = new Logger();

export default function errorHandler(env: string) {
  return (err: any, req: any, res: any, next: any) => {
    if (env !== EnvVars.TEST) {
      logger.error(`${JSON.stringify({ api: 'errorHandler', custom: { component: '', error: err }})}`);
    }

    let response: IResponse;
    switch (err.type) {
      case DuplicateKeyError.name:
        response = new UnprocessableResponse(err.data, err.message);
        break;
      case UnprocessableError.name:
        response = new UnprocessableResponse(err.data, err.message);
        break;
      case BadRequestError.name:
        response = new BadRequestResponse(err.data, err.message);
        break;
      case ForbiddenError.name:
        response = new ForbiddenResponse(err.message);
        break;
      case NotFoundError.name:
        response = new NotFoundResponse(err.message);
        break;
        break;
      case InternalServerErrorResponse.name:
      default:
        if (err.timeout) {
          response = new TimeOutResponse(err.data, err.message);
        } else {
          response = new InternalServerErrorResponse(err.data, err.isPublic ? err.message : StatusCodes[err.status]);
        }
        break;
    }
    res.locals.response = response;
    res.locals.outcome = 'failed';
    res.status(response.metadata.code).json(response);
  };
}
