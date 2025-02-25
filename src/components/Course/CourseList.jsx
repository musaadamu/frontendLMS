import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Course = () => {
  const { facultyName, departmentId, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course");

        const data = await response.json();
        setCourse(data.data.course);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-page">
      <h1>{course.name}</h1>
      <h3>
        Faculty: {facultyName.charAt(0).toUpperCase() + facultyName.slice(1)} - 
        Department ID: {departmentId}
      </h3>

      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Prerequisites:</strong> {course.prerequisites.map(p => p.name).join(', ') || 'None'}</p>
      <p><strong>Credits:</strong> {course.credits}</p>

      <div className="navigation-links">
        <Link to={`/faculty/${facultyName}/departments/${departmentId}/courses`}>Back to Courses</Link>
        <br />
        <Link to={`/faculty/${facultyName}/departments/${departmentId}`}>Back to Department</Link>
        <br />
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Course;
