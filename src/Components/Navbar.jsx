import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();

    // State to handle mobile menu modal
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLoginRoute = () => {
        navigate('/login');
    };

    const handleCreatorRoute = () => {
        navigate('/userspage');
    };

    const handleRegisterRoute = () => {
        navigate('/register');
    };

    const handleHomeRoute = () => {
        navigate('/');
    };

    const handleLogOut = () => {
        logout();  // Call logout function to clear authentication state
        navigate('/login');  // Redirect to login page
    };

    return (
        <div className="sticky top-0 z-10 w-full">
            {/* Navbar Container */}
            <div className="bg-black p-5 w-full relative">
                {/* Flex container to keep content within the black box */}
                <div className="flex justify-between items-end max-w-screen-xl mx-auto">
                    {/* Logo or Brand Name */}
                    <div className="text-white text-2xl ml-[-110px]">Brand</div>

                    {/* Desktop Menu Icons - Hidden on mobile, visible on large screens */}
                    <div className="hidden lg:flex gap-5 items-center  mr-[-110px]">
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
                            className="lg:hidden text-white z-30"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <div className="space-y-2">
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-6 h-0.5 bg-white"></div>
                            </div>
                        </button>
                    )}

                    {/* Mobile Cross Icon - Only visible when menu is open */}
                    {isMenuOpen && (
                        <button 
                            className="lg:hidden text-white z-30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="text-3xl">&times;</div> {/* Only one cross icon */}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu - Side Modal */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setIsMenuOpen(false)}  // Close menu when overlay is clicked
                >
                    <div
                        className="bg-black text-white h-full w-3/4 max-w-[200px] p-5 fixed top-0 right-0 z-30"
                        onClick={(e) => e.stopPropagation()}  // Prevent click event from propagating to overlay
                    >
                        <div className="flex flex-col gap-5 mt-10">
                            <button 
                                onClick={handleHomeRoute} 
                                className="text-center text-white py-3 rounded-md"
                            >
                                Home
                            </button>
                            <button 
                                onClick={handleCreatorRoute} 
                                className="text-center text-white py-3 rounded-md"
                            >
                                Creators
                            </button>

                            {
                                !isAuthenticated ? (
                                    <>
                                        <button 
                                            onClick={handleLoginRoute} 
                                            className="text-center text-white py-3 rounded-md"
                                        >
                                            Login
                                        </button>
                                        <button 
                                            onClick={handleRegisterRoute} 
                                            className="text-center text-white py-3 rounded-md"
                                        >
                                            Register
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleLogOut} 
                                        className="text-center text-white py-3 rounded-md"
                                    >
                                        Logout
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
