const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/social-network-api', {
  useUnifiedTopology: true
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT} !`);
});

