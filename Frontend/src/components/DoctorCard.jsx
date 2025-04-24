import React from "react";

const DoctorCard = ({ doctor, isSelected, onSelect }) => {
  return (
    <div
      className={`doctor-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(doctor)}
    >
      <img
        src={doctor.avatar}
        alt={doctor.name}
        className="doctor-avatar"
      />
      <div className="doctor-info">
        <h4>{doctor.name}</h4>
        <p>Languages: {doctor.languages.join(", ")}</p>
        <p>Specialty: {doctor.specialty}</p>
      </div>
    </div>
  );
};

export default DoctorCard;
