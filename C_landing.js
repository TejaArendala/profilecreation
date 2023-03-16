import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [domain, setDomain] = useState('');
  const [role, setRole] = useState('');
  const [resumeSource, setResumeSource] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [formToEmail, setFormToEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
    setRole('');
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/candidate', {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        domain,
        role,
        resumeSource,
        recruiterName,
        formToEmail,
      });
      setSuccessMessage(response.data.message);
      history.push('/table');
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const softwareEngineerRoles = [
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  ];

  const dataScientistRoles = [
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
    { value: 'Data Engineer', label: 'Data Engineer' },
  ];

  const productManagerRoles = [
    { value: 'Technical Product Manager', label: 'Technical Product Manager' },
    { value: 'Product Owner', label: 'Product Owner' },
    { value: 'Product Analyst', label: 'Product Analyst' },
  ];

  const uiUxDesignerRoles = [
    { value: 'Visual Designer', label: 'Visual Designer' },
    { value: 'UX Designer', label: 'UX Designer' },
    { value: 'UI Designer', label: 'UI Designer' },
  ];

  const rolesByDomain = {
    'Software Engineering': softwareEngineerRoles,
    'Data Science': dataScientistRoles,
    'Product Management': productManagerRoles,
    'UI/UX Design': uiUxDesignerRoles,
  };

  const roleOptions = rolesByDomain[domain] || [];

  return (
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
        value={middle
Name}
onChange={(event) => setMiddleName(event.target.value)}
maxLength={10}
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

  <label htmlFor="domain">Domain:</label>
  <select id="domain" value={domain} onChange={handleDomainChange} required>
    <option value="">Select Domain</option>
    <option value="Software Engineering">Software Engineering</option>
    <option value="Data Science">Data Science</option>
    <option value="Product Management">Product Management</option>
    <option value="UI/UX Design">UI/UX Design</option>
  </select>

  {roleOptions.length > 0 && (
    <div>
      <label htmlFor="role">Role:</label>
      <select id="role" value={role} onChange={handleRoleChange} required>
        <option value="">Select Role</option>
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )}

  <label htmlFor="resumeSource">Resume Source:</label>
  <input
    type="text"
    id="resumeSource"
    value={resumeSource}
    onChange={(event) => setResumeSource(event.target.value)}
  />

  <label htmlFor="recruiterName">Recruiter Name:</label>
  <input
    type="text"
    id="recruiterName"
    value={recruiterName}
    onChange={(event) => setRecruiterName(event.target.value)}
  />

  <label htmlFor="formToEmail">Form To Email:</label>
  <input
    type="email"
    id="formToEmail"
    value={formToEmail}
    onChange={(event) => setFormToEmail(event.target.value)}
    required
  />

  {successMessage && <div className="success">{successMessage}</div>}
  {errorMessage && <div className="error">{errorMessage}</div>}

  <button type="submit">Submit</button>
</form>
);
};

export default LandingPage;
