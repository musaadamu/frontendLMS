// // // import React, { useState, useEffect } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import './NavBar.css'; // Import the CSS file

// // // const NavBar = () => {
// // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //     const navigate = useNavigate();

// // //     // Check authentication state on mount
// // //     useEffect(() => {
// // //         const token = localStorage.getItem('token');
// // //         setIsAuthenticated(!!token);
// // //     }, []);

// // //     const handleLogout = () => {
// // //         localStorage.removeItem('token'); // Remove token from storage
// // //         setIsAuthenticated(false);
// // //         navigate('/login'); // Redirect to login page
// // //     };

// // //     return (
// // //         <nav className="navbar">
// // //             <ul className="nav-list">
// // //                 <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
// // //                 <li className="nav-item"><Link className="nav-link" to="/faculty">Faculties</Link></li>
// // //                 <li className="nav-item"><Link className="nav-link" to="/department">Departments</Link></li>
// // //                 <li className="nav-item"><Link className="nav-link" to="/admin/faculty">Faculty Admin</Link></li>
// // //                 <li className="nav-item"><Link className="nav-link" to="/admin/department">Department Admin</Link></li>

// // //                 {!isAuthenticated ? (
// // //                     <>
// // //                         <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
// // //                         <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
// // //                     </>
// // //                 ) : (
// // //                     <li className="nav-item">
// // //                         <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
// // //                     </li>
// // //                 )}
// // //             </ul>
// // //         </nav>
// // //     );
// // // };

// // // export default NavBar;

// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../Auth/AuthContext';
// import './NavBar.css';

// const NavBar = () => {
//     const { isAuthenticated, handleLogout } = useContext(AuthContext);

//     return (
//         <nav className="navbar">
//             <ul className="nav-list">
//                 <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/faculty">Faculties</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/department">Departments</Link></li>
//                 {isAuthenticated && (
//                     <>
//                         <li className="nav-item"><Link className="nav-link" to="/admin/faculty">Faculty Admin</Link></li>
//                         <li className="nav-item"><Link className="nav-link" to="/admin/department">Department Admin</Link></li>
//                     </>
//                 )}

//                 {!isAuthenticated ? (
//                     <>
//                         <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
//                         <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
//                     </>
//                 ) : (
//                     <li className="nav-item">
//                         <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
//                     </li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default NavBar;


import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import "./NavBar.css";

const NavBar = () => {
    const { isAuthenticated, handleLogout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faculty">Faculties</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/department">Departments</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/course">Courses</Link></li>


                {isAuthenticated && (
                    <>
                        <li className="nav-item"><Link className="nav-link" to="/admin/faculty">Admin Dashboard</Link></li>
                        
                    </>
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
