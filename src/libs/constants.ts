export const SWAGGER_URL = '/api-docs';
export const API_PREFIX = '/api';
export const SERVICE_NAME = 'Growers';

export const ABOUT = {
  description: 'User Service API with swagger',
  title: 'Growers API',
};

export const BCRYPT_SALT_ROUNDS: number = 10;

// Listing of Environments
export enum EnvVars {
  TEST = 'test',
  LOCAL = 'local',
}

export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TIME_OUT = 408,
  CONFLICT = 409,
  UNPROCESSABLE = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Sensitivity {
  GET = 1,
  POST = 2,
  PUT = 2,
  PATCH = 2,
  DELETE = 3,
}
