import {takeEvery, put, call, select} from 'redux-saga/effects';
import {
    LOAD_QUERY,
    REFRESH_QUERY
} from './constants';
import {
    loadQuerySuccess
} from './actions';
import * as status from '@leadhome/status';
import {$post, $get} from './fetch';

function* onLoadQuery({key, url, query, validForSeconds}) {
    try {

        const {isFetching, fetchedAt} = yield select(status.selectors.getStatus, key);

        if (isFetching)
            return;

        if (fetchedAt) {
            const expires = fetchedAt.getTime() + validForSeconds * 1000;

            if (new Date() < expires)
                return;
        }

        yield put(status.actions.fetch(key));
        const content = yield call(query ? $post : $get, url, query || {});
        yield put(loadQuerySuccess(key, content));
        yield put(status.actions.fetched(key));
    }
    catch (e) {
        yield put(status.actions.error(key, e.message));
    }
}

function* onRefreshQuery({key, url, query, onSuccess}) {
    try {
        yield put(status.actions.fetch(key));
        const content = yield call(query ? $post : $get, url, query || {});
        yield put(loadQuerySuccess(key, content));
        yield put(status.actions.fetched(key));
        if (onSuccess)
            yield call(onSuccess);
    }
    catch (e) {
        yield put(status.actions.error(key, e.message));
    }
}

function* all() {
    yield takeEvery(LOAD_QUERY, onLoadQuery);
    yield takeEvery(REFRESH_QUERY, onRefreshQuery);
}

export default [
    all
];
