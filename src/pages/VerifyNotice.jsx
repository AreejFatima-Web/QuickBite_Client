import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const VerifyNotice = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/resend-verification", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#d44480] mb-4">Verify Your Email</h2>
        <p className="text-gray-700 text-center mb-4">
          A verification link has been sent to <strong>{email}</strong>. Please check your inbox. This link will expire in 10 minutes.
        </p>
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full bg-[#ff66b2] hover:bg-[#d44480] text-white py-2 rounded transition-colors"
        >
          {loading ? "Resending..." : "Resend Verification Link"}
        </button>
      </div>
    </div>
  );
};

export default VerifyNotice;