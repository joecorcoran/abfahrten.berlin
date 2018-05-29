import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';

class StationStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Immutable.Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'add-station':
        return state.add(action.station);
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
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'add-station':
        state.clear(); 
        return state.set(action.station.key, Immutable.Set(data.departures(action.station.fromId, action.station.toId)));
      case 'departures-done':
        return state.set(action.stationKey, Immutable.Set(action.departures));
      default:
        return state;
    }
    return state;
  }
}

export {DeparturesStore, StationStore};
