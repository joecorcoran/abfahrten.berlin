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

const data = {
  departures(fromId, toId) {
    VBB.getDepartures(fromId, toId).then(function(data) {
      dispatcher.dispatch({
        actionType: 'departures:retrieved',
        boardId: `${fromId}:${toId}`,
        departures: Departure.order(data.map(d => new Departure(d)))
      });
    }).catch(function(error) {
      dispatcher.dispatch({
        actionType: 'departures:retrieved',
        boardId: `${fromId}:${toId}`,
        departures: Departure.none()
      });
    });
    return Set([Departure.fake()]);
  },

  searchStations(query) {
    VBB.searchStations(query).then(function(data) {
      dispatcher.dispatch({
        actionType: 'stationSearch:retrieved',
        stations: Station.order(data.map(s => new Station(s)))
      });
    }).catch(function(error) {
      dispatcher.dispatch({
        actionType: 'stationSearch:retrieved',
        stations: Station.none()
      });
    });
    return Set();
  },

  getStations(ids) {
    let promises = ids.map(id => {
      return new Promise(function(resolve, reject) {
        VBB.getStation(id).then(function(data) { resolve(data); });
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
