import * as mongoose from 'mongoose';

export default interface IUserModel extends mongoose.Document {
    id: string;
    name: string;
    email: string;
    userType: string;
    originalId: string;
    password: string;
    deletedAt: Date;
}