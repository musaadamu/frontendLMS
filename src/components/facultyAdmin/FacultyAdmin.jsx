import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FacultyForm from "./FacultyForm";
import CourseForm from "./CourseForm"; // Ensure you have this component similarly to FacultyForm
import { AuthContext } from "../Auth/AuthContext"; // Adjust the path if needed
import "./FacultyAdmin.css"; // Dedicated CSS file for styling

const FacultyAdmin = () => {
  const { isAuthenticated, handleLogout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div>You must be logged in to manage faculties.</div>;
  }

  // States for faculties
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // States for courses
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  // State for departments (for linking courses)
  const [departments, setDepartments] = useState([]);

  // Set API URL based on NODE_ENV
  const apiUrl = process.env.NODE_ENV === 'production'

    ? 'https://backend-lms-render.onrender.com'
    : 'http://localhost:5000';

    console.log(apiUrl)

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
    fetchDepartments();
  }, []);

  // Fetch faculties from the API
  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/faculty`);
      if (!response.ok) throw new Error("Failed to fetch faculties");
      const data = await response.json();
      setFaculties(data.data.faculties);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await fetch(`${apiUrl}/api/course`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.data.courses);
      setCoursesError(null);
    } catch (err) {
      setCoursesError(err.message);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/department`);
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data.data.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // Delete a faculty by ID
  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/faculty/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete faculty");
      setFaculties(faculties.filter((faculty) => faculty._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete a course by ID
  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/course/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
  };

  const handleCourseEdit = (course) => {
    setEditingCourse(course);
  };

  if (loading) return <div className="loading">Loading faculties...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="faculty-admin">
      <header className="admin-header">
        <h2>Manage Faculties &amp; Courses</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Faculty Management Section */}
      <section className="faculty-list-section">
        <h3 className="section-title">All Faculties</h3>
        <div className="faculty-list">
          {faculties.map((faculty) => (
            <div key={faculty._id} className="faculty-card">
              <h4 className="faculty-name">{faculty.name}</h4>
              <div className="faculty-card-actions">
                <button onClick={() => handleEdit(faculty)}>Edit</button>
                <button onClick={() => deleteFaculty(faculty._id)}>Delete</button>
                <Link to={`/admin/department/${faculty._id}`} className="dept-link">
                  Manage Departments
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty Form Section */}
      <section className="faculty-form-section">
        <FacultyForm
          fetchFaculties={fetchFaculties}
          editingFaculty={editingFaculty}
          setEditingFaculty={setEditingFaculty}
        />
      </section>

      {/* Course Management Section */}
      <section className="courses-list-section">
        <h3 className="section-title">All Courses</h3>
        {coursesLoading ? (
          <div className="loading">Loading courses...</div>
        ) : coursesError ? (
          <div className="error">Error: {coursesError}</div>
        ) : (
          <div className="course-list">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h4 className="course-name">{course.name}</h4>
                <p className="course-details">Credits: {course.credits}</p>
                <p className="course-details">
                  Department:{" "}
                  {typeof course.department === "object"
                    ? course.department.name
                    : course.department}
                </p>
                <div className="course-card-actions">
                  <button onClick={() => handleCourseEdit(course)}>Edit</button>
                  <button onClick={() => deleteCourse(course._id)}>Delete</button>
                  <Link to={`/admin/course/${course._id}`} className="course-link">
                    Manage Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Course Form Section */}
      <section className="course-form-section">
        <CourseForm
          fetchCourses={fetchCourses}
          availableDepartments={departments}
          editingCourse={editingCourse}
          setEditingCourse={setEditingCourse}
        />
      </section>
    </div>
  );
};

export default FacultyAdmin;
