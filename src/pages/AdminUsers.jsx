import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    api
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log("Failed to fetch users");
      });
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    const query = searchText.toLowerCase().trim();

    return list.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "user").toLowerCase();
      const id = (u._id || "").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query) ||
        id.includes(query);

      const matchesRole =
        roleFilter === "all" || role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchText, roleFilter]);

  return (
    <div className="home-page">
      <section className="results-header">
        <h2>All users</h2>
        <span>
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </span>
      </section>

      <section className="search-filters">
        <div className="search-main">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="search-row">
          <div className="filter-group">
            <label>Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </section>

      {users.length === 0 && (
        <p className="empty-state">No users found.</p>
      )}

      <div className="car-grid">
        {filtered.map((u) => (
          <div key={u._id} className="car-card">
            <div className="car-card-header">
              <div>
                <h3>{u.name || "Unnamed user"}</h3>
                {u.email && <p className="car-model">{u.email}</p>}
              </div>
              <div className="car-price-block">
                <span className="price-unit">
                  {(u.role || "user").toUpperCase()}
                </span>
              </div>
            </div>

            <div className="car-meta">
              {u.role && (
                <span className="meta-pill">
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </span>
              )}
              {u.totalBookings != null && (
                <span className="meta-pill meta-location">
                  {u.totalBookings} booking
                  {u.totalBookings === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {u.createdAt && (
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;

