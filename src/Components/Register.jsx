import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setcontextUser } = useUser();
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the avatar is uploaded
    if (!avatar) {
      setErrorMessage('Avatar is required.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar); // Add avatar file

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered successfully:', data);
        setcontextUser(data.data.username);
        login();
        navigate('/');
        // Redirect or show success message
      } else {
        setErrorMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while registering.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-red-200 h-screen w-full flex justify-center items-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md flex flex-col gap-6">
    <h1 className="text-3xl font-semibold text-gray-700 text-center">Register</h1>

    {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}

    <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-full space-y-6">
      {/* Username */}
      <div className="flex flex-col">
        <label htmlFor="username" className="text-lg font-medium text-gray-600">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Fullname */}
      <div className="flex flex-col">
        <label htmlFor="fullname" className="text-lg font-medium text-gray-600">Full Name</label>
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-lg font-medium text-gray-600">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label htmlFor="password" className="text-lg font-medium text-gray-600">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-col">
        <label htmlFor="avatar" className="text-lg font-medium text-gray-600">Avatar (Profile Picture)</label>
        <input
          type="file"
          id="avatar"
          onChange={handleAvatarChange}
          required
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </div>
    </form>
  </div>
</div>

  
  );
};

export default RegisterForm;
