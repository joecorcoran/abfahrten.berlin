import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views';
import {DeparturesStore, StationStore} from './stores';

let stations = new StationStore();
let departures = new DeparturesStore();

function getStores() {
  return [
    stations,
    departures
  ];
};

function getState() {
  return {
    stations: stations.getState(),
    departures: departures.getState()
  };
};

let AppContainer = Container.createFunctional(AppView, getStores, getState);

ReactDOM.render(<AppContainer/>, document.getElementById('app'));
