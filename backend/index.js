const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const port = 3000;
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
// Initialize Express
const app = express();
const cors = require("cors");
app.use(cors());

//Set up Google Cloud Storage
// const storage = new Storage({
//   keyFilename: path.join(__dirname, 'tcs-alphabet-genai.json'),
//   projectId: 'tcs-alphabet-genai',
// });

//const bucket = storage.bucket('vishakosh_bucket');

// Middleware for file upload using Multer
const upload = multer({
  storage: multer.memoryStorage(),
});

// Upload multiple files
app.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;

    const uploadPromises = files.map((file) => {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        console.log(err);
        res.status(500).send('Unable to upload');
      });

      blobStream.end(file.buffer);
    });

    await Promise.all(uploadPromises);
    res.status(200).send('Files uploaded.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Upload failed.');
  }
});

// Get file list
app.get('/', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    console.log(files);
    const fileList = await Promise.all(files.map(async file => {
      const [metadata] = await file.getMetadata();
      return {
        name: file.name,
        size: metadata.size,
        type: metadata.contentType,
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      };
    }));
    res.json(fileList);
  } catch (error) {
    res.status(500).send('Failed to fetch files.');
  }
});



async function insertChatHistory(sessionId, userId, message) {
    const datasetId = 'dataset_id';
    const tableId = 'chat_history';

    const rows = [
        { session_id: sessionId, user_id: userId, message: message, timestamp: new Date().toISOString() }
    ];

    await bigquery.dataset(datasetId).table(tableId).insert(rows);
    console.log(`Inserted chat history for session: ${sessionId}`);
}

// async function getChatHistory(sessionId) {
//   const query = SELECT * FROM \`project_id.dataset_id.chat_history\ WHERE session_id = @sessionId ORDER BY timestamp ASC`;
  
//   const options = {
//       query: query,
//       params: { sessionId: sessionId },
//   };

//   const [rows] = await bigquery.query(options);
//   return rows;
// }

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});