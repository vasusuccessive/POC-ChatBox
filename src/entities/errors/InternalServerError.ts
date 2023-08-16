import { StatusCodes } from '../../libs/constants';
import APIError from './APIError';
import IError from './IError';

export default class InternalServerError extends APIError {
  constructor(errors: IError[]) {
    super('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR, errors);
  }
}
