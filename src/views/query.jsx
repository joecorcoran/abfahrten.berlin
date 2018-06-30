import React from 'react';
import qs from 'query-string';
import * as Im from 'immutable';
import {debounce, throttle} from 'throttle-debounce';
import dispatcher from '../dispatcher';
import data from '../data';

class QueryView extends React.Component {
  constructor(props) {
    super(props);
  }
  
  resolve = debounce(0, (location, action) => {
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
    return this.props.boards.keySeq() !== nextProps.boards.keySeq();
  }

  componentDidUpdate = throttle(500, (prevProps, prevState) => {
    const search = this.props.boards.isEmpty() ? '' :  '?' + qs.stringify({ b: this.props.boards.keySeq().toArray() }, { strict: false });
    if (this.props.history.location.search !== search) {
      this.props.history.push(`${this.props.history.location.pathname}${search}`);
    }
  })
  
  render() {
    return null;
  }
}

export {QueryView};
