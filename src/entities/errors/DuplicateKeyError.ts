import { StatusCodes } from '../../libs/constants';
import { getEnumKeyOrValue } from '../../libs/utilities';
import DBError from './DBError';

export default class DuplicateKeyError extends DBError {
  constructor(column: string, value: string = '') {
    super(
      getEnumKeyOrValue(StatusCodes, StatusCodes.CONFLICT),
      [
        {
          location: column,
          msg: 'One record with this name already exist and it can not be duplicated.',
          param: column,
          value,
        },
      ],
      DuplicateKeyError.name,
    );
  }
}
