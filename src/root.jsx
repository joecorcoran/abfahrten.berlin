import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import {Container} from 'flux/utils';
import createHistory from 'history/createBrowserHistory';
import {AppView} from './views/app';
import {boards, departures, stationSearch, stationsVia, query} from './stores';

const history = createHistory();

class App extends React.Component {
  static getStores() {
    return [
      boards,
      departures,
      stationSearch,
      stationsVia,
      query
    ];
  }

  static calculateState(prevState) {
    return {
      boards: boards.getState(),
      departures: departures.getState(),
      stationSearch: stationSearch.getState(),
      stationsVia: stationsVia.getState(),
      query: query.getState()
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard" render={() => (<AppView history={history} {...this.state} />)} />
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </BrowserRouter>
    );
  }
}

const AppContainer = Container.create(App);

ReactDOM.render(<AppContainer />, document.getElementById('app'));
