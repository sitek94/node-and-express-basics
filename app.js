require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

function requestLoggerMiddleware({ method, path, ip }, res, next) {
  console.log(`${method} ${path} - ${ip}`);

  next();
}

// Middlewares
app.use(express.static(__dirname + '/public'));
app.use(requestLoggerMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));

// HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// JSON
app.get('/json', (req, res) => {
  const message = 'Hello world!';

  res.json({
    message:
      process.env.MESSAGE_STYLE === 'uppercase'
        ? message.toUpperCase()
        : message,
  });
});

// Time server
app.get(
  '/now',
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.send({
      time: req.time,
    });
  }
);

// Get route parameter input
app.get('/:word/echo', (req, res) => {
  res.json({
    echo: req.params.word,
  });
});

// Get query parameter input
app
  .route('/name')
  // GET
  .get((req, res) => {
    res.json({
      name: `${req.query.first} ${req.query.last}`,
    });
  })
  // POST
  .post((req, res) => {
    const { first, last } = req.body;
    res.json({
      name: `${first} ${last}`,
    });
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
