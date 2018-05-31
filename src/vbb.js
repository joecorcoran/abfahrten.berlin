import xhr from 'xhr';

let root = 'https://2.vbb.transport.rest';

let VBB = {
  // Send X-Identifier header when live
  searchStations(query, cb) {
    return xhr.get(`${root}/stations?query=${query}&fuzzy=true&results=10`, { json: true }, cb);
  },

  getDepartures(fromId, toId, cb) {
    return xhr.get(`${root}/stations/${fromId}/departures?nextStation=${toId}&results=5`, { json: true }, cb);
  }
};

export default VBB;
