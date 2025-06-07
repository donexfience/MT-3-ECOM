import React from "react";
import NOTImage from "../../assets/404.png";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-pink-100 to-orange-200 flex items-center justify-center p-5">
      <div className="text-center max-w-2xl w-full animate-fade-in-up">
        <div className="mb-8">
          <img
            src={NOTImage}
            alt="404 Error Illustration"
            className="w-72 h-auto mx-auto animate-float"
          />
        </div>

        <div className="text-8xl md:text-9xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Oops, your ice cream fell off cone!
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
          The page you're looking for
          <br />
          melted in the sun.
        </p>

        <a
          href="/home"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          Go to homepage
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </a>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
