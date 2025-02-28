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

  // Set API URL based on NODE_ENV
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://backend-lms-render.onrender.com'
    : 'http://localhost:5000';

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setDescription(editingCourse.description);
      setCredits(editingCourse.credits);
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

    const prerequisitesArray = prerequisites
      ? prerequisites
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      : [];

    if (!selectedDepartment) {
      alert("Please select a department for this course.");
      return;
    }

    const method = editingCourse ? "PATCH" : "POST";
    const url = editingCourse
      ? `${apiUrl}/api/course/${editingCourse._id}`
      : `${apiUrl}/api/course`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          credits,
          department: selectedDepartment,
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
    <div>
      <style>
        {`
          .course-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 1.5rem;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .course-form h3 {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .course-form input,
          .course-form textarea,
          .course-form select,
          .course-form button {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
          }

          .course-form button {
            background-color: #4299e1;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .course-form button:hover {
            background-color: #2b6cb0;
          }

          @media (max-width: 768px) {
            .course-form {
              padding: 1rem;
            }

            .course-form h3 {
              font-size: 1.5rem;
            }

            .course-form input,
            .course-form textarea,
            .course-form select {
              font-size: 0.9rem; /* Smaller font size on mobile */
            }
          }
        `}
      </style>

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
    </div>
  );
};

export default CourseForm;