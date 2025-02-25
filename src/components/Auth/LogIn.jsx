// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import './Login.css'; // Ensure this file exists

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // For navigation after login

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//       });

//       console.log('Login successful:', response.data);
//       localStorage.setItem('token', response.data.token); // Save token
//       navigate('/'); // Redirect to home or dashboard page
//     } catch (err) {
//       if (err.response && err.response.data) {
//         setError(err.response.data.message || 'An error occurred while logging in.');
//       } else {
//         setError('An error occurred. Please try again later.');
//       }
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input 
//             type="email" 
//             id="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input 
//             type="password" 
//             id="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//       <p>Don't have an account? <Link to="/register">Register here</Link></p>
//     </div>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import './Login.css';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Check authentication status on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       navigate('/'); // Redirect if already logged in
//     }
//   }, [navigate]);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/auth/login', 
//         { email, password }
//       );

//       console.log('Login successful:', response.data);
//       localStorage.setItem('token', response.data.token);
//       setIsAuthenticated(true);
//       navigate('/'); // Redirect to home/dashboard
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       if (token) {
//         await axios.post(
//           'http://localhost:5000/api/auth/logout', 
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       localStorage.removeItem('token'); // Remove token
//       setIsAuthenticated(false);
//       navigate('/login'); // Redirect to login page
//     } catch (err) {
//       console.error('Logout failed:', err);
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>{isAuthenticated ? 'Welcome Back' : 'Login'}</h2>
//       {error && <p className="error-message">{error}</p>}
      
//       {!isAuthenticated ? (
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input 
//               type="email" 
//               id="email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               required 
//               disabled={loading}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input 
//               type="password" 
//               id="password" 
//               value={password} 
//               onChange={(e) => setPassword(e.target.value)} 
//               required 
//               disabled={loading}
//             />
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       ) : (
//         <button onClick={handleLogout} className="logout-button">
//           Logout
//         </button>
//       )}

//       {!isAuthenticated && (
//         <p>Don't have an account? <Link to="/register">Register here</Link></p>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const Login = () => {
    const { handleLogin } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            if (response.data.token) {
                handleLogin(response.data.token); // Update global authentication state
                navigate('/'); // Redirect to home after login
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
