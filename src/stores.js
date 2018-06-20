import * as Im from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';

class BoardStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:requested':
        return state;
      case 'board:retrieved':
        return state.set(action.key, {
          from: action.from,
          via: action.via
        });
      case 'query:resolve':
        action.keys.map(k => {
          const [from, via] = k.split(':');
          if (!state.has(k)) data.getBoard(from, via);
        });
        // returning filtered is fine, as it handles removal and the above will fetch anything else
        return state.filter((_, k) => action.keys.has(k));
    }
    return state;
  }
}
const boards = new BoardStore();

class DeparturesStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:retrieved':
        // Set fake departures while we wait
        let departures = data.departures(action.from.key, action.via.key);
        return state.set(action.key, Im.Map({
          loading: true,
          departures: departures
        }));
      case 'board:tick':
        // Leave current departures alone while we wait
        data.departures(action.from.key, action.via.key);
        return state.set(action.key, Im.Map({
          loading: true,
          departures: state.get(action.key).get('departures')
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
const departures = new DeparturesStore();

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
const stationSearch = new StationSearchStore();

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
const stationsVia = new StationsViaStore();

class QueryStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Im.Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:retrieved':
        // Keep adding to the b array each time a board is created
        return state.add(action.key);
      case 'query:resolve':
        // When user changes the history, keep this store up to date
        // Deep merge is not desirable here as we want to store exactly
        // what's in the search object
        return state.filter(k => action.keys.has(k));
      default:
        return state;
    }
  }
}
const query = new QueryStore();

export {boards, departures, stationSearch, stationsVia, query};
