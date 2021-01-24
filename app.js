require('dotenv').config();
const express = require('express');

const app = express();

function requestLoggerMiddleware({ method, path, ip }, res, next) {
  console.log(`${method} ${path} - ${ip}`);

  next();
}

// Middlewares
app.use(express.static(__dirname + '/public'));
app.use(requestLoggerMiddleware);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/json', (req, res) => {
  const message = 'Hello world!';

  res.json({
    message:
      process.env.MESSAGE_STYLE === 'uppercase'
        ? message.toUpperCase()
        : message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
