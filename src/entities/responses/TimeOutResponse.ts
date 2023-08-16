import { StatusCodes } from '../../libs/constants';
import { getEnumKeyOrValue } from '../../libs/utilities';
import IResponse, { IData, IMetadata } from './IResponse';

export default class TimeOutResponse implements IResponse {
  public data: IData;
  public metadata: IMetadata;

  // tslint:disable-next-line:no-null-keyword
  constructor(data: IData = null, message: string = getEnumKeyOrValue(StatusCodes, StatusCodes.BAD_REQUEST)) {
    // tslint:disable-next-line:no-null-keyword
    this.data = data;
    this.metadata = {
      code: StatusCodes.TIME_OUT,
      message,
      timestamp: new Date(),
    };
  }
}
