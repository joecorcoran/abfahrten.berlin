const stations = require('vbb-stations-connected-to');
const fs = require('fs');
const path = require('path');
const util = require('util');

const output = `const stations = ${util.inspect(stations, { depth: null })};

export default stations;
`;

const cb = function(error) {
  if (!error) return;
  console.log(error);
};

fs.writeFile(path.join(__dirname, 'src', 'connected.js'), output, cb);
