import xhr from 'xhr';

let root = 'https://2.vbb.transport.rest';

let VBB = {
  // Send X-Identifier header when live
  searchStation(query, cb) {
    return xhr.get(`${root}/stations?query=${query}`, { json: true }, cb);
  },

  getDepartures(fromId, toId, cb) {
    return xhr.get(`${root}/stations/${fromId}/departures?nextStation=${toId}&results=5`, { json: true }, cb);
  }
};

export default VBB;
