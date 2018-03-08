import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loadQuery, refreshQuery} from './actions';
import {getResultFactory, getLoadStatus} from './selectors';
import {getLoadQueryStatusKey} from './constants';

class WithQuery extends React.PureComponent {
  state = {
    staleResult: {},
    isStale: false
  };

  componentDidMount() {
    this.check({});
  }

  componentWillReceiveProps(newProps) {
    const keyHasChanged = !newProps.queryKey || newProps.queryKey !== this.props.queryKey;
    const {isStale} = this.state;
    const {loadStatus: {fetchedAt}} = newProps;

    if (isStale) {
      if (fetchedAt)
        this.setState({
          isStale: false,
          staleResult: newProps.result
        });
    } else if (keyHasChanged && !fetchedAt)
      this.setState({
        isStale: true
      });
    else
      this.setState({
        staleResult: newProps.result
      });

  }

  componentDidUpdate(prevProps) {
    this.check(prevProps);
  }

  check = ({queryKey: prevQueryKey}) => {
    const {queryKey, disabled} = this.props;
    if (disabled)
      return;

    if (!prevQueryKey || prevQueryKey !== queryKey)
      this.load();
  };

  load = () => {
    const {loadQuery, url, query, queryKey, validForSeconds} = this.props;
    loadQuery(url, query, queryKey, validForSeconds);
  };

  refresh = onSuccess => {
    const {refreshQuery, url, query, queryKey} = this.props;
    refreshQuery(url, query, queryKey, onSuccess);
  };

  render() {
    const {render, children, result, loadStatus} = this.props;
    const {isStale, staleResult} = this.state;

    return (render || children)({
      isStale,
      result: isStale ? staleResult : result,
      loadStatus,
      refresh: this.refresh
    });
  }
}

const defaultTransformResult = result => result;
const defaultDefaultValue = {};

const WithQueryConnected = connect(
  (state, {url, query, transformResult = defaultTransformResult, defaultValue = defaultDefaultValue}) => {
    const queryKey = getLoadQueryStatusKey(url, query);
    const getResult = getResultFactory(queryKey, defaultValue);
    return ({
      queryKey,
      result: transformResult(getResult(state)),
      loadStatus: getLoadStatus(state, queryKey)
    });
  },
  {
    loadQuery,
    refreshQuery
  }
)(WithQuery);

WithQueryConnected.propTypes = {
  url: PropTypes.string.isRequired,
  query: PropTypes.any,
  transformResult: PropTypes.func,
  defaultValue: PropTypes.any,
  render: PropTypes.func,
  disabled: PropTypes.bool,
  validForSeconds: PropTypes.number
};

WithQueryConnected.defaultProps = {
  validForSeconds: 0
};

export default WithQueryConnected;
