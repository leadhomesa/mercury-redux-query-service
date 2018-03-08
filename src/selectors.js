import {DOMAIN} from './constants';
import {selectors} from '@leadhome/status';
import {fromJS} from "immutable";
import {createSelector} from 'reselect';

const getResultMap = {};

export const getResultFactory = (key, defaultValue) => {
  if (!getResultMap[key])
    getResultMap[key] = createSelector(
      state => state[DOMAIN].get('entity'),
      entity => entity.get(key, fromJS(defaultValue)).toJS()
    );

  return getResultMap[key];
};

export const getLoadStatus = (state, key) =>
  selectors.getStatus(state, key);
