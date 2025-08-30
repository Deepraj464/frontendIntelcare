import React, { useState } from "react";
import "../../../Styles/RosterDetails.css";
import PersonalInformationIcon from '../../../Images/PersonalInformation.png';
import ContactIcon from '../../../Images/ContactNameicon.png';
import SuccessCheck from '../../../Images/SuccessCheck.png';
import { GoHistory } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";

const staffList = [
    { id: 1, name: "Elsa Smith", rate: "40$/hour", gender: "Female", age: 27 },
    { id: 2, name: "Elsa Smith", rate: "40$/hour", gender: "Female", age: 27 },
    { id: 3, name: "Elsa Smith", rate: "40$/hour", gender: "Female", age: 27 },
    { id: 4, name: "Elsa Smith", rate: "40$/hour", gender: "Female", age: 27 },
    { id: 5, name: "Elsa Smith", rate: "40$/hour", gender: "Female", age: 27 },
];
const staffHistory = [
    { name: "Brain Shah", date: "June 15, 2025" },
    { name: "Lorry Jane", date: "June 25, 2025" },
    { name: "Henery", date: "July 30, 2025" }
];

const RosterDetails = (props) => {
    const [selected, setSelected] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSelect = (id) => {
        if (selected.includes(id)) {
            // unselect if already selected
            setSelected(selected.filter((s) => s !== id));
        } else {
            // only add if less than 5
            if (selected.length < 5) {
                setSelected([...selected, id]);
            } else {
                alert("You can select up to 5 staff only.");
            }
        }
    };

    const handleBroadcast = () => {
        if (selected.length === 0) {
            alert("Please select at least one staff to broadcast.");
            return;
        }
        setShowSuccess(true);
    };

    return (
        <div className="roster-page">
            {/* Layout wrapper */}
            <div className="roster-layout">
                {/* Personal Information */}
                <div className="roster-personal-info">
                    <div className="roster-peronal-img-h">
                        <img src={PersonalInformationIcon} alt='personalImformation' style={{ width: '40px', height: 'auto', marginRight: '14px' }} />
                        <h3 className="roster-section-title">Personal Information</h3>
                    </div>
                    <div className="roster-info-grid">
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p color="#8A8A8A">ID: <span style={{ color: 'black' }}>7828</span></p>
                            <p>Name: <span style={{ color: 'black' }}>Sophia Carter</span></p>
                            <p>DOB: <span style={{ color: 'black' }}>10/05/1975</span></p>
                            <p>Gender: <span style={{ color: 'black' }}>Female</span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Phone: <span style={{ color: 'black' }}> +61 789 890 789</span></p>
                            <p>Plan Start Date: <span style={{ color: 'black' }}> +61 789 890 789</span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Address: <span style={{ color: 'black' }}> 42 The Esplanade Thornleigh Sydney NSW 2120</span></p>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="roster-history">
                    <div className="history-icon-h">
                        <GoHistory size={28} color="#6C4CDC" style={{ marginRight: '14px' }} />
                        <h3 className="roster-section-title">History</h3>
                    </div>

                    <div>
                        {staffHistory.map((staff, index) => (
                            <div className="history-card-roster" key={index}>
                                <img
                                    src={ContactIcon}
                                    alt="contactIcon"
                                    style={{ width: '24px', marginRight: '14px' }}
                                />
                                <div>
                                    <p className="staff-details">
                                        Staff Name: <span style={{ color: 'black' }}>{staff.name}</span>
                                    </p>
                                    <p className="staff-details" style={{ fontWeight: '400' }}>{staff.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Staff */}
            <div className="roster-staff-section">
                <h3 className="roster-section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Available Staff</h3>
                <div className="roster-staff-cards">
                    {staffList.map((staff) => (
                        <div
                            key={staff.id}
                            className={`roster-staff-card ${selected.includes(staff.id) ? "roster-selected" : ""}`}
                            onClick={() => handleSelect(staff.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div className="roster-staff-number">{staff.id}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>{staff.name}</div>
                            </div>
                            <p className="staff-details" style={{ fontWeight: '400' }}>Rate: <span style={{ color: 'black' }}>{staff.rate}</span></p>
                            <p className="staff-details" style={{ fontWeight: '400' }}>Gender: <span style={{ color: 'black' }}>{staff.gender}</span></p>
                            <p className="staff-details" style={{ fontWeight: '400' }}>Age: <span style={{ color: 'black' }}>{staff.age}</span></p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Broadcast Button */}
            <button className="roster-broadcast-btn" onClick={handleBroadcast}>Broadcast SMS to Staff</button>
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <img src={SuccessCheck} alt="success" className="success-img" />
                        <button className="done-btn" onClick={() => props.setScreen(1)}>
                            <GoArrowLeft size={24} color="white" style={{ marginLeft: '6px' }} /> Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RosterDetails;
