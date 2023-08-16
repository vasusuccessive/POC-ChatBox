import * as jwt from 'jsonwebtoken';
import { config } from '../config/config.core';
import UserRepository from '../repositories/business/user/Repository';
import { ForbiddenError } from '../entities/errors';

const userRepository: UserRepository = new UserRepository();

export default () => async (req, res, next) => {
  try {
      let token = req.header('Authorization');
      if (!token) {
          return next(new ForbiddenError([
              {
                  location: 'body',
                  msg: 'Token not found',
                  param: 'Unauthorized',
                  value: ``,
              },
          ]));
      }
      if (token.startsWith('Bearer ')) {
          token = token.substring(7, token.length);
      }
      
      const { secret } = config;
      let user;
      try {
          user = jwt.verify(token, secret);
      } catch (err) {
          console.error(err);
          return next(new ForbiddenError([
              {
                  location: 'body',
                  msg: 'Invalid token',
                  param: 'Unauthorized',
                  value: ``,
              },
          ]));
      }
      
      if (!user) {
          return next(new ForbiddenError([
              {
                  location: 'body',
                  msg: 'User not Authorized',
                  param: 'Unauthorized',
                  value: ``,
              },
          ]));
      }
      const userData = await userRepository.findOneByQuery({ email: user.email });
      if (!userData) {
          return next(new ForbiddenError([
              {
                  location: 'body',
                  msg: 'Unauthorized User Data',
                  param: 'Permission Denied',
                  value: ``,
              },
          ]));
      }
      
      req.user = user;
      next();
  } catch (error) {
      console.error(error); // Log any unexpected errors
      next(error);
  }
};
