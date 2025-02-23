import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-400 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white bg-opacity-20 p-8 rounded-2xl shadow-xl border border-white border-opacity-30 transform transition-all duration-300 hover:scale-[1.02]">
        <div>
          <h2 className="mt-2 text-center text-4xl font-bold text-white">
            Join the Journey! 🚀
          </h2>
          <p className="mt-2 text-center text-sm text-white text-opacity-80">
            Create your account and start tracking your progress
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-400 bg-opacity-20 backdrop-blur-md border border-red-200 border-opacity-20 text-white px-4 py-3 rounded-lg relative flex items-center space-x-2 transform transition-all duration-300 animate-fade-in" role="alert">
              <AlertCircle className="h-5 w-5" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-lg space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white text-opacity-70 group-focus-within:text-opacity-100 transition-opacity duration-200" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 placeholder-white placeholder-opacity-70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:border-transparent backdrop-blur-lg transition-all duration-200"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white text-opacity-70 group-focus-within:text-opacity-100 transition-opacity duration-200" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 placeholder-white placeholder-opacity-70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:border-transparent backdrop-blur-lg transition-all duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white text-opacity-70 group-focus-within:text-opacity-100 transition-opacity duration-200" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 placeholder-white placeholder-opacity-70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:border-transparent backdrop-blur-lg transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle2 className="h-5 w-5 text-white text-opacity-70 group-focus-within:text-opacity-100 transition-opacity duration-200" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 placeholder-white placeholder-opacity-70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:border-transparent backdrop-blur-lg transition-all duration-200"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              ) : null}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link 
            to="/login" 
            className="font-medium text-white hover:text-opacity-80 transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
