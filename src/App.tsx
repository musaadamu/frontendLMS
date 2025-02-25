import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/Auth/AuthContext'; // Ensure the path is correct
import Login from './components/Auth/LogIn';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import FacultyList from './components/Faculty/FacultyList';
import CourseList from './components/Course/CourseList';
import Course from './pages/Course';
import CourseAdmin from './components/CourseAdmin/CourseAdmin';
import FacultyAdmin from "./components/facultyAdmin/FacultyAdmin";
import DepartmentAdmin from "./components/DepartmentAdmin/DepartmentAdmin";
import DepartmentList from "./components/Department/DepartmentList";
import Faculty from './pages/Faculty';
import Department from './pages/Department';
import NavBar from './components/navBar/NavBar';

// Add proper TypeScript typing to the ProtectedRoute component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  // Type the context properly to avoid TypeScript errors
  const { isAuthenticated } = useContext(AuthContext as React.Context<{ isAuthenticated: boolean }>);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider> {/* Wraps entire app to provide authentication state */}
      <Router>
        <div className="app">
          <header>
            <NavBar />
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/faculty" element={<FacultyList />} />
              <Route path="/department" element={<Department />} />
              <Route path="/course" element={<Course />} />

              <Route path="/faculty/:departmentId" element={<DepartmentList />} />
              <Route path="/faculty/:facultyId" element={<Faculty />} />
              <Route path="/course/:courseId" element={<CourseList />} />

              <Route path="/admin/faculty" element={<ProtectedRoute element={<FacultyAdmin />} />} />
              {/* Use facultyId as the parameter for DepartmentAdmin */}
              <Route path="/admin/department/:facultyId" element={<ProtectedRoute element={<DepartmentAdmin />} />} />
              <Route path="/admin/course" element={<ProtectedRoute element={<CourseAdmin />} />} />
            </Routes>
          </main>

          <footer>
            <p>&copy; 2023 College of Education LMS</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;