import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailHandler = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus("verified");
        setTimeout(() => navigate("/verified"), 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded shadow max-w-md w-full">
        {status === "verifying" && <p className="text-[#d44480] font-semibold">Verifying your email...</p>}
        {status === "verified" && <p className="text-green-600 font-semibold">Email verified! Redirecting...</p>}
       {status === "error" && <p className="text-red-600 font-semibold">Invalid or expired verification link.</p>}
      </div>
    </div>
  );
};

export default VerifyEmailHandler;