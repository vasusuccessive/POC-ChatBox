import VersionableSchema from '../../versionable/VersionableSchema';

class UserSchema extends VersionableSchema {

    constructor(collections: any) {
        const baseSchema = Object.assign({
            _id: String,
            name: String,
            email: String,
            userType: String,
            password: String
    });
    super(baseSchema, collections);
}
}
export default UserSchema;