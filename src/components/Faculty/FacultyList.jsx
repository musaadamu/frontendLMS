import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import "./FacultyList.css"; // Import the CSS file

const FacultyList = () => {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://backend-lms-render.onrender.com'
    : 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const facultyResponse = await fetch(`${apiUrl}/api/faculty`);
        if (!facultyResponse.ok) throw new Error("Failed to fetch faculties");
        const facultyData = await facultyResponse.json();
        setFaculties(facultyData.data.faculties);
        
        const departmentResponse = await fetch(`${apiUrl}/api/department`);
        if (!departmentResponse.ok) throw new Error("Failed to fetch departments");
        const departmentData = await departmentResponse.json();
        setDepartments(departmentData.data.departments);
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const filteredDepartments = selectedFaculty 
    ? departments.filter(dept => dept.faculty._id === selectedFaculty)
    : departments;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Faculties &amp; Departments</h1>
      <p className="sub-header">
        Explore our diverse range of faculties and departments, each committed to excellence in teaching, research, and innovation.
      </p>
      
      <div className="layout">
        {/* Sidebar Filter Section */}
        <div className="filter-section">
          <label htmlFor="faculty-filter" className="filter-label">
            Filter by Faculty:
          </label>
          <select
            id="faculty-filter"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Faculties</option>
            {faculties.map(faculty => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <p className="filter-description">
            Select a faculty to narrow down the list of departments.
          </p>
          {/* Display the list of all available faculties */}
          <div className="faculty-list">
            <h3>Available Faculties:</h3>
            <ul>
              {faculties.map(faculty => (
                <li key={faculty._id}>{faculty.name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Results Section */}
        <div className="results-section">
          {filteredDepartments.length === 0 ? (
            <div className="alert alert-warning">
              No departments found. {selectedFaculty && "Try selecting a different faculty."}
            </div>
          ) : (
            <div className="grid">
              {filteredDepartments.map(department => {
                const facultyName = faculties.find(f => f._id === department.faculty._id)?.name || "Unknown Faculty";
                
                return (
                  <div key={department._id} className="card">
                    <h2 className="card-title">{department.name}</h2>
                    <p className="card-subtitle">{facultyName}</p>
                    <p className="card-description">
                      Discover more about this department’s innovative programs, expert faculty, and research opportunities.
                    </p>
                    <Link
                      to={`/faculty/${facultyName.toLowerCase().replace(/\s+/g, '-')}/${department._id}`}
                      className="card-button"
                    >
                      View Department
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyList;