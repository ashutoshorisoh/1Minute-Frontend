// src/pages/Profile.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { isAuthenticated } = useAuth();
  const { contextUser } = useUser();
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null; // Ensure nothing is rendered until the redirect happens
  }

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome, {contextUser}!</h1>
        <p className="text-gray-700">You are logged in.</p>
      </div>
    </div>
  );
}

export default Profile;
