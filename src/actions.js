import {
  LOAD_QUERY,
  LOAD_QUERY_SUCCESS,
  REFRESH_QUERY
} from './constants';

export const loadQuery = (url, query, key, validForSeconds) => ({
  type: LOAD_QUERY,
  url,
  query,
  key,
  validForSeconds
});

export const loadQuerySuccess = (key, result) => ({
  type: LOAD_QUERY_SUCCESS,
  key,
  result
});

export const refreshQuery = (url, query, key, onSuccess = () => null) => ({
  type: REFRESH_QUERY,
  url,
  query,
  key,
  onSuccess
});
