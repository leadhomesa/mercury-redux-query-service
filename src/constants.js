import hash from 'object-hash';

export const DOMAIN = '@@QUERY';

export const LOAD_QUERY = `${DOMAIN}/load-query`;
export const LOAD_QUERY_SUCCESS = `${DOMAIN}/load-query-success`;
export const getLoadQueryStatusKey = (url, query) => `${DOMAIN}/load-form/${url}/${hash(query || {})}`;

export const REFRESH_QUERY = `${DOMAIN}/refresh-query`;
