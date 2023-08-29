import { StatusCodes } from '../../libs/constants';
import APIError from './APIError';
import IError from './IError';

export default class UnprocessableError extends APIError {
  constructor(errors: IError[]) {
    super('Validation Error', StatusCodes.UNPROCESSABLE, errors, UnprocessableError.name);
  }
}
