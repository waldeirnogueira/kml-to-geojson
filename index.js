const express = require('express');
const multer = require('multer');
const { DOMParser } = require('xmldom');
const tj = require('@mapbox/togeojson');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), (req, res) => {
  try {
    const xml = fs.readFileSync(req.file.path, 'utf8');
    const kmlDom = new DOMParser().parseFromString(xml, 'text/xml');
    const geojson = tj.kml(kmlDom);
    fs.unlinkSync(req.file.path);
    res.json(geojson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Servidor ativo'));
app.listen(port, () => console.log(`Listening on ${port}`));
