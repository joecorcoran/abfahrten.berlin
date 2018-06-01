import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views';
import {BoardStore, DeparturesStore, StationSearchStore, StationsViaStore} from './stores';

const boards = new BoardStore();
const departures = new DeparturesStore();
const stationSearch = new StationSearchStore();
const stationsVia = new StationsViaStore();

function getStores() {
  return [
    boards,
    departures,
    stationSearch,
    stationsVia
  ];
};

function getState() {
  return {
    boards: boards.getState(),
    departures: departures.getState(),
    stationSearch: stationSearch.getState(),
    stationsVia: stationsVia.getState()
  };
};

let AppContainer = Container.createFunctional(AppView, getStores, getState);

ReactDOM.render(<AppContainer/>, document.getElementById('app'));
