import React from 'react';
import qs from 'query-string';
import * as Im from 'immutable';
import dispatcher from '../dispatcher';

class QueryView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((loc, action) => {
      dispatcher.dispatch({
        actionType: 'query:resolve',
        query: qs.parse(this.props.history.location.search)
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.query !== nextProps.query;
  }

  componentDidUpdate(prevProps, prevState) {
    const search = '?' + qs.stringify(this.props.query.toJS());
    if (this.props.history.location.search !== search) {
      this.props.history.push(`${this.props.history.location.pathname}${search}`);
    }
  }
  
  render() {
    return null;
  }
}

export {QueryView};
