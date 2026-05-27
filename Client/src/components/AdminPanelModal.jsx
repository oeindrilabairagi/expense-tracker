import { useEffect, useState } from "react";
import {
  getAdminUsers,
  getAdminActivity,
  deleteAdminUser,
} from "../services/adminApi";

export default function AdminPanelModal({ setShowAdminPanel }) {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const usersData = await getAdminUsers();
      const activityData = await getAdminActivity();

      setUsers(usersData);
      setActivityLogs(activityData);
    } catch (error) {
      alert(error.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminUser(id);
      alert("User deleted successfully.");
      fetchAdminData();
    } catch (error) {
      alert(error.message || "Could not delete user.");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowAdminPanel(false)}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="view-expense-header">
          <h2>Admin Panel</h2>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowAdminPanel(false)}
          >
            Close
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            Activity Logs
          </button>
        </div>

        {loading ? (
          <p className="empty-text">Loading admin data...</p>
        ) : activeTab === "users" ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {user.role !== "admin" ? (
                        <button
                          className="delete-btn small-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="admin-badge">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.username || "Deleted user"}</td>
                    <td>{log.email || "N/A"}</td>
                    <td>{log.action_type}</td>
                    <td>{log.description}</td>
                    <td>
                      {new Date(log.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}