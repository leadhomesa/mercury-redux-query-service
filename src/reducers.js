import {fromJS} from 'immutable';
import {handleActions} from 'redux-actions';
import {
  DOMAIN,
  LOAD_QUERY_SUCCESS
} from './constants';

const reducer = handleActions({

  [LOAD_QUERY_SUCCESS]: (state, {key, result}) =>
    state.update('entity',
      entity => entity.set(key, fromJS(result))
    ),

}, fromJS({
  entity: fromJS({})
}));

export default {
  [DOMAIN]: reducer
};
