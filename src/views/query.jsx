import React from 'react';
import qs from 'query-string';
import * as Im from 'immutable';
import {debounce} from 'throttle-debounce';
import dispatcher from '../dispatcher';
import data from '../data';

class QueryView extends React.Component {
  constructor(props) {
    super(props);
  }
  
  resolve = debounce(100, (location, action) => {
    const query = qs.parse(location.search);
    const b = !!query.b ? (Array.isArray(query.b) ? query.b : [query.b]) : [];
    const keys = Im.Set(b);
    dispatcher.dispatch({
      actionType: 'query:resolve',
      keys: keys
    });
  })

  componentWillMount() {
    this.resolve(this.props.history.location);
    this.unlisten = this.props.history.listen(this.resolve);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.query !== nextProps.query;
  }

  componentDidUpdate(prevProps, prevState) {
    const search = this.props.query.isEmpty() ? '' :  '?' + qs.stringify({ b: this.props.query.toArray() });
    if (this.props.history.location.search !== search) {
      this.props.history.push(`${this.props.history.location.pathname}${search}`);
    }
  }
  
  render() {
    return null;
  }
}

export {QueryView};
