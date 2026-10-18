import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col items-center justify-center">
      {/* Exact COMPUTE 50 Branding (Matching User Reference Image) */}
      <div className="text-center mb-3 sm:mb-4 select-none">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] inline-flex items-baseline justify-center leading-none">
          <span>COMPUTE</span>
          <span className="text-[var(--accent)] ml-3 sm:ml-4 font-black">50</span>
        </h1>
      </div>

      {/* Sci-Fi Hologram Descending Form */}
      <LoginForm />
    </div>
  );
};

export default Login;
