import { StatusCodes } from '../../libs/constants';
import { getEnumKeyOrValue } from '../../libs/utilities';
import DBError from './DBError';

export default class UnAuthorizedError extends DBError {
  constructor(column: string, value: string = '') {
    super(
        getEnumKeyOrValue(StatusCodes, StatusCodes.FORBIDDEN),
        [
            {
              location: column,
              msg: 'Email or password are incorrect',
              param: column,
              value,
            },
          ],
          UnAuthorizedError.name
    );
  }
}