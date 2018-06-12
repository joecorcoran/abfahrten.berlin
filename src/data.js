import dayjs from 'dayjs';
import * as Im from 'immutable';
import connected from './connected';
import dispatcher from './dispatcher';
import VBB from './vbb';

class Line {
  static order(set) {
    const productOrder = function(line) {
      switch(line.product) {
        case 'subway': return 1;
        case 'suburban': return 2;
        case 'tram': return 3;
        case 'bus': return 4;
        case 'train': return 5;
        default: return 6;
      }
    };

    return Im.Set(set).sortBy(l => l.num).sortBy(productOrder);
  }

  constructor(data) {
    this.data = data;
  }

  get key() {
    return this.data.name;
  }

  equals(other) {
    return this.key === other.key;
  }

  hashCode() {
    return parseInt(this.key, 10) | 0;
  }

  get num() {
    return this.data.name.replace(/Tram |Bus /, '');
  }

  get product() {
    return this.data.product;
  }
}

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

class Station {
  static fake() {
    return new Station();
  }

  static none() {
    return Im.Set();
  }

  static order(set) {
    return Im.Set(set).sortBy(s => s.weight).reverse();
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

const backfillStations = function(ids, actionType) {
  let all = ids.map(id => {
    return new Promise(function(resolve, reject) {
      VBB.getStation(id).then(function(data) { resolve(data); });
    });
  });

  Promise.all(all).then(function(stations) {
    dispatcher.dispatch({
      actionType: actionType,
      stations: Station.order(stations.map(s => new Station(s)))
    });
  }).catch(function(error) {
    dispatcher.dispatch({
      actionType: actionType,
      stations: Station.none()
    });
  });
  return Im.Set();
};

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
    return Im.Set([Departure.fake()]);
  },

  searchStations(query) {
    VBB.searchStations(query).then(function(data) {
      const ids = data.map(s => s.id);
      backfillStations(ids, 'stationSearch:retrieved');
    });
    return Im.Set();
  },

  getStations(ids) {
    return backfillStations(ids, 'stationsVia:retrieved');
  }
};

export default data;
