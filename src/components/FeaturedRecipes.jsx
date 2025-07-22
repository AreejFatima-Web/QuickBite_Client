// client/components/FeaturedRecipes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define your dummy recipes for fallback/unregistered users
const DUMMY_RECIPES = [
    { id: "d1", title: "Spaghetti Carbonara (Dummy)", image: "/assets/images/carbonara.jpg", link: "/recipes/spaghetti-carbonara", calories: 500, time: 30, recipeId: "dummy1" },
    { id: "d2", title: "Avocado Toast (Dummy)", image: "/assets/images/avocado-toast.jfif", link: "/recipes/avocado-toast", calories: 250, time: 10, recipeId: "dummy2" },
    { id: "d3", title: "Berry Smoothie (Dummy)", image: "/assets/images/berry-smoothie.jfif", link: "/recipes/berry-smoothie", calories: 180, time: 5, recipeId: "dummy3" },
];

// This component now takes 'isDarkMode' and 'isAuthenticated' status (optional, but good for clarity)
// The actual 'userId' and 'authToken' will be managed internally by fetching from localStorage.
const FeaturedRecipes = ({ isDarkMode }) => {
    const [featuredRecipes, setFeaturedRecipes] = useState(DUMMY_RECIPES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedRecipes = async () => {
            setLoading(true); // Start loading whenever the effect runs
            setError(null); // Clear any previous errors

            // --- IMPORTANT CHANGE HERE: Get the token directly from localStorage ---
            const authToken = localStorage.getItem('authToken');
            // We'll use this token to determine if the user is "logged in" for personalized recipes.

            // If no authentication token is found, display dummy recipes immediately
            // This means the user is not logged in or their session has expired.
            if (!authToken) {
                console.log("No authentication token found. Displaying general dummy recipes.");
                setFeaturedRecipes(DUMMY_RECIPES);
                setLoading(false);
                return; // Stop execution here
            }

            try {
                console.log("Authentication token found. Attempting to fetch personalized recipes...");
                // Call your Node.js backend API
                // Your backend's /api/recipes/featured endpoint expects the JWT token
                // in the Authorization header for authentication.
                const response = await axios.get('http://localhost:5000/api/recipes/featured', {
                    headers: {
                        Authorization: `Bearer ${authToken}` // Pass the actual user's JWT token
                    }
                });

                // Assuming the backend returns an array of recipe objects
                if (response.data && response.data.length > 0) {
                    setFeaturedRecipes(response.data);
                } else {
                    // If ML service returns an empty array, fall back to dummy
                    console.log("ML service returned no recommendations. Falling back to dummy recipes.");
                    setFeaturedRecipes(DUMMY_RECIPES);
                }

            } catch (err) {
                console.error("Error fetching recommended recipes:", err.response ? err.response.data : err.message);
                
                // Provide a user-friendly error message based on the status code if possible
                let errorMessage = "Failed to load personalized recipes. Displaying general recommendations.";
                if (err.response && err.response.status === 401) {
                    errorMessage = "Session expired or not authorized. Please log in again.";
                    // You might want to trigger a logout here or redirect to login
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                }
                
                setError(errorMessage);
                // Always fallback to dummy recipes on API error
                setFeaturedRecipes(DUMMY_RECIPES);
            } finally {
                setLoading(false);
            }
        };

        // Re-run effect whenever the authToken might conceptually change (e.g., after login/logout).
        // We'll implicitly re-run if localStorage changes, but this useEffect's dependency
        // should reflect when the data fetch should trigger. A simple approach is
        // to have a parent component pass a 'loggedIn' status, or rely on a global context.
        // For now, it will effectively run once on mount and rely on the initial authToken.
        // For dynamic updates on login/logout without page refresh, you'd integrate with an AuthContext.
        fetchRecommendedRecipes();
    }, []); // Empty dependency array means this runs once on component mount.
            // If you want it to react to login/logout without full page refresh,
            // you'd need to pass a prop like 'isLoggedIn' from an AuthContext.

    return (
        <section
            id="recipes"
            className={`${
                isDarkMode ? "bg-black" : "bg-white"
            } py-16 px-6 transition-colors duration-300`}
        >
            <h3 className="text-3xl font-semibold text-center text-[#F6B1CE] mb-8">
                Featured Recipes
            </h3>
            
            {/* Show loading message while fetching, but only if we are actually trying to fetch (i.e., a token exists initially) */}
            {loading && localStorage.getItem('authToken') && <p className="text-center text-gray-600">Loading your personalized recipes...</p>}
            
            {/* Show general loading message if no token initially, or if loading fallback data */}
            {loading && !localStorage.getItem('authToken') && <p className="text-center text-gray-600">Loading general recipes...</p>}

            {error && <p className="text-center text-red-500">{error}</p>}
            
            {/* Display recipes only when not loading */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {featuredRecipes.map((recipe) => (
                        <div
                            key={recipe.id || recipe.recipeId} // Use recipe.id or recipe.recipeId for unique key
                            className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="h-48 w-full object-cover rounded-md mb-4"
                            />
                            <h4 className="text-xl font-semibold text-[#F6B1CE] mb-2">
                                {recipe.title}
                            </h4>
                            {/* Make sure 'link' is consistent with 'sourceUrl' from your backend if applicable */}
                            <a
                                href={recipe.link || recipe.sourceUrl} 
                                className="text-[#d44480] font-bold hover:text-[#B83A6F] transition duration-300"
                            >
                                View Recipe →
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedRecipes; // Export the component