import React from 'react';

function PlantCard({ plant, onDelete, onEdit, animationDelay = 0 }) {
  return (
    <div className="col">
      <div
        className="card h-100 glass-card border-0 shadow-sm position-relative"
        style={{ animationDelay: `${animationDelay}s` }}
      >

        {/* ACTION BUTTONS — Edit + Delete */}
        <div className="position-absolute top-0 end-0 m-3 d-flex gap-2" style={{ zIndex: 10 }}>
          <button
            className="btn btn-sm glass-edit-btn rounded-circle"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => onEdit(plant)}
            title="Edit Plant"
          >
            <i className="fa-solid fa-pen" style={{ fontSize: '0.75rem' }}></i>
          </button>
          <button
            className="btn btn-sm glass-delete-btn rounded-circle"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${plant.name}?`)) {
                onDelete(plant.id);
              }
            }}
            title="Delete Plant"
          >
            <i className="fa-solid fa-trash" style={{ fontSize: '0.75rem' }}></i>
          </button>
        </div>

        {/* PLANT IMAGE */}
        <div className="card-img-container">
          <img src={plant.image} className="premium-img" alt={plant.name} />
        </div>

        <div className="card-body p-4">
          <span className="badge bg-success-subtle text-success mb-2 px-2 py-1 rounded-3 small">
            <i className="fa-solid fa-leaf me-1"></i>Plant
          </span>
          <h5 className="card-title mb-1 fw-bold text-dark">{plant.name}</h5>
          <p className="text-muted small mb-3">
            <em style={{ fontFamily: 'Georgia, serif' }}>{plant.botanicalName}</em>
          </p>

          <hr className="my-3" style={{ opacity: 0.1 }} />

          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-droplet text-primary"></i>
            <span className={`small fw-semibold ${plant.statusClass}`}>
              {plant.waterStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantCard;