import {Set, Map} from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';

class BoardStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Set();
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
    return Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:created':
        // Set fake departures while we wait
        let departures = data.departures(action.board.fromId, action.board.toId);
        return state.set(action.board.id, Map({
          loading: true,
          departures: departures
        }));
      case 'board:tick':
        // Leave current departures alone while we wait
        data.departures(action.board.fromId, action.board.toId);
        return state.set(action.board.id, Map({
          loading: true,
          departures: state.get(action.board.id).get('departures')
        }));
      case 'departures:retrieved':
        return state.set(action.boardId, Map({
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
    return Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'stationSearch:retrieved':
        return action.stations;
      case 'stationSearch:selected':
      case 'stationSearch:cleared':
        return state.clear();
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
    return Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'stationsVia:retrieved':
        return action.stations;
      default:
        return state;
    }
  }
}

export {BoardStore, DeparturesStore, StationSearchStore, StationsViaStore};
