// Import required packages
import express, { Application, Request, Response } from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Connect to MongoDB
mongoose.connect('mongodb://172.16.0.52:60002/Onboarding_Venkatesh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err: any) => console.log(err));

// Define candidate interface
interface Candidate extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  resumeSource: string;
  recruiterName: string;
  formToEmail: string;
}

// Define audit log interface
interface AuditLog extends Document {
  collectionName: string;
  operationType: string;
  documentId: Schema.Types.ObjectId;
  documentData?: any;
}

// Create candidate schema and model
const candidateSchema: Schema = new mongoose.Schema({
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

const Candidate = mongoose.model<Candidate>('Candidate', candidateSchema);

// Create audit log schema and model
const auditLogSchema: Schema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  operationType: { type: String, required: true },
  documentId: { type: Schema.Types.ObjectId, required: true },
  documentData: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const AuditLog = mongoose.model<AuditLog>('AuditLog', auditLogSchema);

// Middleware
const app: Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// API routes
app.get('/api/candidates', async (req: Request, res: Response) => {
  try {
    const candidates: Candidate[] = await Candidate.find();
    res.json({ success: true, data: candidates });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Failed to get candidates' });
  }
});

app.post('/api/candidates', async (req: Request, res: Response) => {
  try {
    const candidate: Candidate = new Candidate(req.body);
    await candidate.save();
    
    // Log the candidate creation to the audit log
    const auditLog: AuditLog = new AuditLog({
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

app.put('/api/candidates/:id', async (req: Request, res: Response) => {
  try {
    const candidate: Candidate | null = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
);
if (!candidate) {
return res.json({ success: false, message: 'Candidate not found' });
}

// Log the candidate update to the audit log
const auditLog: AuditLog = new AuditLog({
  collectionName: 'Candidate',
  operationType: 'update',
  documentId: candidate._id,
  documentData: candidate.toObject(),
});
await auditLog.save();

res.json({ success: true, message: 'Candidate updated successfully' });
} catch (err) {
console.log(err);
res.json({ success: false, message: 'Failed to update candidate' });
}
});

app.delete('/api/candidates/:id', async (req: Request, res: Response) => {
try {
const candidate: Candidate | null = await Candidate.findByIdAndDelete(
req.params.id,
);
if (!candidate) {
return res.json({ success: false, message: 'Candidate not found' });
}
// Log the candidate deletion to the audit log
const auditLog: AuditLog = new AuditLog({
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

// Start the server
const PORT: number = 3000;

app.listen(PORT, () => {
console.log(Server running on port ${PORT});
});
