import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import data from './data';
import dispatcher from './dispatcher';

class BoardStore extends ReduceStore {
  constructor() {
    super(dispatcher);
  }

  getInitialState() {
    return Immutable.Set();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:create':
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
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.actionType) {
      case 'board:create':
        let departures = data.departures(action.board.fromId, action.board.toId);
        return state.set(action.board.id, departures);
      case 'departures:retrieved':
        return state.set(action.boardId, action.departures);
      default:
        return state;
    }
    return state;
  }
}

export {DeparturesStore, BoardStore};
