const express = require('express'),
  morgan = require('morgan'),
  path = require('path'),
  port = process.env.PORT || 3000,
  redis = require('redis'),
  redisClient = redis.createClient(),
  rfs = require('rotating-file-stream'),
  shortid = require('shortid'),
  urlBase = process.env.URL_BASE || `http://localhost:${port}`;

const app = express();

const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log')
});

app.use(morgan('tiny', { stream: accessLogStream }));
app.use(express.json());

app.get('/:key', (req, res) => {
  let key = req.params.key;
  redisClient.zrange(key, 0, -1, (err, boards) => {
    if (err) {
      res.status(500).send({
        key: key,
        error: 'Application error'
      });
    }
    if (boards.length > 0) {
      res.status(200).send({
        key: key,
        boards: boards.map(board => JSON.parse(board))
      });
    } else {
      res.status(404).send({
        key: key,
        error: 'not found'
      });
    }
  });
});

app.post('/', (req, res) => {
  let boards = req.body.boards;
  let key = shortid.generate();
  boards.forEach(board => {
    redisClient.zadd(key, board.order, JSON.stringify({ from: board.from, to: board.to }))
  });
  res.status(202).send({
    key: key,
    url: `${urlBase}/${key}`
  });
});

app.listen(port, () => {
  console.log(`abfahrten-server listening on port ${port}...`);
});

module.exports = app;
