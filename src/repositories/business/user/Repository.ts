import * as mongoose from 'mongoose';
import { Nullable } from '../../../libs/Nullable';
import VersioningRepository from '../../versionable/VersioningRepository';
import IResourceModel from './IModel';
import { userModel } from './model';

export default class Repository extends VersioningRepository<IResourceModel, mongoose.Model<IResourceModel>> {
  constructor() {
    super(userModel);
  }
  /**
   * Get Users list.
   * @property {number} skip - Number of records to be skipped.
   * @property {number} limit - Limit number of records to be returned.
   * @returns {Users[]}
   */
  public async list(options: any, projection?: any): Promise<IResourceModel[]> {
    return super.getAll({}, options, projection);
  }

  /**
   * Get Users
   * @property {string} id - id of the record
   * @returns {Users}
   */
  public async get(query: any, projection?: any): Promise<Nullable<IResourceModel>> {
    return super.getById(query, projection);
  }

  /**
   * Get Users
   * @property {Object} query - getting record corresponding to email
   * @returns {User}
   */

    public async findOneByQuery(query: any): Promise<Nullable<IResourceModel>> {
      return super.findOne(query);
    }

    public async findData(query: any, projection?: any): Promise<Nullable<IResourceModel>> {
      return super.find(query, projection);
    }



  public async getByQuery(query: any, options: any, projection?: any): Promise<Nullable<IResourceModel[]>> {
    return super.getByQuery(query, options, projection);
  }

  /**
   * Create new Users
   * @returns {Users}
   */
  public async create(options: any): Promise<IResourceModel> {
    return super.create(options);
  }
  public async insertMany(docs: any, options?: any | null) {
    return super.insertMany(docs, options);
  }
  /**
   * Update new Users
   * @returns {Users}
   */
  public async update(query: any): Promise<IResourceModel> {
    return super.update(query);
  }
  /**
   * Delete Users
   * @returns {Users}
   */
  public async findByIdAndDelete(query: any): Promise<IResourceModel> {
    return super.deleteByQuery(query);
  }

  public async getAllAggregation(pipeline: any) {
    return super.userAggregation(pipeline).toArray();
  }

  public delete(data: any): Promise<IResourceModel> {
    return super.softdelete(data);
}

}
