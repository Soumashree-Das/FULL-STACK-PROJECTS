// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import "../CSS/Navbar.css";

// function Navbar() {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');
    //     navigate('/login');
    // };

//     return (
//         <nav className="bg-white shadow-md px-py-4 px-12 flex items-center justify-between">
//             <div className="px-10 text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
//                 MoodJournal
               
//             </div>

//             <div className="flex gap-4 items-center">
//                  <Link to = "/">Home</Link>
//                  {user ? (
//                     <>
//                         <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
//                         <Link to="/journal" className="text-gray-700 hover:text-blue-600 font-medium">New Journal</Link>
//                         <Link to="/account" className="text-gray-700 hover:text-blue-600 font-medium">Account</Link>
//                         <button 
//                             onClick={handleLogout} 
//                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
//                         >
//                             Logout
//                         </button>
//                     </>
//                 ) : (
//                     <Link 
//                         to="/register" 
//                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//                     >
//                         Sign In / Sign Up
//                     </Link>
//                 )}
//             </div>
//         </nav>
//     );
// }

// export default Navbar;


// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../Context/AuthContext.jsx';
// // import "../CSS/Navbar.css";

// // function Navbar() {
// //     const [isOpen, setIsOpen] = useState(false);
// //     const [isMobile, setIsMobile] = useState(false);
// //     const user = JSON.parse(localStorage.getItem('user'));
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const handleResize = () => {
// //             setIsMobile(window.innerWidth < 768);
// //         };
// //         handleResize();
// //         window.addEventListener('resize', handleResize);
// //         return () => window.removeEventListener('resize', handleResize);
// //     }, []);

// //     const handleLogout = async () => {
// //         try {
// //             await logout(); // Use the logout function from AuthContext
// //             // Optional: You can also call your API logout endpoint here if needed
// //             const response = await fetch('http://localhost:8080/user/logout', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
// //                 },
// //             });
// //             if (!response.ok) {
// //                 console.error('API logout failed:', response.status);
// //             }
// //         } catch (error) {
// //             console.error('Error during logout:', error);
// //         }
// //     };


// //     // const handleLogout = async () => {
// //     //     try {
// //     //         const token = localStorage.getItem('token');
    
// //     //         const response = await fetch('http://localhost:8080/user/logout', {
// //     //             method: 'POST',
// //     //             headers: {
// //     //                 'Content-Type': 'application/json',
// //     //                 Authorization: `Bearer ${token}`, // assuming your API uses Bearer token for auth
// //     //             },
// //     //         });
    
// //     //         if (response.ok) {
// //     //             // logout successful
// //     //             localStorage.removeItem('user');
// //     //             localStorage.removeItem('token');
// //     //             navigate('/login');
// //     //         } else {
// //     //             console.error('Logout failed:', response.status);
// //     //             // optionally: show a message to user
// //     //         }
// //     //     } catch (error) {
// //     //         console.error('Error during logout:', error);
// //     //     }
// //     // };
    

// //     const toggleMenu = () => {
// //         setIsOpen(!isOpen);
// //     };

// //     return (
// //         <nav className="bg-white shadow-md py-4 px-6">
// //             <div className="flex items-center justify-between">
// //                 <div 
// //                     className="text-2xl font-bold text-blue-600 cursor-pointer" 
// //                     onClick={() => navigate('/')}
// //                 >
// //                     MoodJournal
// //                 </div>

// //                 {/* Hamburger menu for mobile */}
// //                 {isMobile && (
// //                     <button 
// //                         onClick={toggleMenu}
// //                         className="text-gray-700 focus:outline-none"
// //                         aria-label="Toggle menu"
// //                     >
// //                         <svg 
// //                             className="w-6 h-6" 
// //                             fill="none" 
// //                             stroke="currentColor" 
// //                             viewBox="0 0 24 24" 
// //                             xmlns="http://www.w3.org/2000/svg"
// //                         >
// //                             {isOpen ? (
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                             ) : (
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //                             )}
// //                         </svg>
// //                     </button>
// //                 )}

// //                 {/* Desktop menu */}
// //                 {!isMobile && (
// //                     <div className="flex gap-4 items-center">
// //                         <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
// //                         {user ? (
// //                             <>
// //                                 <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
// //                                 <Link to="/journal" className="text-gray-700 hover:text-blue-600 font-medium">New Journal</Link>
// //                                 <Link to="/account" className="text-gray-700 hover:text-blue-600 font-medium">Account</Link>
// //                                 <button 
// //                                     onClick={handleLogout} 
// //                                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
// //                                 >
// //                                     Logout
// //                                 </button>
// //                             </>
// //                         ) : (
// //                             <Link 
// //                                 to="/register" 
// //                                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
// //                             >
// //                                 Sign In / Sign Up
// //                             </Link>
// //                         )}
// //                     </div>
// //                 )}
// //             </div>

// //             {/* Mobile menu */}
// //             {isMobile && isOpen && (
// //                 <div className="mt-4 space-y-2">
// //                     <Link 
// //                         to="/" 
// //                         className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
// //                         onClick={() => setIsOpen(false)}
// //                     >
// //                         Home
// //                     </Link>
// //                     {user ? (
// //                         <>
// //                             <Link 
// //                                 to="/dashboard" 
// //                                 className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
// //                                 onClick={() => setIsOpen(false)}
// //                             >
// //                                 Dashboard
// //                             </Link>
// //                             <Link 
// //                                 to="/journal" 
// //                                 className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
// //                                 onClick={() => setIsOpen(false)}
// //                             >
// //                                 New Journal
// //                             </Link>
// //                             <Link 
// //                                 to="/account" 
// //                                 className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
// //                                 onClick={() => setIsOpen(false)}
// //                             >
// //                                 Account
// //                             </Link>
// //                             <button 
// //                                 onClick={() => {
// //                                     handleLogout();
// //                                     setIsOpen(false);
// //                                 }}
// //                                 className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
// //                             >
// //                                 Logout
// //                             </button>
// //                         </>
// //                     ) : (
// //                         <Link 
// //                             to="/register" 
// //                             className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
// //                             onClick={() => setIsOpen(false)}
// //                         >
// //                             Sign In / Sign Up
// //                         </Link>
// //                     )}
// //                 </div>
// //             )}
// //         </nav>
// //     );
// // }

// // export default Navbar;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         const response = await fetch('http://localhost:8080/user/logout', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         });
    //         if (!response.ok) {
    //             console.error('API logout failed:', response.status);
    //         }
    //     } catch (error) {
    //         console.error('Error during logout:', error);
    //     }
    // };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-[#f0f6f6] shadow-sm border-b border-[#f7d6e0] font-borel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div 
                        className="flex-shrink-0 text-2xl text-[#42bfdd] cursor-pointer hover:text-[#084b83] transition-colors"
                        onClick={() => navigate('/')}
                    >
                        MoodJournal
                    </div>

                    {/* Mobile menu button */}
                    {isMobile && (
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#42bfdd] hover:text-[#084b83] hover:bg-[#f7d6e0] focus:outline-none transition-colors"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Desktop menu */}
                    {!isMobile && (
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-4">
                                <Link 
                                    to="/" 
                                    className="text-[#42bfdd] hover:text-[#084b83] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Home
                                </Link>
                                {user ? (
                                    <>
                                        
                                        <Link 
                                            to="/journal" 
                                            className="text-[#42bfdd] hover:text-[#084b83] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            New Journal
                                        </Link>
                                        <Link 
                                            to="/account" 
                                            className="text-[#42bfdd] hover:text-[#084b83] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Account
                                        </Link>
                                        <button 
                                            onClick={handleLogout} 
                                            className="bg-[#f0f6f6] hover:bg-[#bbe6e4] text-[#ff66b3] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link 
                                        to="/register" 
                                        className="bg-[#f0f6f6] hover:bg-[#bbe6e4] text-[#ff66b3] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Sign In / Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMobile && isOpen && (
                <div className="md:hidden bg-[#f0f6f6] border-t border-[#bbe6e4]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link 
                            to="/" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-[#42bfdd] hover:text-[#084b83] hover:bg-[#bbe6e4] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link 
                                    to="/journal" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-[#42bfdd] hover:text-[#084b83] hover:bg-[#bbe6e4] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    New Journal
                                </Link>
                                <Link 
                                    to="/account" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-[#42bfdd] hover:text-[#084b83] hover:bg-[#bbe6e4] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Account
                                </Link>
                                <button 
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#42bfdd] hover:text-[#084b83] hover:bg-[#bbe6e4] transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/register" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#084b83] hover:bg-[#9a826c] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;