import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Home() {
  const [cars, setCars] = useState([]);
  const [bookingDates, setBookingDates] = useState({});

  // Search / filter / sort state
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    api.get("/api/user/cars").then((res) => setCars(res.data));
  }, []);

  const handleBookingFieldChange = (carId, field, value) => {
    setBookingDates((prev) => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        [field]: value,
      },
    }));
  };

  const bookCar = async (carId) => {
    const data = bookingDates[carId];

    if (!data?.startDate || !data?.endDate) {
      alert("Please select both dates");
      return;
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      alert("End date must be after start date");
      return;
    }

    if (!data?.paymentMethod) {
      alert("Please choose a payment method");
      return;
    }

    try {
      await api.post("/api/user/bookings", {
        car: carId,
        startDate: data.startDate,
        endDate: data.endDate,
        payment: {
          method: data.paymentMethod,
        },
      });

      alert("Booking created!");
    } catch {
      alert("Booking failed");
    }
  };

  const uniqueCategories = useMemo(() => {
    const set = new Set();
    cars.forEach((car) => {
      if (car.category) {
        set.add(car.category.toLowerCase());
      }
    });
    return Array.from(set);
  }, [cars]);

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const name = (car.name || "").toLowerCase();
      const model = (car.model || "").toLowerCase();
      const location = (car.location || "").toLowerCase();
      const category = (car.category || "").toLowerCase();
      const query = searchText.toLowerCase().trim();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        model.includes(query) ||
        location.includes(query);

      const matchesCategory =
        categoryFilter === "all" || category === categoryFilter;

      const price = Number(car.pricePerDay) || 0;
      const priceLimit = Number(maxPrice);
      const matchesPrice = !maxPrice || price <= priceLimit;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort(
        (a, b) => Number(a.pricePerDay) - Number(b.pricePerDay)
      );
    } else if (sortBy === "price-desc") {
      result = [...result].sort(
        (a, b) => Number(b.pricePerDay) - Number(a.pricePerDay)
      );
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    return result;
  }, [cars, searchText, categoryFilter, maxPrice, sortBy]);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <h1>Push the redline every drive</h1>
          <p>
            ApexDrive connects you with high-performance hatchbacks, sharp sport
            sedans and hard-pulling SUVs tuned for every kind of road.
          </p>
        </div>
        <div className="home-hero-stats">
          <div>
            <h3>{cars.length || "–"}</h3>
            <span>Cars available</span>
          </div>
          <div>
            <h3>24/7</h3>
            <span>Support</span>
          </div>
          <div>
            <h3>0₹</h3>
            <span>Online booking fees</span>
          </div>
        </div>
      </section>

      <section className="search-filters">
        <div className="search-main">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by car, model or location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="search-row">
          <div className="filter-group">
            <label>Car type</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="muv">MUV</option>
              <option value="luxury">Luxury</option>
              {uniqueCategories
                .filter(
                  (c) =>
                    !["hatchback", "sedan", "suv", "muv", "luxury"].includes(c)
                )
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Max price / day (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="No limit"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A–Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="results-header">
        <h2>Available cars</h2>
        <span>
          {filteredCars.length} result
          {filteredCars.length === 1 ? "" : "s"} found
        </span>
      </section>

      <div className="car-grid">
        {filteredCars.length === 0 ? (
          <p className="empty-state">
            No cars match your filters. Try changing the car type, price or
            search query.
          </p>
        ) : (
          filteredCars.map((car) => (
            <div className="car-card" key={car._id}>
              <div className="car-card-header">
                <div>
                  <h3>{car.name}</h3>
                  <p className="car-model">{car.model}</p>
                </div>
                <div className="car-price-block">
                  <span className="price">
                    ₹{car.pricePerDay}
                    <span className="price-unit">/day</span>
                  </span>
                </div>
              </div>

              <div className="car-meta">
                {car.category && (
                  <span className="meta-pill">
                    {car.category.charAt(0).toUpperCase() +
                      car.category.slice(1)}
                  </span>
                )}
                {car.location && (
                  <span className="meta-pill meta-location">
                    {car.location}
                  </span>
                )}
              </div>

              <div className="date-group">
                <label>Start date</label>
                <input
                  type="date"
                  onChange={(e) =>
                    handleBookingFieldChange(
                      car._id,
                      "startDate",
                      e.target.value
                    )
                  }
                />

                <label>End date</label>
                <input
                  type="date"
                  onChange={(e) =>
                    handleBookingFieldChange(
                      car._id,
                      "endDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="payment-group">
                <label>Payment method</label>
                <select
                  onChange={(e) =>
                    handleBookingFieldChange(
                      car._id,
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="card">Credit / Debit card</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Pay at pickup</option>
                </select>
              </div>

              <button
                className="btn-primary full-width"
                onClick={() => bookCar(car._id)}
              >
                Book now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;