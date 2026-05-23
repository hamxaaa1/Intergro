import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <AuthLayout>
      <div className="bg-base-100 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="input input-bordered flex items-center gap-2 w-full">
              <Mail className="w-4 h-4" />
              <input
                type="email"
                placeholder="you@example.com"
                className="grow"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password with eye toggle */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="input input-bordered flex items-center gap-2 w-full">
              <Lock className="w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="grow"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="text-sm text-center mt-6 text-base-content/70">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline hover:text-primary/80 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
