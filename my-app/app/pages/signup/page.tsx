'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, User, Lock, Building2 } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm text-gray-600">
              Sign up to start booking amazing hotels
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (!email || !username || !password) {
                setError('Please fill all fields');
                return;
              }

              setLoading(true);
              try {
                const res = await fetch('/api/auth/signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, email, password }),
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                  setError((data && (data.error || data.message)) || 'Signup failed');
                  setLoading(false);
                  return;
                }

                router.push('/');
              } catch (err) {
                console.error('Signup submit error', err);
                setError('Network or server error');
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-gray-50 border-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              {error && (
                <div className="text-sm text-red-600 mb-2">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
