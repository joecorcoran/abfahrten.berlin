import Station from './station';
import {encode, decode} from '../urlkey';

class Board {
  constructor(data) {
    this.data = data;
  }

  get key() {
    return `${this.from.key}-${this.via.key}`;
  }

  get urlkey() {
    return `${encode(this.from.key)}-${encode(this.via.key)}`;
  }

  get from() {
    return new Station(this.data.from);
  }

  get via() {
    return new Station(this.data.via);
  }
}

export default Board;
