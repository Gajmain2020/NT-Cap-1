import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center bg-cover justify-center h-screen bg-gray-100 gap-5 text-gray-800">
      <div className="w-72 rounded-md overflow-hidden shadow-md">
        <img
          src="https://media.istockphoto.com/id/2152931121/vector/error-code-403-forbidden-visitors-do-not-have-permission-to-access-directory-files-on-the.jpg?s=612x612&w=0&k=20&c=93HvGd8TASmPy8upjoluFdfSXfcoQ0GhBAEEHi71ZRE="
          alt="Page not found"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-xl mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go back to Homepage
      </Link>
    </div>
  );
};

export default NotAuthorized;
