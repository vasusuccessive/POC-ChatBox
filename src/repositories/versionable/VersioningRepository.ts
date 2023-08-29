import * as mongoose from 'mongoose';
import { Query, EnforceDocument } from 'mongoose';
import BaseRepository from '../BaseRepository';

export default class VersioningRepository<D extends mongoose.Document, M extends mongoose.Model<D>> extends BaseRepository<D, M> {
  // private modelType: M;

  constructor(modelType: M) {
    super(modelType);
  }

  /**
   * Create new application
   * @property {string} body.name - The name of record.
   * @returns {Application}
   */
  public async create(options: any): Promise<D> {
    const id = VersioningRepository.generateObjectId();
    const model = new this.modelType({
      ...options,
      _id: id,
      originalId: id,
    });

    return model.save();
  }

  /**
   * Insert Many
   * @returns {Documents[]}
   */
  public async insertMany(docs: any, options?: any | null): Promise<mongoose.InsertManyResult> {
    const docsToInsert: any = [];
    for (let i = 0; i < docs.length; i++) {
      const item = docs[i];
      const id = item.id || VersioningRepository.generateObjectId();
      docsToInsert.push({ ...item, _id: id, originalId: id });
    }
    return super.insertMany(docsToInsert, options);
  }

  public getAll(query: any = {}, options: any = {}, projections?: any | null, populate?: any | null): Query<EnforceDocument<D, {}>[],
    EnforceDocument<D, {}>, {}, D> {
    options.limit = options.limit || 0;
    options.skip = options.skip || 0;
    query.deletedAt = undefined;

    if (projections) {
      projections._id = 0;
    }

    return super.getAll(query, options, projections, populate);
  }

  protected getByQuery(query: any, options?: any, projections?: any): any {
    options.limit = options && options.limit || 0;
    options.skip = options && options.skip || 0;
    query.deletedAt = null;
    return super.getAll(query, options, projections);
  }

  protected getById(id: string, projection?: any): Query<EnforceDocument<D, {}>, EnforceDocument<D, {}>, {}, D> {
    const query: any = { originalId: id, deletedAt: null };
    return this.modelType.findOne(query, projection);
  }

  protected findOne(query: any, projection?: any): Query<EnforceDocument<D, {}>, EnforceDocument<D, {}>, {}, D> {
    return this.modelType.findOne(query, projection).lean();
  }

  protected find(query: any, projection?: any): Query<EnforceDocument<D, {}>, EnforceDocument<D, {}>, {}, D> {
    return this.modelType.find(query, projection).lean();
  }

  protected static createObjectId() {
    return String(new mongoose.Types.ObjectId());
}

  protected async update(data: any): Promise<D> {
    const previousRecord = await this.findOne({ originalId: data.originalId, deletedAt: null });
    if (previousRecord) {
        await this.softdelete(data.originalId);
    }
    const newData = { ...previousRecord, ...data };
    newData._id = VersioningRepository.createObjectId();
    delete newData.deletedAt;
    const model = new this.modelType(newData);
    return model.save();
}

protected softdelete(data): any {
  const oldData: object = { originalId: data, deletedAt: undefined };
  const newData: object = { deletedAt: Date() };
  return this.modelType.updateOne(oldData, newData);
}

  protected invalidate(id: string) {
    const now = new Date();
    const query: any = { originalId: id, deletedAt: null };
    const updateQ: any = { deletedAt: now };
    return this.modelType.update(query, updateQ);
  }

}
