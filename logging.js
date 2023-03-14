// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://172.16.0.52:60002/Onboarding_Venkatesh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Create candidate schema and model
const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  resumeSource: { type: String, required: true },
  recruiterName: { type: String, required: true },
  formToEmail: { type: String, required: true },
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);

// Create audit log schema and model
const auditLogSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  operationType: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  documentData: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// API routes
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ success: true, data: candidates });
    const logData = `GET /api/candidates - ${new Date().toISOString()} - SUCCESS - ${JSON.stringify(candidates)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), logData);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to get candidates' });
    const logData = `GET /api/candidates - ${new Date().toISOString()} - ERROR - ${err.message}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), logData);
  }
});

app.post('/api/candidates', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();

    // Log the candidate creation to the audit log
    const auditLog = new AuditLog({
      collectionName: 'Candidate',
      operationType: 'create',
      documentId: candidate._id,
      documentData: candidate.toObject(),
    });
    await auditLog.save();

    res.json({ success: true, message: 'Candidate added successfully' });
    const logData = `POST /api/candidates - ${new Date().toISOString()} - SUCCESS - ${JSON.stringify(req.body)}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), logData);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to add candidate' });
    const logData = `POST /api/candidates - ${new Date().toISOString()} - ERROR - ${err.message}\n`;
    fs.appendFileSync(path
