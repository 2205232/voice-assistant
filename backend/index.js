require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const port = 3000;
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize Express
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

// Initialize Multer (for handling file uploads)
const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

// Load GCP credentials from environment variable
const credentials = JSON.parse(process.env.GCP_CREDENTIALS);

// Initialize Google Cloud Storage
const storage = new Storage({ credentials });
const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket(bucketName);
const bigquery = new BigQuery({ credentials });
const datasetId = 'chat_history_dataset';
const tableId = 'chat_history_demo';
const project_id = process.env.project_id;
// POST: Upload multiple files to Google Cloud Storage
app.post('/', upload.array('files'), async (req, res) => {
  try {
    const uploadedFiles = [];

    // Loop through each file and upload to GCP bucket
    for (const file of req.files) {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      // Handle errors in the stream
      blobStream.on('error', (err) => {
        console.error('Blob stream error:', err);
        return res.status(500).send({ message: 'Upload failed.' });
      });

      // Handle the finish of the upload stream
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        uploadedFiles.push({
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          url: publicUrl,
        });

        if (uploadedFiles.length === req.files.length) {
          // Respond once all files are uploaded
          res.status(200).send(uploadedFiles);
        }
      });

      // Start writing the file to the bucket
      blobStream.end(file.buffer);
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).send({ message: 'Something went wrong!' });
  }
});

// GET: Fetch all files from the Google Cloud Storage bucket
app.get('/', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileList = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          size: metadata.size,
          type: metadata.contentType,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        };
      })
    );
    res.status(200).send(fileList);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send({ message: 'Something went wrong!' ,error:error.message});
  }
});

// Insert chat history into BigQuery
async function insertChatHistory(user_id, message) {  
  console.log(project_id);
  const rows = [{ user_id, message}];
  try {
    console.log(rows);
    await bigquery.dataset(datasetId).table(tableId).insert(rows);
    console.log("test3");
    console.log(`Inserted ${rows.length} rows`);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

// Endpoint to store chat history
app.post('/saveChatHistory', async (req, res) => {
  const { userId, message } = req.body;  
  const armessage= JSON.stringify(message);
  await insertChatHistory(userId, armessage);
  console.log("test1");
 res.sendStatus(200);
});

// Endpoint to get chat history
app.get('/getChatHistory/:userId', async (req, res) => {
  const userId = req.params.userId;

  const history = await getChatHistory(userId);
  res.json(history);
});

// async function getChatHistory(sessionId) {
//     const query = SELECT * FROM \`project_id.datasetId.tableId\ WHERE session_id = @sessionId ORDER BY timestamp ASC`;
    
//     const options = {
//         query: query,
//         params: { sessionId: sessionId },
//     };
  
//     const [rows] = await bigquery.query(options);
//     return rows;
//   }

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});