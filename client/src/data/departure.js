import * as Im from 'immutable';
import dayjs from 'dayjs';
import Line from './line';

class Departure {
  static fake() {
    return new Departure({
      journeyId: '',
      line: { name: '••' },
      direction: 'Wird geladen\u2026',
      when: null,
      cancelled: false
    });
  }

  static fakes() {
    return Im.Set([Departure.fake()]);
  }

  static none() {
    return Im.Set();
  }

  static order(set) {
    return Im.Set(set).sortBy(d => d.time);
  }

  constructor(data) {
    this.data = data;
    this.line = new Line(data.line);
  }

  equals(other) {
    return this.key === other.key;
  }

  hashCode() {
    return parseInt(this.key, 10) | 0;
  }

  get key() {
    return this.data.journeyId;
  }

  get lineNum() {
    return this.line.num;
  }

  get lineProduct() {
    return this.line.product;
  }

  get destination() {
    return this.data.direction;
  }

  get time() {
    return this.calcTime();
  }

  get timeText() {
    let t = this.calcTime();
    switch (t) {
      case -1:
        return '';
      case 0:
        return 'now';
      default:
        return `${t} min`;
    }
  }

  get isCancelled() {
    return !this.data.when && this.data.cancelled;
  }

  calcTime() {
    if (!this.data.when) return -1;
    return dayjs(this.data.when).diff(dayjs(), 'minutes');
  }
}

export default Departure;
