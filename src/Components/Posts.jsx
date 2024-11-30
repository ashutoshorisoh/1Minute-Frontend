import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Import the useUser hook

function Posts() {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');

  // Get the username from context
  const { contextUser } = useUser();

  // Handle file input change
  const handlePost = (e) => {
    const file = e.target.files[0];
    setPost(file);
  };

  // Handle the upload action
  const handleUpload = async () => {
    if (!post) {
      alert('Please select a post first');
      return;
    }

    if (!contextUser) {
      alert('You must be logged in to upload a post');
      return;
    }

    // Create FormData object and append fields
    const formData = new FormData();
    formData.append('videoFile', post);
    formData.append('title', title);
    formData.append('username', contextUser); // Use the username from context

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/post', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('File upload failed');
      } else {
        console.log('File uploaded successfully');
        setPost(null)
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <h1>Upload a Post</h1>
      <input type="file" onChange={handlePost} disabled={!contextUser} />
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button 
        onClick={handleUpload} 
        disabled={!contextUser} // Disable if no user is logged in
        className={`mt-4 ${!contextUser ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold py-2 px-6 rounded-lg w-full hover:bg-blue-600`}
      >
        Upload
      </button>
      {!contextUser && <p className="text-red-500 mt-2">You must be logged in to upload a post</p>}
    </div>
  );
}

export default Posts;
