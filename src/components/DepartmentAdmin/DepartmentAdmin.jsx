// import React, { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import DepartmentForm from "./DepartmentForm";
// import { AuthContext } from "../Auth/AuthContext"; // Adjust the path as needed

// const DepartmentAdmin = () => {
//   // Use AuthContext for authentication
//   const { isAuthenticated, handleLogout } = useContext(AuthContext);

//   if (!isAuthenticated) {
//     return <div>You must be logged in to manage departments.</div>;
//   }

//   // Extract the facultyId from the route
//   const { facultyId } = useParams();

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingDepartment, setEditingDepartment] = useState(null);

//   useEffect(() => {
//     fetchDepartments();
//   }, [facultyId]);

//   const fetchDepartments = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/department`);
//       if (!response.ok) throw new Error("Failed to fetch departments");
//       const data = await response.json();
//       // Filter departments by comparing the faculty ID
//       const facultyDepartments = data.data.departments.filter(
//         (dept) => dept.faculty._id === facultyId
//       );
//       setDepartments(facultyDepartments);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteDepartment = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this department?")) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/department/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete department");
//       setDepartments(departments.filter((dept) => dept._id !== id));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (department) => {
//     setEditingDepartment(department);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="department-admin">
//       <h2>Manage Departments for Faculty ID: {facultyId}</h2>
//       <button onClick={handleLogout}>Logout</button>
//       <DepartmentForm
//         fetchDepartments={fetchDepartments}
//         facultyName={facultyId} // Passing the faculty ID for association in the API call
//         editingDepartment={editingDepartment}
//         setEditingDepartment={setEditingDepartment}
//       />

//       <ul>
//         {departments.map((dept) => (
//           <li key={dept._id}>
//             {dept.name}
//             <button onClick={() => handleEdit(dept)}>Edit</button>
//             <button onClick={() => deleteDepartment(dept._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DepartmentAdmin;

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DepartmentForm from "./DepartmentForm";
import { AuthContext } from "../Auth/AuthContext";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const DepartmentAdmin = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { facultyId } = useParams();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchDepartments();
    fetchFacultyName();
  }, [facultyId, isAuthenticated]);

  const fetchFacultyName = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}`);
      if (!response.ok) throw new Error("Failed to fetch faculty");
      const data = await response.json();
      setFacultyName(data.data.faculty.name);
    } catch (err) {
      console.error("Error fetching faculty name:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/department`);
      if (!response.ok) throw new Error("Failed to fetch departments");
      
      const data = await response.json();
      // Filter departments by faculty ID
      const filteredDepartments = data.data.departments.filter(
        (dept) => dept.faculty._id === facultyId
      );
      
      setDepartments(filteredDepartments);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/department/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete department");
      }
      
      setDepartments(departments.filter((dept) => dept._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
  };

  const handleBack = () => {
    navigate("/admin/faculty");
  };

  if (loading && departments.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Manage Departments: {facultyName || `Faculty ID: ${facultyId}`}
        </h2>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <DepartmentForm
        fetchDepartments={fetchDepartments}
        facultyId={facultyId}
        editingDepartment={editingDepartment}
        setEditingDepartment={setEditingDepartment}
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Department List</h3>
        {departments.length === 0 ? (
          <p className="text-gray-500">No departments found. Create one using the form above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Faculty</th>
                  <th className="py-2 px-4 border-b text-left">Created</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{dept.name}</td>
                    <td className="py-2 px-4 border-b">{dept.faculty.name}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteDepartment(dept._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentAdmin;