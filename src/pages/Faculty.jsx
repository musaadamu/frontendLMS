// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";

// const Faculty = () => {
//   const { facultyName } = useParams();
//   const [faculty, setFaculty] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFacultyAndDepartments = async () => {
//       try {
//         // Fetch faculty details
//         const facultyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyName}`);
//         if (!facultyRes.ok) throw new Error("Faculty not found");

//         const facultyData = await facultyRes.json();
//         setFaculty(facultyData.data.faculty);

//         // Fetch departments for this faculty
//         const deptRes = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/faculty=${facultyData.data.faculty._id}`
//         );
//         if (!deptRes.ok) throw new Error("Departments not found");

//         const deptData = await deptRes.json();
//         setDepartments(deptData.data.departments);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFacultyAndDepartments();
//   }, [facultyName]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!faculty) return <div>Faculty not found</div>;

//   return (
//     <div className="faculty-page">
//       <h1>{faculty.name} Faculty</h1>
//       <h2>Departments</h2>
//       <ul>
//         {departments.map((dept) => (
//           <li key={dept._id}>
//             <Link to={`/faculty/${facultyName}/departments/${dept._id}`}>{dept.name}</Link>
//           </li>
//         ))}
//       </ul>

//       <div className="navigation-links">
//         <Link to="/faculty">Back to Faculties</Link>
//         <br />
//         <Link to="/">Back to Home</Link>
//       </div>
//     </div>
//   );
// };

// export default Faculty;

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUniversity, FaBuilding, FaArrowLeft, FaHome } from "react-icons/fa";

const Faculty = () => {
  const { facultyName } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyAndDepartments = async () => {
      try {
        setLoading(true);
        
        // Fetch faculty details
        const facultyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/by-name/${facultyName}`);
        if (!facultyRes.ok) throw new Error("Faculty not found");

        const facultyData = await facultyRes.json();
        setFaculty(facultyData.data.faculty);

        // Fetch departments for this faculty
        const deptRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/department/by-faculty/${facultyData.data.faculty._id}`
        );
        if (!deptRes.ok) throw new Error("Failed to load departments");

        const deptData = await deptRes.json();
        setDepartments(deptData.data.departments);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAndDepartments();
  }, [facultyName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
        <div className="mt-4">
          <Link to="/faculty" className="text-blue-500 hover:underline flex items-center gap-2">
            <FaArrowLeft /> Back to Faculties
          </Link>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Faculty not found
        </div>
        <div className="mt-4">
          <Link to="/faculty" className="text-blue-500 hover:underline flex items-center gap-2">
            <FaArrowLeft /> Back to Faculties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <FaUniversity className="text-blue-500" /> {faculty.name}
      </h1>
      <p className="text-gray-600 mb-6">{faculty.description || "No description available"}</p>

      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaBuilding className="text-blue-500" /> Departments
      </h2>

      {departments.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          No departments found for this faculty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{dept.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {dept.description || "No description available"}
                </p>
                <Link
                  to={`/faculty/${facultyName}/${dept._id}`}
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  View Department
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link 
          to="/faculty" 
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
        >
          <FaArrowLeft /> Back to Faculties
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
        >
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Faculty;