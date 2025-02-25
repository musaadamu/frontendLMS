// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import CourseForm from "./CourseForm";

// const CourseAdmin = () => {
//   const { facultyName, departmentId } = useParams();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingCourse, setEditingCourse] = useState(null);

//   useEffect(() => {
//     fetchCourses();
//   }, [departmentId]);

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses?department=${departmentId}`);
//       if (!response.ok) throw new Error("Failed to fetch courses");
//       const data = await response.json();
//       setCourses(data.data.courses);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCourse = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete course");
//       setCourses(courses.filter((course) => course._id !== id));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="course-admin">
//       <h2>Manage Courses in {facultyName.charAt(0).toUpperCase() + facultyName.slice(1)} - Department {departmentId}</h2>
      
//       <CourseForm
//         fetchCourses={fetchCourses}
//         departmentId={departmentId}
//         editingCourse={editingCourse}
//         setEditingCourse={setEditingCourse}
//       />

//       <ul>
//         {courses.map((course) => (
//           <li key={course._id}>
//             {course.name} ({course.credits} credits)
//             <button onClick={() => handleEdit(course)}>Edit</button>
//             <button onClick={() => deleteCourse(course._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CourseAdmin;

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CourseForm from "./CourseForm";
import { AuthContext } from "../Auth/AuthContext"; // Adjust the path as needed

const CourseAdmin = () => {
  // Use the authentication context
  const { isAuthenticated, handleLogout } = useContext(AuthContext);

  // If not authenticated, inform the user
  if (!isAuthenticated) {
    return <div>You must be logged in to manage courses.</div>;
  }

  const { facultyName, departmentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [departmentId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses?department=${departmentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="course-admin">
      <h2>
        Manage Courses in{" "}
        {facultyName.charAt(0).toUpperCase() + facultyName.slice(1)} - Department{" "}
        {departmentId}
      </h2>
      {/* Optionally, you could also include a logout button here */}
      <CourseForm
        fetchCourses={fetchCourses}
        departmentId={departmentId}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
      />

      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.name} ({course.credits} credits)
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => deleteCourse(course._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseAdmin;
