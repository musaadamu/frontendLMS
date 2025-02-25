import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Course.css"; // Custom CSS for courses

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use VITE_API_URL from environment or fallback to localhost:5000
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch courses and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const courseResponse = await fetch(`${apiUrl}/api/course`);
        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        const courseData = await courseResponse.json();
        setCourses(courseData.data.courses);
        
        // Fetch departments (to display department names for each course)
        const deptResponse = await fetch(`${apiUrl}/api/department`);
        if (!deptResponse.ok) throw new Error("Failed to fetch departments");
        const deptData = await deptResponse.json();
        setDepartments(deptData.data.departments);
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Create a mapping for quick lookup of department names
  const departmentMap = {};
  departments.forEach(dept => {
    departmentMap[dept._id] = dept.name;
  });

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
      <h1 className="header">Courses</h1>
      
      {courses.length === 0 ? (
        <div className="alert alert-warning">
          No courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => {
            // Check if the course's department is an object with a name or use the mapping.
            const deptName =
              typeof course.department === "object" && course.department.name
                ? course.department.name
                : departmentMap[course.department];

            return (
              <div key={course._id} className="card">
                <div className="card-content">
                  <h2 className="card-title">{course.name}</h2>
                  {deptName && (
                    <p className="card-subtitle">
                      <strong>Department:</strong> {deptName}
                    </p>
                  )}
                  <p className="card-description">{course.description}</p>
                  <p className="card-credits">
                    <strong>Credits:</strong> {course.credits}
                  </p>
                  <Link to={`/course/${course._id}`} className="card-button">
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Course;
