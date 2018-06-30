import * as Im from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';
import {encode, decode} from './urlkey';
import Board from './data/board';

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
        return state.set(action.board.urlkey, action.board);
      case 'query:resolve':
        const s = state.filter((_, k) => action.keys.has(k));
        action.keys.map(k => {
          const [from, via] = k.split('-');
          if (!state.has(k)) {
            data.getBoard(decode(from), decode(via)).then((stations) => {
              const b = new Board({ from: stations[0], via: stations[1] });
              dispatcher.dispatch({
                actionType: 'board:retrieved',
                board: b
              });
            });
          }
        });
        return s;
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
        let departures = data.departures(action.board.from.key, action.board.via.key);
        return state.set(action.board.urlkey, Im.Map({
          loading: true,
          departures: departures
        }));
      case 'board:tick':
        // Leave current departures alone while we wait
        data.departures(action.from.key, action.via.key);
        return state.set(action.urlkey, Im.Map({
          loading: true,
          departures: state.get(action.urlkey).get('departures')
        }));
      case 'departures:retrieved':
        return state.set(action.urlkey, Im.Map({
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

export {boards, departures, stationSearch, stationsVia};
