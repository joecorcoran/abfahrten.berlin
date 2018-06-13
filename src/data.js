import * as Im from 'immutable';
import connected from './connected';
import dispatcher from './dispatcher';
import VBB from './vbb';
import Departure from './data/departure';
import Line from './data/line';
import Station from './data/station';

const backfillStations = function(originals, actionType, orderFn) {
  let all = originals.map(obj => {
    return new Promise(function(resolve, reject) {
      VBB.getStation(obj.id).then(function(data) {
        resolve(data);
      });
    });
  });

  Promise.all(all).then(function(stations) {
    const merged = stations.map((s, i) => {
      return Object.assign({}, originals[i], s);
    });
    dispatcher.dispatch({
      actionType: actionType,
      stations: orderFn(merged.map(s => new Station(s)))
    });
  }).catch(function(error) {
    dispatcher.dispatch({
      actionType: actionType,
      stations: Station.none()
    });
  });
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
    return Departure.fakes();
  },

  searchStations(query) {
    VBB.searchStations(query).then(function(data) {
      backfillStations(data, 'stationSearch:retrieved', Station.orderByScore);
    });
    return Station.none();
  },

  getStations(ids) {
    const data = ids.map(id => { return { id: id }; });
    backfillStations(data, 'stationsVia:retrieved', Station.orderByWeight);
    return Station.none();
  }
};

export default data;
