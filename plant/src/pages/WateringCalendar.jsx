import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../api';

function WateringCalendar({ plants, setPlants }) {

  const getToken = () => localStorage.getItem('leafyToken');

  const mondayPlants = plants.filter(p => {
    const status = p.waterStatus.trim().toLowerCase();
    return status.includes("3 days") || status.includes("soon");
  });

  const wednesdayPlants = plants.filter(p => {
    const status = p.waterStatus.trim().toLowerCase();
    return status.includes("yesterday") || status.includes("recently");
  });

  const fridayPlants = plants.filter(p => {
    const status = p.waterStatus.trim().toLowerCase();
    return status.includes("thirsty") || status.includes("today");
  });

  const handleMarkAsWatered = async (plantId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/plants/update-status/${plantId}`,
        { waterStatus: "Watered recently" },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response.data.success) {
        toast.success("Plant marked as watered!");
        const updatedList = plants.map(plant => {
          if (plant._id === plantId || plant.id === plantId) {
            return { ...plant, waterStatus: "Watered recently", statusClass: "text-success" };
          }
          return plant;
        });
        setPlants(updatedList);
      }
    } catch (error) {
      toast.error("Failed to update. Try again!");
    }
  };

  const weeklySchedule = [
    { day: "Monday", plants: mondayPlants, note: "Plants need attention soon" },
    { day: "Tuesday", plants: [], note: "All plants healthy" },
    { day: "Wednesday", plants: wednesdayPlants, note: "Mid-week watering check" },
    { day: "Thursday", plants: [], note: "All plants healthy" },
    { day: "Friday", plants: fridayPlants, note: "Thirsty plants — water today!" },
    { day: "Saturday", plants: [], note: "Weekend check-up" },
    { day: "Sunday", plants: [], note: "Rest day" }
  ];

  return (
    <div className="col-12 p-3 p-md-5 bg-light flex-grow-1">

      <div className="mb-4 mb-md-5">
        <h2 className="fw-bold text-dark mb-2">
          <i className="fa-solid fa-droplet text-success me-2"></i>Watering Schedule
        </h2>
        <p className="text-muted m-0 fs-6">
          Check which plants need water today and click 'Mark as Done' after watering them.
        </p>
      </div>

      <div className="task-wrapper border shadow-sm">
        <div className="d-flex flex-column gap-4">

          {weeklySchedule.map((item, index) => (
            <div key={index} className="row align-items-start g-3 pb-4 border-bottom">

              <div className="col-12 col-md-3">
                <div className="day-header-card shadow-sm">
                  <i className="fa-regular fa-calendar-days me-2 text-success"></i>{item.day}
                </div>
                <div className="text-muted small ms-2 mt-1">{item.note}</div>
              </div>

              <div className="col-12 col-md-9">
                <div className="responsive-task-grid">
                  {item.plants.length > 0 ? (
                    item.plants.map((plant, pIndex) => (
                      <div className="compact-plant-card d-flex justify-content-between align-items-center shadow-sm" key={pIndex}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={plant.image}
                            alt={plant.name}
                            style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                          />
                          <div>
                            <h6 className="fw-bold m-0 text-dark text-start">{plant.name}</h6>
                            <span className="text-danger small fw-semibold" style={{ fontSize: "0.75rem" }}>
                              <i className="fa-solid fa-circle-exclamation me-1"></i>{plant.waterStatus}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn-water-done"
                          onClick={() => handleMarkAsWatered(plant.id || plant._id)}
                        >
                          <i className="fa-solid fa-check me-1"></i>Mark Done
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-tasks-box shadow-sm w-100">
                      <i className="fa-solid fa-heart-pulse me-1 text-success opacity-50"></i>
                      No plants need water today.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default WateringCalendar;