import React, { useState, useEffect } from "react";

const FacultyForm = ({ fetchFaculties, editingFaculty, setEditingFaculty }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingFaculty) {
      setName(editingFaculty.name);
    }
  }, [editingFaculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingFaculty ? "PATCH" : "POST";
    const url = editingFaculty
    ? `${import.meta.env.VITE_API_URL}/api/faculty/${editingFaculty._id}`
    : `${import.meta.env.VITE_API_URL}/api/faculty`;
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
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <button type="submit">{editingFaculty ? "Update" : "Create"}</button>
      {editingFaculty && <button onClick={() => setEditingFaculty(null)}>Cancel</button>}
    </form>
  );
};

export default FacultyForm;
