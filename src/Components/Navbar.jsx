import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

function Navbar() {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [modalOpen, setModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [videoLink, setVideoLink] = useState('');
    const [videoUploaded, setVideoUploaded] = useState(false);

    // State to handle mobile menu modal
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLoginRoute = () => {
        setIsMenuOpen(false);
        navigate('/login');
    };

    const handleCreatorRoute = () => {
        setIsMenuOpen(false);
        navigate('/userspage');
    };

    const handleRegisterRoute = () => {
        setIsMenuOpen(false);
        navigate('/register');
    };

    const handleHomeRoute = () => {
        setIsMenuOpen(false);
        navigate('/');
    };

    const handleLogOut = () => {
        setIsMenuOpen(false);
        logout();  // Call logout function to clear authentication state
        navigate('/login');  // Redirect to login page
    };

    const handleModal = () => {
        setModalOpen(true);
    };

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

        // Show "Submitting..." message and start uploading
        setUploading(true);
        setError(null);
        setVideoUploaded(false);

        // Create FormData object and append fields
        const formData = new FormData();
        formData.append('videoFile', post);
        formData.append('title', title);
        formData.append('username', contextUser); // Use the username from context

        try {
            const response = await fetch(`${backendUrl}/api/v1/post`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const data = await response.json();
            // Use the full URL to the video
            setVideoLink(data.message._id)  // Adjust this according to your API response
            setVideoUploaded(true);
            setPost(null);
        } catch (error) {
            console.log('Error:', error);
            setError('An error occurred while uploading the file');
        } finally {
            setUploading(false); // Stop the "Submitting..." text
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Reset the modal state
        setVideoUploaded(false);
        setError(null);
        setTitle('');
        setPost(null);
    };

    return (
        <div className="sticky top-0 z-50 w-full">
            {/* Navbar Container */}
            <div className="bg-black p-5 w-full relative">
                {/* Flex container to keep content within the black box */}
                <div className="flex justify-between items-end max-w-screen-xl mx-auto">
                    {/* Logo or Brand Name */}
                    <div className="text-white text-2xl ml-[-110px]">Brand</div>

                    {/* Desktop Menu Icons - Hidden on mobile, visible on large screens */}
                    <div className="hidden lg:flex gap-5 items-center mr-[-110px]">
                        <button 
                            onClick={handleHomeRoute} 
                            className="text-white py-3 px-5 rounded-md"
                        >
                            Home
                        </button>
                        <button 
                            onClick={handleCreatorRoute} 
                            className="text-white py-3 px-5 rounded-md"
                        >
                            Creators
                        </button>
                        <button 
                            onClick={handleModal} 
                            className="text-white py-3 px-5 rounded-md"
                        >
                            AddPost
                        </button>
                        {
                            !isAuthenticated ? (
                                <>
                                    <button 
                                        onClick={handleLoginRoute} 
                                        className="text-white py-3 px-5 rounded-md"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={handleRegisterRoute} 
                                        className="text-white py-3 px-5 rounded-md"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleLogOut} 
                                    className="text-white py-3 px-5 rounded-md"
                                >
                                    Logout
                                </button>
                            )
                        }
                    </div>

                    {/* Mobile Hamburger Icon */}
                    {!isMenuOpen && (
                        <button 
                            className="lg:hidden text-white z-60" // Set higher z-index here
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="space-y-2">
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-6 h-0.5 bg-white"></div>
                            </div>
                        </button>
                    )}

                    

                </div>
            </div>

            {/* Mobile Menu Overlay - Adjusted to the right */}
            {isMenuOpen && (
                <div className="fixed top-0 right-0 bottom-0 bg-black bg-opacity-90 z-50 flex justify-end items-center">
                    <div className="flex flex-col items-end  bg-black  text-white p-5 rounded-md w-full h-full">
                    <button 
        className="lg:hidden text-white z-60" // Ensure text-white is applied to button
        onClick={() => setIsMenuOpen(false)}
    >
        <div className="text-3xl text-white">&times;</div> {/* Only change the icon color to white */}
    </button>
                        <button 
                            onClick={handleHomeRoute} 
                            className="text-white py-3 px-5 my-2 rounded-md"
                        >
                            Home
                        </button>
                        
                        <button 
                            onClick={handleCreatorRoute} 
                            className="text-white py-3 px-5 my-2 rounded-md"
                        >
                            Creators
                        </button>
                        <button 
                            onClick={handleModal} 
                            className="text-white py-3 px-5 my-2 rounded-md"
                        >
                            AddPost
                        </button>
                        {
                            !isAuthenticated ? (
                                <>
                                    <button 
                                        onClick={handleLoginRoute} 
                                        className="text-white py-3 px-5 my-2 rounded-md"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={handleRegisterRoute} 
                                        className="text-white py-3 px-5 my-2 rounded-md"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleLogOut} 
                                    className="text-white py-3 px-5 my-2 rounded-md"
                                >
                                    Logout
                                </button>
                            )
                        }
                    </div>
                </div>
            )}

            {/* Modal for uploading post */}
            {modalOpen && (
                <div className="fixed z-50 inset-0 flex justify-center items-center bg-opacity-90 bg-black top-0 left-0 right-0 bottom-0">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button 
                            onClick={handleCloseModal} 
                            className="absolute top-4 right-4 text-xl font-bold text-gray-600"
                        >
                            &times;
                        </button>
                        <h1 className="text-xl font-semibold mb-4">Upload a Post</h1>

                        {/* Show "Submitting..." text while uploading */}
                        {/*uploading && <p>Uploading...</p>*/}

                        {/* Show error if any */}
                        {error && <p className="text-red-500">{error}</p>}

                        {/* Show link to video after successful upload */}
                        {videoUploaded && (
                            <div>
                                <p>Video uploaded successfully!</p>
                                <p 
                                    
                                    className="text-blue-500"
                                >
                                    Close This Box, Refresh Page and scroll to End to Find your Video
                                </p>
                            </div>
                        )}

                        {/* File input */}
                        <input 
                            type="file" 
                            onChange={handlePost} 
                            className="mb-4"
                        />
                        <input 
                            type="text" 
                            placeholder="Enter Title"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="mb-4 p-2 w-full border rounded-md"
                        />
                        <button 
                            onClick={handleUpload} 
                            className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        >
                            {uploading?'Uploading....': 'Upload'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
