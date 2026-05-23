import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, Plus, X } from "lucide-react";
import defaultAvatar from "../../assets/avatar.png"; 
import { Link, useNavigate } from "react-router-dom"; // 👈 import useNavigate

const ProfileEditPage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const navigate = useNavigate(); // 👈 hook

  const [name, setName] = useState(authUser?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(authUser?.avatar || defaultAvatar);
  const [message, setMessage] = useState(null);

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove avatar preview → fallback to default
  const removeFile = () => {
    setAvatar(null);
    setPreview(defaultAvatar);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) formData.append("avatar", avatar);

      await updateProfile(formData);
      setMessage("✅ Profile updated successfully!");

      // 👇 Navigate after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch {
      setMessage("❌ Update failed!");
    }
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        {message && (
          <div
            className={`p-2 rounded-md mb-4 text-sm font-medium ${
              message.includes("success")
                ? "bg-success/20 text-success"
                : "bg-error/20 text-error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <img
                src={preview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border shadow-md"
              />

              {/* Remove button (only if user selected new avatar) */}
              {avatar && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full shadow-md hover:scale-110 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Upload button */}
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
          </div>

          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>

            <Link to="/profile" className="btn btn-outline flex-1">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
