// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to get candidates' });
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
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to add candidate' });
  }
});

app.put('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Log the candidate update to the audit log
    const auditLog = new AuditLog({
      collectionName: 'Candidate',
      operationType: 'update',
      documentId: candidate._id,
      documentData: candidate.toObject(),
    });
    await auditLog.save();
    
    res.json({ success: true, message: 'Candidate updated successfully', data: candidate });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to update candidate' });
  }
});

app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id
await candidate.remove();

// Log the candidate deletion to the audit log
const auditLog = new AuditLog({
  collectionName: 'Candidate',
  operationType: 'delete',
  documentId: candidate._id,
  documentData: candidate.toObject(),
});
await auditLog.save();

res.json({ success: true, message: 'Candidate deleted successfully' });
} catch (err) {
console.log(err);
res.json({ success: false, message: 'Failed to delete candidate' });
}
});

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));
