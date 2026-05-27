import { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "../services/authApi";

export default function UserProfileModal({
  setShowProfileModal,
  setUsername,
  setCurrentUser,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const data = await getUserProfile();

      setProfile(data);
      setEditUsername(data.username || "");
      setEditEmail(data.email || "");
    } catch (error) {
      alert(error.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!editUsername.trim() || !editEmail.trim()) {
      alert("Display name and email are required.");
      return;
    }

    try {
      const data = await updateUserProfile({
        username: editUsername,
        email: editEmail,
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      setProfile((prev) => ({
        ...prev,
        ...data.user,
      }));

      setUsername(data.user.username);
      setCurrentUser(data.user);
      setIsEditingProfile(false);

      alert("Profile updated successfully.");
    } catch (error) {
      alert(error.message || "Could not update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      await updateUserPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsChangingPassword(false);

      alert("Password updated successfully.");
    } catch (error) {
      alert(error.message || "Could not update password.");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="view-expense-header">
          <h2>User Profile</h2>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowProfileModal(false)}
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="empty-text">Loading profile...</p>
        ) : profile ? (
          <div className="profile-card">
            <div className="profile-avatar">
              {profile.username?.charAt(0).toUpperCase()}
            </div>

            {!isEditingProfile && !isChangingPassword && (
              <>
                <div className="profile-info-list">
                  <div className="profile-info-row">
                    <span>Display Name</span>
                    <strong>{profile.username}</strong>
                  </div>

                  <div className="profile-info-row">
                    <span>Email</span>
                    <strong>{profile.email}</strong>
                  </div>

                  <div className="profile-info-row">
                    <span>Date Joined</span>
                    <strong>
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </strong>
                  </div>
                </div>

                <div className="profile-action-row">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </button>
                </div>
              </>
            )}

            {isEditingProfile && (
              <div className="profile-edit-form">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />

                <label>Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditUsername(profile.username || "");
                      setEditEmail(profile.email || "");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isChangingPassword && (
              <div className="profile-edit-form">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="empty-text">No profile data found.</p>
        )}
      </div>
    </div>
  );
}