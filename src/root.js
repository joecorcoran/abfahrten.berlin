import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views';
import {BoardStore, DeparturesStore, StationSearchStore} from './stores';

const boards = new BoardStore();
const departures = new DeparturesStore();
const stationSearch = new StationSearchStore();

function getStores() {
  return [
    boards,
    departures,
    stationSearch
  ];
};

function getState() {
  return {
    boards: boards.getState(),
    departures: departures.getState(),
    stationSearch: stationSearch.getState()
  };
};

let AppContainer = Container.createFunctional(AppView, getStores, getState);

ReactDOM.render(<AppContainer/>, document.getElementById('app'));
