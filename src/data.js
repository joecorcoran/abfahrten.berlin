import dayjs from 'dayjs';
import Immutable from 'immutable';
import dispatcher from './dispatcher';
import VBB from './vbb';

class Departure {
  constructor(data) {
    this.data = data;
  }

  static fake() {
    return new Departure({
      journeyId: '',
      line: { name: '••' },
      direction: 'Loading...',
      when: null,
      cancelled: false
    });
  }

  static order(set) {
    return set.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      if (a.time === b.time) return 0;
    });
  }

  get key() {
    return this.data.journeyId;
  }

  get lineNum() {
    return this.data.line.name;
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

const data = {
  departures: function(fromId, toId) {
    VBB.getDepartures(fromId, toId, function(error, response) {
      if (error) return;
      dispatcher.dispatch({
        actionType: 'departures:retrieved',
        boardId: `${fromId}:${toId}`,
        departures: Departure.order(Immutable.Set(response.body.map(d => new Departure(d))))
      });
    });
    return Immutable.Set([Departure.fake()]);
  }
};

export default data;
