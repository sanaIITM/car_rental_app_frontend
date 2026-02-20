import { useEffect, useState } from "react";
import api from "../services/api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => console.log("Failed to fetch bookings"));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/admin/bookings/${id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data : b))
      );
    } catch (err) {
      console.log("Failed to update status", err);
      alert("Failed to update booking status");
    }
  };

  return (
    <div>
      <h1 className="page-title">All bookings</h1>

      {bookings.length === 0 && (
        <p className="empty-state">No bookings found.</p>
      )}

      <div className="car-grid">
        {bookings.map((b) => {
          const status = (b.status || "pending").toLowerCase();

          return (
            <div key={b._id} className="car-card">
              <div className="car-card-header">
                <div>
                  <h3>{b.car?.name || "Car removed"}</h3>
                  {b.user?.name && (
                    <p className="car-model">{b.user.name}</p>
                  )}
                </div>
                {b.car?.pricePerDay && (
                  <div className="car-price-block">
                    <span className="price">
                      ₹{b.car.pricePerDay}
                      <span className="price-unit">/day</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="car-meta">
                {b.user?.email && (
                  <span className="meta-pill meta-location">
                    {b.user.email}
                  </span>
                )}
                {b.status && (
                  <span className="meta-pill">
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                )}
              </div>

              <p>
                <strong>Start:</strong>{" "}
                {new Date(b.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(b.endDate).toLocaleDateString()}
              </p>

              <p className="booking-status" data-status={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>

              {status !== "approved" && (
                <div className="admin-card-actions">
                  <button
                    type="button"
                    className="btn-admin-action btn-approve"
                    onClick={() => updateStatus(b._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-admin-action btn-reject"
                    onClick={() => updateStatus(b._id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn-admin-action btn-pending"
                    onClick={() => updateStatus(b._id, "pending")}
                  >
                    Mark pending
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminBookings;