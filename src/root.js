import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'flux/utils';
import {AppView} from './views';
import {BoardStore, DeparturesStore} from './stores';

let boards = new BoardStore();
let departures = new DeparturesStore();

function getStores() {
  return [
    boards,
    departures
  ];
};

function getState() {
  return {
    boards: boards.getState(),
    departures: departures.getState()
  };
};

let AppContainer = Container.createFunctional(AppView, getStores, getState);

ReactDOM.render(<AppContainer/>, document.getElementById('app'));
