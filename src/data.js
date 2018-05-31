import dayjs from 'dayjs';
import Immutable from 'immutable';
import dispatcher from './dispatcher';
import VBB from './vbb';

class Departure {
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
    return Immutable.Set(set).sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      if (a.time === b.time) return 0;
    });
  }

  constructor(data) {
    this.data = data;
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

class Station {
  static fake() {
    return new Station();
  }

  static order(set) {
    return Immutable.Set(set).sort((a, b) => {
      if (a.relevance > b.relevance) return -1;
      if (a.relevance < b.relevance) return 1;
      if (a.relevance === b.relevance) return 0;
    });
  }

  constructor(data) {
    this.data = data;
  }

  get key() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get relevance() {
    return this.data.relevance;
  }

  get latlong() {
    return [
      this.data.location.latitude,
      this.data.location.longitude
    ];
  }
}

const data = {
  departures(fromId, toId) {
    VBB.getDepartures(fromId, toId, function(error, response) {
      if (error) return;
      dispatcher.dispatch({
        actionType: 'departures:retrieved',
        boardId: `${fromId}:${toId}`,
        departures: Departure.order(response.body.map(d => new Departure(d)))
      });
    });
    return Immutable.Set([Departure.fake()]);
  },

  searchStations(query) {
    VBB.searchStations(query, function(error, response) {
      if (error) return;
      dispatcher.dispatch({
        actionType: 'stations:retrieved',
        stations: Station.order(response.body.map(s => new Station(s)))
      });
    });
    return Immutable.Set([Station.fake()]);
  }
};

export default data;
