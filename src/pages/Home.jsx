import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Fallback data in case dynamic fetch fails
const fallbackFaculties = [
  {
    _id: "1",
    name: "Faculty of Science",
    departments: [
      { name: "Computer Science", slug: "computer-science" },
      { name: "Integrated Science", slug: "integrated-science" },
      { name: "Mathematics", slug: "mathematics" },
    ],
  },
  {
    _id: "2",
    name: "Faculty of Arts",
    departments: [
      { name: "English", slug: "english" },
      { name: "Hausa", slug: "hausa" },
      { name: "Social Studies", slug: "social-studies" },
    ],
  },
  {
    _id: "3",
    name: "Faculty of Education",
    departments: [
      { name: "Postgraduate Diploma in Education", slug: "postgraduate-diploma-in-education" },
      { name: "Professional Diploma in Education", slug: "professional-diploma-in-education" },
      { name: "Masters in Education", slug: "masters-in-education" },
    ],
  },
];

const Home = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty`);
        if (!response.ok) throw new Error('Failed to fetch faculties');
        const data = await response.json();
        setFaculties(data.data.faculties);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (loading) return <div className="loading">Loading faculties...</div>;

  // Render fallback layout with hard-coded data if there's an error
  if (error) {
    return (
      <div className="home-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to the College of Education Learning Management System</h1>
            <p>
              We were unable to fetch the latest faculty data. Please try again later.
              Meanwhile, explore our default faculties:
            </p>
          </div>
        </section>

        <section className="faculties-section">
          <div className="faculties-container">
            {fallbackFaculties.map((faculty) => (
              <div className="faculty-card" key={faculty._id}>
                <h2>{faculty.name}</h2>
                <ul>
                  {faculty.departments.map((dept) => (
                    <li key={dept.slug}>
                      <Link to={`/faculty/${faculty.name.toLowerCase().replace(/\s+/g, "-")}/${dept.slug}`}>
                        {dept.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="auth-section">
          <div className="auth-links">
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </div>
        </section>
      </div>
    );
  }

  // Render dynamic data if fetch is successful
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to the College of Education Learning Management System</h1>
          <p>Select a faculty to explore departments and courses:</p>
        </div>
      </section>

      <section className="faculties-section">
        <div className="faculties-container">
          {faculties.map((faculty) => (
            <div className="faculty-card" key={faculty._id}>
              <h2>{faculty.name}</h2>
              <Link to={`/faculty/${faculty._id}`} className="explore-button">
                Explore {faculty.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-links">
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
