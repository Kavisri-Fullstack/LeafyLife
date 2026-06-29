import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="col-12 col-md-3 text-white p-4 sidebar-modern">
      <div>
        <p className="sidebar-heading text-uppercase fw-bold mb-4">Menu</p>
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li className="nav-item">
            <button 
              className={`nav-link sidebar-btn text-start w-100 p-3 rounded-3 ${activeTab === 'dashboard' ? 'active-premium' : 'text-white-50 bg-transparent'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fa-solid fa-chart-pie me-2"></i> Live Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link sidebar-btn text-start w-100 p-3 rounded-3 ${activeTab === 'calendar' ? 'active-premium' : 'text-white-50 bg-transparent'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <i className="fa-solid fa-droplet me-2"></i> Hydration Tasks
            </button>
          </li>
        </ul>
      </div>
      <div className="text-white-50 small border-top border-secondary-subtle pt-3 opacity-50 mt-4" style={{ fontSize: '0.8rem' }}>
        <i className="fa-solid fa-sliders me-1"></i> Core Node: v1.4.2<br />
        <i className="fa-solid fa-shield-halved me-1"></i> Encryption: Active
      </div>
    </div>
  );
}

export default Sidebar;