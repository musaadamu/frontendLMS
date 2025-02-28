import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import "./NavBar.css";

const NavBar = () => {
    const { isAuthenticated, handleLogout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-header">
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
                    {isMenuOpen ? "✕" : "☰"}
                </button>
                <h1 className="navbar-title">E-Learn</h1>
            </div>
            <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faculty">Faculties</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/department">Departments</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/course">Courses</Link></li>
                {isAuthenticated && (
                    <li className="nav-item"><Link className="nav-link" to="/admin/faculty">Admin Dashboard</Link></li>
                )}
                {!isAuthenticated ? (
                    <>
                        <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                    </>
                ) : (
                    <li className="nav-item">
                        <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;