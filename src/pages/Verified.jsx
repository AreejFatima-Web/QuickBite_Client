const Verified = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#d44480] mb-4">Email Verified!</h2>
        <p className="text-gray-700 mb-4">Your email has been successfully verified. You may now log in to your account.</p>
        <a href="/login" className="text-white bg-[#ff66b2] hover:bg-[#d44480] px-4 py-2 rounded inline-block">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Verified;