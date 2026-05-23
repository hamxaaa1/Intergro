import { useAuthStore } from "../../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/avatar.png"; // ✅ import default avatar

const ProfilePage = () => {
  const { authUser, isFetchingProfile } = useAuthStore();

  if (isFetchingProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-error">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card bg-base-200 shadow-xl p-6">
        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src={authUser.avatar || defaultAvatar} // ✅ fallback to default avatar
                alt={authUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{authUser.name}</h2>
            <p className="text-sm text-base-content/70">{authUser.email}</p>
            <p className="badge badge-outline mt-1 capitalize">
              {authUser.role}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-base-100 rounded-lg shadow">
              <span className="text-xs text-base-content/60">Joined</span>
              <p className="text-sm">
                {new Date(authUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-end">
          <Link to="/edit-profile" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
