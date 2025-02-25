// This allows TypeScript to import .jsx files without type errors
declare module '*.jsx' {
    import React from 'react'
    const Component: React.ComponentType<any>
    export default Component
  }
  
  // For specific component import errors
  declare module './components/Auth/AuthContext'
  declare module './components/Auth/LogIn'
  declare module './components/Auth/Register'
  declare module './pages/Home'
  declare module './components/Faculty/FacultyList'
  declare module './components/Course/CourseList'
  declare module './pages/Course'
  declare module './components/CourseAdmin/CourseAdmin'
  declare module './components/facultyAdmin/FacultyAdmin'
  declare module './components/DepartmentAdmin/DepartmentAdmin'
  declare module './components/Department/DepartmentList'
  declare module './pages/Faculty'
  declare module './pages/Department'
  declare module './components/navBar/NavBar'