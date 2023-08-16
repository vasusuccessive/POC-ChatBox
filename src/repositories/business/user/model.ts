import * as mongoose from 'mongoose';
import UserSchema from './Schema';
import IUserModel from './IModel';

export const userSchema = new UserSchema({
    collection: 'user',
});

export const userModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>
(
    'User',
    userSchema
);