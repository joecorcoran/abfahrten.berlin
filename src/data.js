import dayjs from 'dayjs';
import {Set} from 'immutable';
import connected from './connected';
import dispatcher from './dispatcher';
import VBB from './vbb';

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

  static none() {
    return Set();
  }

  static order(set) {
    return Set(set).sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      if (a.time === b.time) return 0;
    });
  }

  constructor(data) {
    this.data = data;
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
    return this.data.line.name.replace(/Tram |Bus /, '');
  }

  get lineProduct() {
    return this.data.line.product;
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

  static none() {
    return Set();
  }

  static order(set) {
    return Set(set).sort((a, b) => {
      if (a.relevance > b.relevance) return -1;
      if (a.relevance < b.relevance) return 1;
      if (a.relevance === b.relevance) return 0;
    });
  }

  constructor(data) {
    this.data = data;
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

  get relevance() {
    return this.data.relevance;
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

const data = {
  departures(fromId, toId) {
    VBB.getDepartures(fromId, toId, function(error, response) {
      dispatcher.dispatch({
        actionType: 'departures:retrieved',
        boardId: `${fromId}:${toId}`,
        departures: error ? Departure.none() : Departure.order(response.body.map(d => new Departure(d)))
      });
    });
    return Set([Departure.fake()]);
  },

  searchStations(query) {
    VBB.searchStations(query, function(error, response) {
      dispatcher.dispatch({
        actionType: 'stationSearch:retrieved',
        stations: error ? Station.none() : Station.order(response.body.map(s => new Station(s)))
      });
    });
    return Set();
  },

  getStations(ids) {
    let promises = ids.map(i => {
      return new Promise(function(resolve, reject) {
        VBB.getStation(i, function(error, response) {
          if (error) reject(error);
          resolve(response.body);
        });
      });
    });
    Promise.all(promises).then(function(all) {
      dispatcher.dispatch({
        actionType: 'stationsVia:retrieved',
        stations: Set(all.map(s => new Station(s)))
      });
    }).catch(function(error) {
      dispatcher.dispatch({
        actionType: 'stationsVia:retrieved',
        stations: Station.none()
      });
    });
    return Set();
  }
};

export default data;
