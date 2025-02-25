import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const DepartmentList = () => {
  // Expect facultyName from the URL. Ensure your route is defined as /department/:facultyName
  const { facultyName } = useParams();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/department`);
        if (!response.ok) throw new Error("Failed to fetch departments");

        const data = await response.json();
        // Filter departments based on the provided facultyName from the URL
        const facultyDepartments = data.data.departments.filter(
          (dept) =>
            dept.faculty.name.toLowerCase().replace(/\s+/g, "-") === facultyName
        );
        setDepartments(facultyDepartments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [facultyName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="department-list">
      <h2>Departments in {facultyName ? facultyName.charAt(0).toUpperCase() + facultyName.slice(1) : ""}</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept._id}>
            <Link to={`/faculty/${facultyName}/departments/${dept._id}`}>{dept.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
