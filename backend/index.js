require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const port = 3000;
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const bodyParser = require('body-parser');
// Initialize Express
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

// Parse the GCP_CREDENTIALS environment variable
const credentials = JSON.parse(process.env.GCP_CREDENTIALS);

// Initialize Google Cloud Storage with the parsed credentials
const storage = new Storage({ credentials });

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket(bucketName);
const datasetId = 'tcs-alphabet-genai.chat_history_dataset';
const tableId = 'chat_history';
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
        res.status(500).send('Unable to upload');
      });

      blobStream.end(file.buffer);
    });

    const fileInfos = await Promise.all(uploadPromises);
    res.status(200).json(fileInfos);

  } catch (error) {

    res.status(500).json({message:'Upload failed.',error:error.message});
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


// Insert chat history into BigQuery
async function insertChatHistory(userId, message) {
  const rows = [{ userId, message, timestamp: new Date() }];

  try {
    await bigquery.dataset(datasetId).table(tableId).insert(rows);
    //console.log(Inserted ${rows.length} rows);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

// Endpoint to store chat history
app.post('/saveChatHistory', async (req, res) => {
  const { userId, message } = req.body;

  await insertChatHistory(userId, message);
  res.sendStatus(200);
});



// Endpoint to get chat history
app.get('/getChatHistory/:userId', async (req, res) => {
  const userId = req.params.userId;

  const history = await getChatHistory(userId);
  res.json(history);
});
// async function insertChatHistory(sessionId, userId, message) {  

//     const rows = [
//         { session_id: sessionId, user_id: userId, message: message, timestamp: new Date().toISOString() }
//     ];

//     await bigquery.dataset(datasetId).table(tableId).insert(rows);
//     console.log(`Inserted chat history for session: ${sessionId}`);
// }

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