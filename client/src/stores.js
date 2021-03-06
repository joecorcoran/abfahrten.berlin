import * as Im from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';

class BoardStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:created':
        return state.add(action.board);
      default:
        return state;
    }
    return state;
  }
}

class DeparturesStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:created':
        // Set fake departures while we wait
        let departures = data.departures(action.board.fromId, action.board.toId);
        return state.set(action.board.id, Im.Map({
          loading: true,
          departures: departures
        }));
      case 'board:tick':
        // Leave current departures alone while we wait
        data.departures(action.board.fromId, action.board.toId);
        return state.set(action.board.id, Im.Map({
          loading: true,
          departures: state.get(action.board.id).get('departures')
        }));
      case 'departures:retrieved':
        return state.set(action.boardId, Im.Map({
          loading: false,
          departures: action.departures
        }));
      default:
        return state;
    }
    return state;
  }
}

class StationSearchStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Map({ stations: Im.Set(), loading: false });
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'stationSearch:requested':
        return Im.Map({
          stations: action.stations,
          loading: true
        });
      case 'stationSearch:retrieved':
        return Im.Map({
          stations: action.stations,
          loading: false
        });
      case 'stationSearch:selected':
      case 'stationSearch:cleared':
        return Im.Map({ stations: Im.Set(), loading: false });
      default:
        return state;
    }
    return state;
  }
}

class StationsViaStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Map({ stations: Im.Set(), loading: false });
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'stationsVia:requested':
        return Im.Map({
          stations: action.stations,
          loading: true
        });
      case 'stationsVia:retrieved':
        return Im.Map({
          stations: action.stations,
          loading: false
        });
      default:
        return state;
    }
  }
}

export {BoardStore, DeparturesStore, StationSearchStore, StationsViaStore};
