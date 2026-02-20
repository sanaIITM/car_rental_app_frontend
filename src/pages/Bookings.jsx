import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    api
      .get("/api/user/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => console.log("Failed to fetch bookings"));
  }, []);

  const filtered = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    return bookings.filter((b) => {
      const carName = (b.car?.name || "").toLowerCase();
      const carLocation = (b.car?.location || "").toLowerCase();
      const matchesSearch =
        !query || carName.includes(query) || carLocation.includes(query);

      const status = b.status || "pending";
      const matchesStatus =
        statusFilter === "all" || status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchText, statusFilter]);

  const statusLabel = (status) => {
    if (!status) return "Pending";
    const lower = status.toLowerCase();
    if (lower === "pending") return "Pending";
    if (lower === "approved") return "Approved";
    if (lower === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <div className="home-page">
      <section className="results-header">
        <h2>My bookings</h2>
        <span>
          {filtered.length} booking{filtered.length === 1 ? "" : "s"}
        </span>
      </section>

      <section className="search-filters">
        <div className="search-main">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by car name or location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="search-row">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </section>

      {bookings.length === 0 && (
        <p className="empty-state">You haven&apos;t made any bookings yet.</p>
      )}

      <div className="car-grid">
        {filtered.map((b) => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const days =
            !Number.isNaN(start) && !Number.isNaN(end)
              ? Math.max(
                  1,
                  Math.round(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                  )
                )
              : null;
          const pricePerDay = Number(b.car?.pricePerDay) || 0;
          const totalPrice = days ? days * pricePerDay : null;
          const status = (b.status || "pending").toLowerCase();

          return (
            <div key={b._id} className="car-card">
              <div className="car-card-header">
                <div>
                  <h3>{b.car?.name || "Car removed"}</h3>
                  {b.car?.model && (
                    <p className="car-model">{b.car.model}</p>
                  )}
                </div>
                {pricePerDay ? (
                  <div className="car-price-block">
                    <span className="price">
                      ₹{pricePerDay}
                      <span className="price-unit">/day</span>
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="car-meta">
                {b.car?.location && (
                  <span className="meta-pill meta-location">
                    {b.car.location}
                  </span>
                )}
                {b.car?.category && (
                  <span className="meta-pill">
                    {b.car.category.charAt(0).toUpperCase() +
                      b.car.category.slice(1)}
                  </span>
                )}
              </div>

              <p>
                <strong>Start:</strong> {start.toLocaleDateString()}
              </p>
              <p>
                <strong>End:</strong> {end.toLocaleDateString()}
              </p>
              {days && (
                <p>
                  <strong>Duration:</strong> {days} day
                  {days === 1 ? "" : "s"}
                </p>
              )}
              {totalPrice !== null && (
                <p>
                  <strong>Total:</strong> ₹{totalPrice}
                </p>
              )}

              <p
                className="booking-status"
                data-status={status}
              >
                {statusLabel(b.status)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bookings;