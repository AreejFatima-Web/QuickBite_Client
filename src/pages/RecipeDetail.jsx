// client/pages/RecipeDetail.jsx (Example for React Router)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For React Router
import axios from 'axios';

const RecipeDetail = () => {
    const { slug } = useParams(); // Gets the 'spaghetti-carbonara' part from the URL
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (!slug) return; // Don't fetch if no slug

            try {
                setLoading(true);
                setError(null);
                // This is a placeholder API call. You'll need a backend endpoint
                // like GET /api/recipes/:slug that returns full recipe details.
                const response = await axios.get(`http://localhost:5000/api/recipes/${slug}`);
                setRecipe(response.data);
            } catch (err) {
                console.error("Error fetching recipe details:", err);
                setError("Failed to load recipe details.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeDetails();
    }, [slug]); // Re-fetch if the slug changes

    if (loading) return <p className="text-center">Loading recipe details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!recipe) return <p className="text-center">Recipe not found.</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-[#F6B1CE] mb-4">{recipe.title}</h1>
            <img src={recipe.image} alt={recipe.title} className="w-full h-96 object-cover rounded-lg mb-6" />
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">{recipe.description || 'No description available.'}</p>
            {/* Add more recipe details here (ingredients, instructions, etc.) */}
            {/* These details need to be part of the data returned by your backend */}
            <p>Calories: {recipe.calories}</p>
            <p>Time: {recipe.time} minutes</p>
            {/* You might display full instructions if your ML service sends them,
                or if you fetch them from a separate source.
                For dummy recipes, you might not have full instructions.
            */}
        </div>
    );
};

export default RecipeDetail;