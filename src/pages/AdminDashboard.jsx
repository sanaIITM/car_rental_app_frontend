import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    name: "",
    model: "",
    category: "",
    pricePerDay: "",
    location: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    model: "",
    category: "",
    pricePerDay: "",
    location: "",
  });

  const fetchCars = () => {
    api.get("/api/user/cars").then((res) => setCars(res.data));
  };

  useEffect(fetchCars, []);

  const addCar = async (e) => {
    e.preventDefault();
    await api.post("/api/admin/cars", form);
    setForm({
      name: "",
      model: "",
      category: "",
      pricePerDay: "",
      location: "",
    });
    fetchCars();
  };

  const deleteCar = async (id) => {
    await api.delete(`/api/admin/cars/${id}`);
    fetchCars();
  };

  const startEdit = (car) => {
    setEditingId(car._id);
    setEditForm({
      name: car.name || "",
      model: car.model || "",
      category: car.category || "",
      pricePerDay: car.pricePerDay || "",
      location: car.location || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    await api.put(`/api/admin/cars/${id}`, editForm);
    setEditingId(null);
    fetchCars();
  };

  return (
    <div>
      <h1 className="page-title">Admin dashboard</h1>

      <div className="admin-layout">
        {/* Add Car Form */}
        <div className="admin-form-card">
          <h3>Add new car</h3>

          <form onSubmit={addCar}>
            <input
              placeholder="Car name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              required
            />
            <input
              placeholder="Category (e.g. suv, sedan)"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value.toLowerCase() })
              }
              required
            />
            <input
              placeholder="Price per day"
              value={form.pricePerDay}
              onChange={(e) =>
                setForm({ ...form, pricePerDay: e.target.value })
              }
              required
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />

            <button type="submit" className="btn-primary full-width">
              Add car
            </button>
          </form>
        </div>

        {/* Car List */}
        <div className="admin-cars-section">
          <h3>All cars</h3>

          <div className="car-grid">
            {cars.map((car) => {
              const isEditing = editingId === car._id;

              if (isEditing) {
                return (
                  <div key={car._id} className="car-card">
                    <div className="car-card-header">
                      <div>
                        <h3>Edit car</h3>
                        <p className="car-model">{car.name}</p>
                      </div>
                    </div>

                    <div className="date-group">
                      <label>Name</label>
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <label>Model</label>
                      <input
                        value={editForm.model}
                        onChange={(e) =>
                          setEditForm({ ...editForm, model: e.target.value })
                        }
                      />
                      <label>Category</label>
                      <input
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category: e.target.value.toLowerCase(),
                          })
                        }
                      />
                      <label>Price per day</label>
                      <input
                        value={editForm.pricePerDay}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            pricePerDay: e.target.value,
                          })
                        }
                      />
                      <label>Location</label>
                      <input
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="admin-card-actions">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => saveEdit(car._id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={car._id} className="car-card">
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

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => startEdit(car)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => deleteCar(car._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;