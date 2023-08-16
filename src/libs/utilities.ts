import * as _ from 'lodash';
import { config } from '../config/config.core';
import { dynamicConfig } from '../config/config.local';

export const getConfig = () => {
  return _.defaultsDeep(_.cloneDeep(config), dynamicConfig); // CoreConfig values always win!!!
};

/**
 * Returns string representation of the key or value of the item in the enum list.
 * @param enums Enum list.
 * @param enumKeyOrValue Key or Value in the enum list.
 * @returns A new object that has same structure as the input.
 */
export function getEnumKeyOrValue(enums: any, enumKeyOrValue: any): string {
  return enums[enumKeyOrValue];
}

export function sliceData(data: any[], limit: number, skip: number) {
  return data.slice(skip, skip + limit);
}

export function sortNum(arr: any, sortFieldName: string) {
  return arr.sort((propertyA: any, propertyB: any) => propertyA[sortFieldName] > propertyB[sortFieldName] ? 1 : -1);
}

export const checkArrayType = (value: any[]): boolean => {
  if (Array.isArray(value) && value.length) {
    return true;
  }

  return false;
};

export const isObject = (item: any): boolean => item && typeof item === 'object' && item.constructor === Object && Object.keys(item).length > 0;