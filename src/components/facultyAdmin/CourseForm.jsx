import React, { useState, useEffect } from "react";

const CourseForm = ({
  fetchCourses,
  departmentId, // Optional: pre-defined department ID (if courses are always for one department)
  availableDepartments = [], // Optional: array of departments for selection
  editingCourse,
  setEditingCourse,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [prerequisites, setPrerequisites] = useState(""); // Comma-separated input
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId || "");

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setDescription(editingCourse.description);
      setCredits(editingCourse.credits);
      // Convert prerequisites array to comma-separated string (if any)
      setPrerequisites(
        editingCourse.prerequisites
          ? editingCourse.prerequisites.join(", ")
          : ""
      );
      setSelectedDepartment(editingCourse.department);
    } else {
      setName("");
      setDescription("");
      setCredits("");
      setPrerequisites("");
      setSelectedDepartment(departmentId || "");
    }
  }, [editingCourse, departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert prerequisites input string into an array of IDs
    const prerequisitesArray = prerequisites
      ? prerequisites
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      : [];

    // Ensure a department is selected before proceeding
    if (!selectedDepartment) {
      alert("Please select a department for this course.");
      return;
    }

    const method = editingCourse ? "PATCH" : "POST";
    const url = editingCourse
      ? `${import.meta.env.VITE_API_URL}/api/course/${editingCourse._id}`
      : `${import.meta.env.VITE_API_URL}/api/course`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          credits,
          department: selectedDepartment, // Link course to department
          prerequisites: prerequisitesArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to save course");
      await fetchCourses();
      setEditingCourse(null);
      setName("");
      setDescription("");
      setCredits("");
      setPrerequisites("");
      if (!departmentId) {
        setSelectedDepartment("");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="course-form">
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
      <input
        type="text"
        value={prerequisites}
        onChange={(e) => setPrerequisites(e.target.value)}
        placeholder="Prerequisites (comma separated IDs)"
      />
      {/* If no fixed departmentId is provided, display a department selection dropdown */}
      {!departmentId && availableDepartments.length > 0 && (
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {availableDepartments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      )}
      <button type="submit">
        {editingCourse ? "Update" : "Create"}
      </button>
      {editingCourse && (
        <button type="button" onClick={() => setEditingCourse(null)}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default CourseForm;
