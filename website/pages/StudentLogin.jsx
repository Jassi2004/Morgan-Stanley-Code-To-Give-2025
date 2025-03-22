import React, { useState } from 'react';

function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login credentials:', { email, password });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <div className="card w-full max-w-md p-8 shadow-lg animate-fade-in">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <label className="form-label" htmlFor="email">Email:</label>
            <input
              className="form-input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="password">Password:</label>
            <div className="relative">
              <input
                className="form-input pr-10"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-sm text-[var(--color-text-secondary)]">
                Remember Me
              </label>
            </div>
            <a href="/forgot-password" className="text-[var(--color-info)] hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>

          <div className="text-center text-sm text-[var(--color-text-accent)]">
            Don't have an account?{' '}
            <a href="/register" className="text-[var(--color-brand)] hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;