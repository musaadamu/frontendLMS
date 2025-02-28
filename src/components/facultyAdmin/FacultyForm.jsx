import React, { useState, useEffect } from "react";

const FacultyForm = ({ fetchFaculties, editingFaculty, setEditingFaculty }) => {
  const [name, setName] = useState("");

  // Set API URL based on NODE_ENV
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://backend-lms-render.onrender.com'
    : 'http://localhost:5000';

  useEffect(() => {
    if (editingFaculty) {
      setName(editingFaculty.name);
    }
  }, [editingFaculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingFaculty ? "PATCH" : "POST";
    const url = editingFaculty
      ? `${apiUrl}/api/faculty/${editingFaculty._id}`
      : `${apiUrl}/api/faculty`;
      
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to save faculty");
      await fetchFaculties();
      setEditingFaculty(null);
      setName("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <style>
        {`
          form {
            max-width: 600px;
            margin: 0 auto;
            padding: 1.5rem;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          h3 {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
          }

          button {
            width: 100%;
            padding: 0.75rem;
            background-color: #4299e1;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          button:hover {
            background-color: #2b6cb0;
          }

          @media (max-width: 768px) {
            form {
              padding: 1rem;
            }

            h3 {
              font-size: 1.5rem; /* Smaller title size on mobile */
            }

            input {
              font-size: 0.9rem; /* Smaller font size on mobile */
            }
          }
        `}
      </style>

      <form onSubmit={handleSubmit}>
        <h3>{editingFaculty ? "Edit Faculty" : "Add Faculty"}</h3>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Faculty Name"
          required 
        />
        <button type="submit">{editingFaculty ? "Update" : "Create"}</button>
        {editingFaculty && (
          <button type="button" onClick={() => setEditingFaculty(null)}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default FacultyForm;