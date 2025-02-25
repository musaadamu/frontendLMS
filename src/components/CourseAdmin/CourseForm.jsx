import React, { useState, useEffect } from "react";

const CourseForm = ({ fetchCourses, departmentId, editingCourse, setEditingCourse }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setDescription(editingCourse.description);
      setCredits(editingCourse.credits);
    }
  }, [editingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCourse ? "PATCH" : "POST";
    const url = editingCourse
      ? `${import.meta.env.VITE_API_URL}/api/courses/${editingCourse._id}`
      : `${import.meta.env.VITE_API_URL}/api/courses`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, credits, department: departmentId }),
      });

      if (!response.ok) throw new Error("Failed to save course");
      await fetchCourses();
      setEditingCourse(null);
      setName("");
      setDescription("");
      setCredits("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Course Name" 
        required 
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Course Description" 
        required 
      />
      <input 
        type="number" 
        value={credits} 
        onChange={(e) => setCredits(e.target.value)} 
        placeholder="Credits" 
        required 
      />
      <button type="submit">{editingCourse ? "Update" : "Create"}</button>
      {editingCourse && (
        <button type="button" onClick={() => setEditingCourse(null)}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default CourseForm;
