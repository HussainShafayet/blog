import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/environment';

const SignIn = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const {isLoggedIn,login} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      let signIninfo = {
        credential: identifier,
        password: password,
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signIninfo),
      });
      console.log('response', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to sign in');
      }

      const data = await response.json();
      console.log('Sign in successful', data);
     
       // Update the state to indicate a successful sign-in
      // Handle successful sign-in (e.g., store token, etc.)
      if(data.access && data.refresh){
        login(data.access, data.refresh);
        navigate('/');
      }
      
    } catch (err) {
      console.log('login error', err);
      setErrors(err.message.split(', '));
    }
    

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
        {errors.length > 0 && (
          <div className="mb-2 text-red-500">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email or Username</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              placeholder="Email or Username"
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-14 right-0 px-3 flex items-center text-gray-400 focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.029.11-.062.219-.098.328M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0c0 1.657-1.343 3-3 3s-3-1.343-3-3m12 0c0-4.418-3.582-8-8-8s-8 3.582-8 8m16 0c0 1.13-.23 2.206-.648 3.198m-3.544 2.456A9.96 9.96 0 0112 21c-4.418 0-8-3.582-8-8m16 0c0 1.13-.23 2.206-.648 3.198m-3.544 2.456A9.96 9.96 0 0112 21c-4.418 0-8-3.582-8-8m16 0c0 1.13-.23 2.206-.648 3.198m-3.544 2.456A9.96 9.96 0 0112 21c-4.418 0-8-3.582-8-8"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A8.94 8.94 0 0112 19c-4.418 0-8-3.582-8-8 0-1.786.58-3.44 1.556-4.77m1.664-1.665C7.54 4.582 9.194 4 11 4c4.418 0 8 3.582 8 8 0 1.786-.58 3.44-1.556 4.77M9.172 9.172A4.001 4.001 0 0012 16c1.178 0 2.236-.463 3.03-1.204m1.664-1.665A8.94 8.94 0 0019 12a8.94 8.94 0 00-.304-2.45M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18"/>
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-royalblue text-white font-bold bg-emerald-500 rounded hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
          <div className="text-center mt-3">
            <span className='text-white mr-1'>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              SignUp Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
