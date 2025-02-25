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
  );
};

export default FacultyForm;
