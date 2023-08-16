import { StatusCodes } from '../../libs/constants';
import IResponse, { IData, IMetadata } from './IResponse';

export default class SuccessResponse implements IResponse {
  constructor(
    // tslint:disable-next-line:no-null-keyword
    public data: IData = null,
    public metadata: IMetadata = { code: StatusCodes.OK, message: 'Success', timestamp: new Date() },
  ) {
  }
}
