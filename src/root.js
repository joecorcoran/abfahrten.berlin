import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views/app';
import {BoardStore, DeparturesStore, StationSearchStore, StationsViaStore} from './stores';

const boards = new BoardStore();
const departures = new DeparturesStore();
const stationSearch = new StationSearchStore();
const stationsVia = new StationsViaStore();

class App extends React.Component {
  static getStores() {
    return [
      boards,
      departures,
      stationSearch,
      stationsVia
    ];
  }

  static calculateState(prevState) {
    return {
      boards: boards.getState(),
      departures: departures.getState(),
      stationSearch: stationSearch.getState(),
      stationsVia: stationsVia.getState()
    };
  }

  render() {
    return <AppView {...this.state} />;
  }
}

const AppContainer = Container.create(App);

ReactDOM.render(<AppContainer />, document.getElementById('app'));
