import _ from 'lodash'

import {
  CallBackArgsType,
  CreateCourierEntranceType,
  DTONested,
  EndPointFunction,
  FunctionType,
  CourierObjectType,
} from '../types'

export const getFinalEndPoint = <T extends CreateCourierEntranceType>(
  endPoint: string | EndPointFunction<T['endPointArgs']>,
  urlParams?: Record<keyof T['endPointArgs'], string | number>,
) => {
  if (urlParams) {
    return _.isFunction(endPoint) ? (endPoint as FunctionType)(urlParams) : endPoint
  } else {
    return _.isFunction(endPoint) ? (endPoint as FunctionType)() : endPoint
  }
}

export const finalName = (
  name: CourierObjectType['name'],
  queryParams?: CallBackArgsType['queryParams'],
  urlParams?: CallBackArgsType['urlParams'],
) =>
  _.isFunction(name)
    ? (name as FunctionType)({
        ...queryParams,
        ...urlParams,
      })
    : name

export const finalQueryParams = (
  queryParams: CourierObjectType['queryParams'],
  argQueryParams: CallBackArgsType['queryParams'],
) => (_.isFunction(queryParams) ? (queryParams as FunctionType)(argQueryParams) : queryParams)

export const defaultDto = <Data>(data: Data): DTONested<Data> => {
  if (_.isArray(data)) {
    return _.map(data, defaultDto) as DTONested<Data>
  }

  if (_.isObject(data)) {
    return _(data)
      .mapKeys((_v, k) => _.camelCase(k))
      .mapValues((v) => defaultDto(v))
      .value() as DTONested<Data>
  }

  return data as DTONested<Data>
}