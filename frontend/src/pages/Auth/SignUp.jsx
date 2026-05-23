import React, { useState } from "react";
import { Mail, Lock, User, Key, Plus, X, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";

const Signup = () => {
  const { register, isSigningUp } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminToken: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setAvatar(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (avatar) formData.append("avatar", avatar);

    await register(formData);
  };

  return (
    <AuthLayout>
      <div className="bg-base-100 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              {preview ? (
                <div className="relative w-24 h-24">
                  <img
                    src={preview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full shadow-md hover:scale-110 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center border shadow-md relative">
                  {/* Default User Icon */}
                  <User className="w-10 h-10 text-base-content/50" />

                  {/* Add Button */}
                  <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-110 transition">
                    <Plus className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <div className="input input-bordered flex items-center gap-2 w-full">
              <User className="w-4 h-4" />
              <input
                type="text"
                placeholder="Your Name"
                className="grow"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

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

          {/* Admin Token */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Admin Token (Optional)</span>
            </label>
            <div className="input input-bordered flex items-center gap-2 w-full">
              <Key className="w-4 h-4" />
              <input
                type="text"
                placeholder="Enter admin token"
                className="grow"
                value={form.adminToken}
                onChange={(e) =>
                  setForm({ ...form, adminToken: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-base-content/70">
          ALready have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline hover:text-primary/80 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
