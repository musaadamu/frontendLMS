import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Department.css"; // Make sure to use the updated CSS

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Use VITE_API_URL from environment or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || "https://backend-lms-render.onrender.com/";
  // const baseUrl = process.env.NODE_ENV === 'production'
  // ? 'https://coels-backend.onrender.com'
  // : 'http://localhost:5000';
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch faculties (needed for faculty names)
        const facultyResponse = await fetch(`${apiUrl}/api/faculty`);
        if (!facultyResponse.ok) throw new Error("Failed to fetch faculties");
        const facultyData = await facultyResponse.json();
        setFaculties(facultyData.data.faculties);
        
        // Fetch all departments
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

  // Filter departments based on search term
  const filteredDepartments = searchTerm
    ? departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculties.find(f => f._id === dept.faculty._id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : departments;

  if (loading) {
    return (
      <div className="loading-container">
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
      <h1 className="header">All Departments</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {filteredDepartments.length === 0 ? (
        <div className="alert alert-warning">
          No departments found matching your search.
        </div>
      ) : (
        <div className="departments-grid">
          {filteredDepartments.map(department => {
            const facultyName = faculties.find(f => f._id === department.faculty._id)?.name || "Unknown Faculty";
            
            return (
              <div key={department._id} className="department-card">
                <div className="card-content">
                  <h2 className="card-title">{department.name}</h2>
                  <p className="card-subtitle">{facultyName}</p>
                  {department.description && (
                    <p className="card-description">{department.description}</p>
                  )}
                  <div className="card-actions">
                    <Link
                      to={`/faculty/${facultyName.toLowerCase().replace(/\s+/g, '-')}/${department._id}`}
                      className="view-button"
                    >
                      View Department
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Department;
