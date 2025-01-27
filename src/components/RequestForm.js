import React, { useState } from 'react';

const RequestForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = { title, category, status: 'Pending', image, description };
    onSubmit(request);
    setTitle('');
    setCategory('');
    setImage(null);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea 
        type="text"
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)} 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Merge">Merge</option>
        <option value="Target-Change">Target Change</option>
        <option value="General">General</option>
      </select>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;
