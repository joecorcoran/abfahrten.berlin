const root = 'https://3.vbb.transport.rest';

const handle = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var e = new Error(response.statusText);
    e.response = response;
    throw e;
  }
};

const parse = function(response) {
  return response.json();
};

const get = function(path) {
  return fetch(`${root}/${path}`).then(handle).then(parse);
}

const VBB = {
  // Send X-Identifier header when live
  getStation(id) {
    return get(`stations/${id}`);
  },

  searchStations(query) {
    return get(`stations?query=${query}&fuzzy=true&results=10`);
  },

  getDepartures(fromId, toId) {
    return get(`stations/${fromId}/departures?direction=${toId}&results=5`)
  }
};

export default VBB;
