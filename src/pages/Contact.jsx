import { useState, useEffect } from "react"; // Import useEffect here!
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = ({ isDarkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // Initialize status to null

  // Effect to manage the visibility of status messages
  useEffect(() => {
    if (status) { // Only run this effect if there's an actual message to display
      const timer = setTimeout(() => {
        setStatus(null); // Clear the status message after the timeout
      }, 5000); // Message will disappear after 5000 milliseconds (5 seconds)

      // Cleanup function: This will clear the timeout if the component unmounts
      // or if the 'status' state changes again before the 5 seconds are up.
      return () => clearTimeout(timer);
    }
  }, [status]); // The effect re-runs whenever the 'status' state changes

  // Handling form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing status message immediately when a new submission starts
    setStatus(null);

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Always try to parse JSON response

      // Check `response.ok` (HTTP status 200-299) for successful server response
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form fields on success
      } else {
        // If server responded with an error status (e.g., 400, 500)
        setStatus("Error: " + (data.message || "Failed to send message."));
      }
    } catch (error) {
      // This catch block handles network errors (e.g., backend server not running)
      console.error("Error submitting contact form:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="mt-0"></div>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2
          className={`text-4xl font-bold text-center mb-8 ${
            isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
          } animate-fade-in`}
        >
          Contact Us
        </h2>
        <p
          className={`text-center mb-12 text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Have a question or feedback? We'd love to hear from you! Fill out the
          form below, and we'll get back to you as soon as possible.
        </p>

        <form
          className={`bg-gradient-to-r ${
            isDarkMode
              ? "from-gray-800 to-gray-700"
              : "from-[#F6B1CE] to-[#f49ac1]"
          } p-8 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-102`}
          onSubmit={handleSubmit}
        >
          {/* Status message display */}
          {status && (
            <div className={`mb-6 p-3 rounded-lg text-center ${
              // Dynamically apply green or red background based on message content
              status.startsWith("Message sent successfully!") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {status}
            </div>
          )}

          <div className="mb-6">
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
                  : "bg-white text-gray-900 focus:ring-[#d44480]"
              }`}
            />
          </div>

          <div className="mb-6">
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
                  : "bg-white text-gray-900 focus:ring-[#d44480]"
              }`}
            />
          </div>

          <div className="mb-6">
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
                  : "bg-white text-gray-900 focus:ring-[#d44480]"
              }`}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold transition duration-300 ${
              isDarkMode
                ? "bg-black text-white hover:bg-[#e55a9f]"
                : "bg-[#d44480] hover:bg-[#b83a6f]"
            } text-white`}
          >
            Send Message
          </button>
        </form>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Contact;