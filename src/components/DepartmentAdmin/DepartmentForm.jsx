// import React, { useState, useEffect } from "react";

// const DepartmentForm = ({ fetchDepartments, facultyName, editingDepartment, setEditingDepartment }) => {
//   const [name, setName] = useState("");

//   useEffect(() => {
//     if (editingDepartment) {
//       setName(editingDepartment.name);
//     } else {
//       setName(""); // Clear the form if not editing
//     }
//   }, [editingDepartment]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = editingDepartment ? "PATCH" : "POST";
//     const url = editingDepartment
//       ? `${import.meta.env.VITE_API_URL}/api/department/${editingDepartment._id}`
//       : `${import.meta.env.VITE_API_URL}/api/department`;

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, faculty: facultyName }),
//       });
//       if (!response.ok) throw new Error("Failed to save department");
//       await fetchDepartments();
//       setEditingDepartment(null);
//       setName("");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>{editingDepartment ? "Edit Department" : "Add Department"}</h3>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Department Name"
//         required
//       />
//       <button type="submit">{editingDepartment ? "Update" : "Create"}</button>
//       {editingDepartment && (
//         <button type="button" onClick={() => setEditingDepartment(null)}>
//           Cancel
//         </button>
//       )}
//     </form>
//   );
// };

// export default DepartmentForm;

// DepartmentForm.jsx
import React, { useState, useEffect } from "react";

const DepartmentForm = ({ fetchDepartments, facultyId, editingDepartment, setEditingDepartment }) => {
  const [formData, setFormData] = useState({
    name: "",
    faculty: facultyId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name,
        faculty: facultyId
      });
    } else {
      resetForm();
    }
  }, [editingDepartment, facultyId]);

  const resetForm = () => {
    setFormData({
      name: "",
      faculty: facultyId
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editingDepartment ? "PATCH" : "POST";
    const url = editingDepartment
      ? `${import.meta.env.VITE_API_URL}/api/department/${editingDepartment._id}`
      : `${import.meta.env.VITE_API_URL}/api/department`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save department");
      }

      await fetchDepartments();
      setEditingDepartment(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingDepartment(null);
    resetForm();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {editingDepartment ? "Edit Department" : "Add New Department"}
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Department Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter department name"
            required
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : editingDepartment ? "Update Department" : "Create Department"}
          </button>
          
          {editingDepartment && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;