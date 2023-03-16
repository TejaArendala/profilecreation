import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
  const [candidates, setCandidates] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('/api/candidate');
        setCandidates(response.data.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    };
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/candidate/${id}`);
      setSuccessMessage(response.data.message);
      setCandidates(candidates.filter((candidate) => candidate._id !== id));
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedCandidate(null);
    setShowDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/candidate/${selectedCandidate._id}`, {
        firstName: selectedCandidate.firstName,
        middleName: selectedCandidate.middleName,
        lastName: selectedCandidate.lastName,
        email: selectedCandidate.email,
        phone: selectedCandidate.phone,
        role: selectedCandidate.role,
        resumeSource: selectedCandidate.resumeSource,
        recruiterName: selectedCandidate.recruiterName,
        formToEmail: selectedCandidate.formToEmail,
      });
      setSuccessMessage(response.data.message);
      setCandidates(candidates.map((candidate) => candidate._id ===
selectedCandidate._id ? response.data.data : candidate));
handleDialogClose();
} catch (error) {
setErrorMessage(error.response.data.message);
}
};

return (
<div>
{successMessage && <div className="success-message">{successMessage}</div>}
{errorMessage && <div className="error-message">{errorMessage}</div>}
<table>
<thead>
<tr>
<th>First Name</th>
<th>Middle Name</th>
<th>Last Name</th>
<th>Email</th>
<th>Phone</th>
<th>Role</th>
<th>Resume Source</th>
<th>Recruiter Name</th>
<th>Form to Email</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{candidates.map((candidate) => (
<tr key={candidate._id}>
<td>{candidate.firstName}</td>
<td>{candidate.middleName}</td>
<td>{candidate.lastName}</td>
<td>{candidate.email}</td>
<td>{candidate.phone}</td>
<td>{candidate.role}</td>
<td>{candidate.resumeSource}</td>
<td>{candidate.recruiterName}</td>
<td>{candidate.formToEmail}</td>
<td>
<button onClick={() => handleEdit(candidate)}>Edit</button>
<button onClick={() => handleDelete(candidate._id)}>Delete</button>
</td>
</tr>
))}
</tbody>
</table>
{showDialog && (
<div className="dialog">
<form onSubmit={handleSubmit}>
<label>
First Name:
<input
type="text"
value={selectedCandidate.firstName}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, firstName: event.target.value })
}
/>
</label>
<label>
Middle Name:
<input
type="text"
value={selectedCandidate.middleName}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, middleName: event.target.value })
}
/>
</label>
<label>
Last Name:
<input
type="text"
value={selectedCandidate.lastName}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, lastName: event.target.value })
}
/>
</label>
<label>
Email:
<input
type="email"
value={selectedCandidate.email}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, email: event.target.value })
}
/>
</label>
<label>
Phone:
<input
type="tel"
value={selectedCandidate.phone}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, phone: event.target.value })
}
/>
</label>
<label>
Role:
<input
type="text"
value={selectedCandidate.role}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, role: event.target.value })
}
/>
</label>
<label>
Resume Source:
<input
type="text"
value={selectedCandidate.resumeSource}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, resumeSource: event.target.value })
}
/>
</label>
<label>
Recruiter Name:
<input
type="text"
value={selectedCandidate.recruiterName}
onChange={(event) =>setSelectedCandidate({ ...selectedCandidate, recruiterName: event.target.value })
}
/>
</label>
<label>
Form to Email:
<input
type="email"
value={selectedCandidate.formToEmail}
onChange={(event) =>
setSelectedCandidate({ ...selectedCandidate, formToEmail: event.target.value })
}
/>
</label>
<div className="button-container">
<button type="submit">Save</button>
<button onClick={handleDialogClose}>Cancel</button>
</div>
</form>
</div>
)}
</div>
);
};

export default Table;
