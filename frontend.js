import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [resumeSource, setResumeSource] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [formToEmail, setFormToEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [candidates, setCandidates] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/candidate', {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        role,
        resumeSource,
        recruiterName,
        formToEmail,
      });
      setSuccessMessage(response.data.message);
      setCandidates(response.data.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/candidate/${id}`);
      setSuccessMessage(response.data.message);
      setCandidates(response.data.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          minLength={2}
          maxLength={10}
        />

        <label htmlFor="middleName">Middle Name:</label>
        <input
          type="text"
          id="middleName"
          value={middleName}
          onChange={(event) => setMiddleName(event.target.value)}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          minLength={2}
          maxLength={10}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          pattern="[0-9]{10}"
          required
        />

        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          required
        >
          <option value="">Select a role</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Product
Manager">Product Manager</option>
<option value="UI/UX Designer">UI/UX Designer</option>
</select>
    <label htmlFor="resumeSource">Resume Source:</label>
    <select
      id="resumeSource"
      value={resumeSource}
      onChange={(event) => setResumeSource(event.target.value)}
      required
    >
      <option value="">Select a resume source</option>
      <option value="LinkedIn">LinkedIn</option>
      <option value="Indeed">Indeed</option>
      <option value="Referral">Referral</option>
      <option value="Career Website">Career Website</option>
    </select>

    <label htmlFor="recruiterName">Recruiter Name:</label>
    <input
      type="text"
      id="recruiterName"
      value={recruiterName}
      onChange={(event) => setRecruiterName(event.target.value)}
      required
    />

    <label htmlFor="formToEmail">Form to Email:</label>
    <select
      id="formToEmail"
      value={formToEmail}
      onChange={(event) => setFormToEmail(event.target.value)}
      required
    >
      <option value="">Select a form to email</option>
      <option value="Software Engineer Application Form">
        Software Engineer Application Form
      </option>
      <option value="Data Scientist Application Form">
        Data Scientist Application Form
      </option>
      <option value="Product Manager Application Form">
        Product Manager Application Form
      </option>
      <option value="UI/UX Designer Application Form">
        UI/UX Designer Application Form
      </option>
    </select>

    <button type="submit">Submit</button>
  </form>

  {successMessage && <p>{successMessage}</p>}
  {errorMessage && <p>{errorMessage}</p>}

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Resume Source</th>
        <th>Recruiter Name</th>
        <th>Form to Email</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {candidates.map((candidate) => (
        <tr key={candidate._id}>
          <td>{candidate._id}</td>
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
            <button onClick={() => handleDelete(candidate._id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
);
};

export default App;
