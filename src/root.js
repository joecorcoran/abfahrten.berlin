import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views';
import {BoardStore, DeparturesStore, StationsStore} from './stores';

const boards = new BoardStore();
const departures = new DeparturesStore();
const stations = new StationsStore();

function getStores() {
  return [
    boards,
    departures,
    stations
  ];
};

function getState() {
  return {
    boards: boards.getState(),
    departures: departures.getState(),
    stations: stations.getState()
  };
};

let AppContainer = Container.createFunctional(AppView, getStores, getState);

ReactDOM.render(<AppContainer/>, document.getElementById('app'));
