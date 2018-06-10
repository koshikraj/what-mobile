import { Actions } from 'react-native-router-flux'
import  queryString from 'query-string'


export const parseUrl = (url, baseUrl) => {
  return url.replace(baseUrl, '').split('/');
}

export const parseUrlFromFallback = (url) => {
  const newUrl = url.split( '?' )
  return queryString.parse(newUrl[1])
}