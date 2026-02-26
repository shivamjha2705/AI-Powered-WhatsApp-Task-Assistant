require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/whatsapp', whatsappRoutes);

app.get('/', (req, res) => {
    res.send('Task RAG WhatsApp Bot is running...');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
