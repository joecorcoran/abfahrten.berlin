import * as Im from 'immutable';
import connected from '../connected';
import Line from './line';

class Station {
  static fake() {
    return new Station();
  }

  static none() {
    return Im.Set();
  }

  static orderByWeight(set) {
    return Im.Set(set).sortBy(s => s.weight).reverse();
  }

  static orderByScore(set) {
    return Im.Set(set).sortBy(s => s.score).reverse();
  }

  constructor(data) {
    this.data = data;
    this.lines = data.lines ? Line.order(data.lines.map(l => new Line(l))) : Im.Set();
  }

  equals(other) {
    return this.key === other.key;
  }

  hashCode() {
    return parseInt(this.key, 10) | 0;
  }

  get key() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get score() {
    return this.data.score;
  }

  get weight() {
    return this.data.weight;
  }

  get latlong() {
    return [
      this.data.location.latitude,
      this.data.location.longitude
    ];
  }

  get connected() {
    // So nasty. Would love an endpoint for looking this up.
    return connected[this.data.id];
  }
}

export default Station;
