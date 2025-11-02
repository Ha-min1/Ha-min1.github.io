require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/_health', (req, res) => res.send('OK'));
app.get('/api/messages', (req, res) => res.json({ messages: ['Hello world!'] }));

app.listen(PORT, () => console.log('Server running on port', PORT));
