import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TodoList from "./components/TodoApp/TodoList";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import UserProfile from "./components/Profile/UserProfile";
import { AuthProvider } from "./AuthContext"; // Make sure this import is correct
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      
      {/* Wrap your Router in AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/todos" element={<TodoList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
