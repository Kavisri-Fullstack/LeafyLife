import React, { useState, useEffect } from 'react';
import PlantCard from '../components/PlantCard';
import swissCheeseImg from '../assets/swiss_cheese.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Dashboard({ plants, setPlants }) {
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlant, setEditPlant]         = useState(null);
  const [newName, setNewName]             = useState('');
  const [newBotanical, setNewBotanical]   = useState('');
  const [newWater, setNewWater]           = useState('Needs water soon');
  const [newImage, setNewImage]           = useState(null);
  const [fetchLoading, setFetchLoading]   = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterStatus, setFilterStatus]   = useState('All');

  useScrollReveal();

  // Stats
  const thirstyCount = plants.filter(p => p.waterStatus.toLowerCase().includes("thirsty")).length;
  const wateredCount = plants.filter(p => p.waterStatus.toLowerCase().includes("recently")).length;

  // Search + Filter logic
  const filteredPlants = plants.filter(plant => {
    const matchSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filterStatus === 'All' ? true :
      filterStatus === 'Thirsty' ? plant.waterStatus.toLowerCase().includes('thirsty') :
      filterStatus === 'Watered' ? plant.waterStatus.toLowerCase().includes('recently') :
      plant.waterStatus.toLowerCase().includes('soon');
    return matchSearch && matchFilter;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Fetch helper with loading
  const fetchAllPlants = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/plants/all', { headers: { Authorization: `Bearer ${localStorage.getItem('leafyToken')}` } });
      const formatted = res.data.map(plant => ({
        ...plant,
        id: plant._id,
        statusClass: plant.waterStatus.includes("Thirsty") ? "text-danger fw-bold" : "text-success"
      }));
      setPlants(formatted);
    } catch (error) {
      toast.error("Failed to fetch plants!");
    } finally {
      setFetchLoading(false);
    }
  };

  // ADD plant
  const handleAddPlant = async (e) => {
    e.preventDefault();
    if (!newName) return;
    const newPlantObj = {
      name: newName,
      botanicalName: newBotanical || "Species unclassified",
      waterStatus: newWater,
      image: newImage || swissCheeseImg
    };
    try {
      const response = await axios.post('http://localhost:5000/api/plants/add', newPlantObj, { headers: { Authorization: `Bearer ${localStorage.getItem('leafyToken')}` } });
      if (response.data.success) {
        toast.success("Plant added successfully!");
        await fetchAllPlants();
        setShowAddModal(false);
        setNewName(''); setNewBotanical(''); setNewImage(null);
        setNewWater('Needs water soon');
      }
    } catch (error) {
      toast.error("Failed to add plant. Try again!");
    }
  };

  // EDIT — open modal with existing data
  const handleOpenEdit = (plant) => {
    setEditPlant({ ...plant });
    setShowEditModal(true);
  };

  // EDIT — save changes
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/plants/update-status/${editPlant.id}`,
        { waterStatus: editPlant.waterStatus }
      );
      if (response.data.success) {
        toast.success("Plant updated successfully!");
        await fetchAllPlants();
        setShowEditModal(false);
        setEditPlant(null);
      }
    } catch (error) {
      toast.error("Failed to update plant. Try again!");
    }
  };

  // DELETE plant
  const handleDeletePlant = async (plantId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/plants/delete/${plantId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('leafyToken')}` } });
      if (response.data.success) {
        toast.success("Plant deleted successfully!");
        setPlants(plants.filter(p => p._id !== plantId && p.id !== plantId));
      }
    } catch (error) {
      toast.error("Failed to delete plant. Try again!");
    }
  };

  return (
    <div className="col-12 p-4 p-md-5 bg-light flex-grow-1">

      {/* HERO BANNER */}
      <div className="hero-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
        <div>
          <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
            Welcome to LeafyLife
            <i className="fa-solid fa-seedling ms-2" style={{ color: '#a8f5c5' }}></i>
          </h1>
          <p className="m-0 fs-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Track your plants and set watering reminders easily.
          </p>
        </div>
        <button className="btn-neo-green px-4 text-nowrap" onClick={() => setShowAddModal(true)}>
          <i className="fa-solid fa-plus me-2"></i>Add New Plant
        </button>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar reveal">
        <div className="stat-chip delay-1">
          <i className="fa-solid fa-seedling stat-icon-fa text-success"></i>
          <div>
            <div className="stat-number">{plants.length}</div>
            <div className="stat-label">Total Plants</div>
          </div>
        </div>
        <div className="stat-chip delay-2">
          <i className="fa-solid fa-droplet stat-icon-fa text-primary"></i>
          <div>
            <div className="stat-number">{thirstyCount}</div>
            <div className="stat-label">Need Water</div>
          </div>
        </div>
        <div className="stat-chip delay-3">
          <i className="fa-solid fa-circle-check stat-icon-fa text-success"></i>
          <div>
            <div className="stat-number">{wateredCount}</div>
            <div className="stat-label">Watered</div>
          </div>
        </div>
        <div className="stat-chip delay-4">
          <i className="fa-solid fa-cloud stat-icon-fa" style={{ color: '#2ecc71' }}></i>
          <div>
            <div className="stat-number" style={{ fontSize: '1rem', color: '#2ecc71' }}>Live</div>
            <div className="stat-label">All systems online</div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="search-filter-bar reveal mb-4">
        <div className="search-input-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <div className="filter-tabs">
          {['All', 'Thirsty', 'Watered', 'Soon'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'Thirsty' && <i className="fa-solid fa-droplet me-1"></i>}
              {status === 'Watered' && <i className="fa-solid fa-circle-check me-1"></i>}
              {status === 'Soon' && <i className="fa-solid fa-clock me-1"></i>}
              {status === 'All' && <i className="fa-solid fa-border-all me-1"></i>}
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 reveal">
        <h4 className="fw-bold text-dark m-0">
          Your Plants
          <span className="badge ms-2 rounded-pill" style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.8rem' }}>
            {filteredPlants.length}
          </span>
        </h4>
        <div className="text-muted small">
          <i className="fa-solid fa-circle me-1 text-success" style={{ fontSize: '0.5rem' }}></i>
          All systems online
        </div>
      </div>

      {/* LOADING SPINNER */}
      {fetchLoading && (
        <div className="text-center py-5">
          <div className="leafy-spinner mx-auto mb-3">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <p className="text-muted small">Loading your plants...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!fetchLoading && filteredPlants.length === 0 && (
        <div className="text-center py-5 reveal">
          <i className="fa-solid fa-leaf empty-state-icon animate-float"></i>
          <h5 className="text-muted fw-semibold mt-3">
            {searchTerm || filterStatus !== 'All' ? 'No plants match your search!' : 'No plants yet!'}
          </h5>
          <p className="text-muted small">
            {searchTerm || filterStatus !== 'All' ? 'Try a different search or filter.' : 'Click "Add New Plant" to get started.'}
          </p>
        </div>
      )}

      {/* PLANT GRID */}
      {!fetchLoading && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredPlants.map((plant, index) => (
            <PlantCard
              key={plant.id || plant._id}
              plant={plant}
              onDelete={handleDeletePlant}
              onEdit={handleOpenEdit}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      )}

      {/* ADD PLANT MODAL */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header p-4" style={{ background: 'linear-gradient(135deg, #0a2e14, #1a4a24)', borderRadius: '16px 16px 0 0' }}>
                <h5 className="modal-title fw-bold m-0 text-white">
                  <i className="fa-solid fa-plus me-2"></i>Add New Plant
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddPlant}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Plant Name</label>
                    <input type="text" className="form-control" placeholder="e.g., Golden Pothos" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Scientific Name</label>
                    <input type="text" className="form-control" placeholder="e.g., Epipremnum aureum" value={newBotanical} onChange={(e) => setNewBotanical(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Plant Photo</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Water Status</label>
                    <select className="form-select" value={newWater} onChange={(e) => setNewWater(e.target.value)}>
                      <option value="Thirsty! Water today">Thirsty! Water today</option>
                      <option value="Needs water soon">Needs water soon</option>
                      <option value="Watered recently">Watered recently</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light" style={{ borderRadius: '0 0 16px 16px' }}>
                  <button type="button" className="btn btn-secondary rounded-3" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success px-4 rounded-3 fw-bold">
                    <i className="fa-solid fa-floppy-disk me-2"></i>Save Plant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLANT MODAL */}
      {showEditModal && editPlant && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header p-4" style={{ background: 'linear-gradient(135deg, #1a2a4a, #1e3a6e)', borderRadius: '16px 16px 0 0' }}>
                <h5 className="modal-title fw-bold m-0 text-white">
                  <i className="fa-solid fa-pen me-2"></i>Edit Plant
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Plant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPlant.name}
                      onChange={(e) => setEditPlant({ ...editPlant, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Scientific Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPlant.botanicalName}
                      onChange={(e) => setEditPlant({ ...editPlant, botanicalName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Water Status</label>
                    <select
                      className="form-select"
                      value={editPlant.waterStatus}
                      onChange={(e) => setEditPlant({ ...editPlant, waterStatus: e.target.value })}
                    >
                      <option value="Thirsty! Water today">Thirsty! Water today</option>
                      <option value="Needs water soon">Needs water soon</option>
                      <option value="Watered recently">Watered recently</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light" style={{ borderRadius: '0 0 16px 16px' }}>
                  <button type="button" className="btn btn-secondary rounded-3" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 rounded-3 fw-bold">
                    <i className="fa-solid fa-floppy-disk me-2"></i>Update Plant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;