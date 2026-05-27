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
  const [userSearch, setUserSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

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

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();

    return (
      user.username?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  const filteredActivityLogs = activityLogs.filter((log) => {
    const search = activitySearch.toLowerCase();

    return (
      log.username?.toLowerCase().includes(search) ||
      log.email?.toLowerCase().includes(search) ||
      log.action_type?.toLowerCase().includes(search) ||
      log.description?.toLowerCase().includes(search)
    );
  });

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
            type="button"
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            type="button"
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            Activity Logs
          </button>
        </div>

        {loading ? (
          <p className="empty-text">Loading admin data...</p>
        ) : activeTab === "users" ? (
          <>
            <div className="admin-search-bar">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or role"
              />
            </div>

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
                  {filteredUsers.map((user) => (
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
                            type="button"
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

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No matching users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="admin-search-bar">
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search activities by user, email, action, or description"
              />
            </div>

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
                  {filteredActivityLogs.map((log) => (
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

                  {filteredActivityLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No matching activity logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}