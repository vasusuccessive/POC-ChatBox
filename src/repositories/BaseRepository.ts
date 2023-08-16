import * as mongoose from 'mongoose';
import { Query, EnforceDocument } from 'mongoose';
import { Nullable } from '../libs/Nullable';

export default abstract class BaseRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {

  public static generateObjectId() {
    return String(mongoose.Types.ObjectId());
  }

  protected modelType: M;

  constructor(modelType: M) {
    this.modelType = modelType;
  }
  /**
   * Get application list.
   * @property {number} skip - Number of records to be skipped.
   * @property {number} limit - Limit number of records to be returned.
   * @returns {Application[]}
   */
  public async list(query: any): Promise<D[]> {
    const { skip, limit } = query;
    delete query.limit;
    delete query.skip;
    return this.getAll(query, { skip, limit, sort: { createdAt: -1 } });
  }

  /**
   * Create new application
   * @property {string} body.name - The name of record.
   * @returns {Application}
   */
  public async create(options: any): Promise<D> {
    const id = BaseRepository.generateObjectId();
    const model = new this.modelType({
      ...options,
      _id: id,
    });
    return model.save();
  }

  /**
   * Insert Many
   * @returns {Documents[]}
   */
  public async insertMany(docs: any[], options?: any | null) {
    return this.modelType.insertMany(docs, options);
  }

  public getAll(query: any, options: any = {}, projection: any = { },  populate?: any | null): Query<EnforceDocument<D, {}>[], EnforceDocument<D, {}>, {}, D> {
    return populate
      ? (this.modelType.find(query, projection, options)).populate(populate).lean()
      : (this.modelType.find(query, projection, options)).lean();
  }

  protected deleteByQuery(query: any) {
    return this.modelType.remove(query);
  }

  protected userAggregation(pipeline: any) {
    return mongoose.connection.db.collection('user').aggregate(pipeline);
  }

  protected productAggregation(pipeline: any) {
    return mongoose.connection.db.collection('Product').aggregate(pipeline);
  }
}
