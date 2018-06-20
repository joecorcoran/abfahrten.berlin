import Station from './station';

class Board {
  constructor(data) {
    this.data = data;
  }

  get id() {
    return `${this.from.id}:${this.via.id}`;
  }

  get from() {
    return new Station(this.from);
  }

  get via() {
    return new Station(this.via);
  }
}
