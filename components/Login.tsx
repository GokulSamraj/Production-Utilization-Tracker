import React, { useState } from 'react';

interface LoginProps {
  onLogin: (u: string, p: string) => void;
  error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mac-bg py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full glass rounded-xl shadow-2xl overflow-hidden border border-mac-border">
        
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-mac-text tracking-tight">
              Welcome Executive
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access the dashboard
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">E-Mail Id</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-mac-bg border border-mac-border rounded-lg placeholder-gray-600 text-mac-text focus:outline-none focus:ring-2 focus:ring-mac-accent focus:border-transparent transition duration-200"
                  placeholder="mail@lmes.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-mac-bg border border-mac-border rounded-lg placeholder-gray-600 text-mac-text focus:outline-none focus:ring-2 focus:ring-mac-accent focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-900/50">{error}</div>}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mac-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mac-accent shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
            </button>
            
            <div className="text-center text-xs text-gray-600 mt-4">
              Contact Praveen (praveen_k@lmes.in) for dashboard issue and access
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};