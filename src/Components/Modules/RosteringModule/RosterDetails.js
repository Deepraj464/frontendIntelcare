import React, { useState } from "react";
import "../../../Styles/RosterDetails.css";
import PersonalInformationIcon from '../../../Images/PersonalInformation.png';
import ContactIcon from '../../../Images/ContactNameicon.png';
import SuccessCheck from '../../../Images/SuccessCheck.png';
import { GoHistory, GoArrowLeft } from "react-icons/go";
import axios from "axios";

const RosterDetails = ({ setScreen, rosteringResponse, API_BASE }) => {
    const [selected, setSelected] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [broadcasting, setBroadcasting] = useState(false);

    // Extract data from backend response
    const client = rosteringResponse?.data?.client || {};
    
    // ✅ Only keep staff with role "SW"
    const staffList = rosteringResponse?.data?.staff_workers || []

    const request = rosteringResponse?.data?.request || {};
    const message = rosteringResponse?.data?.message || "";

    const handleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((s) => s !== id));
        } else {
            if (selected.length < 5) {
                setSelected([...selected, id]);
            } else {
                alert("You can select up to 5 staff only.");
            }
        }
    };

    // Controller 2: Broadcast shift to selected staff
    const handleBroadcast = async () => {
        if (selected.length === 0) {
            alert("Please select at least one staff to broadcast.");
            return;
        }
        
        setBroadcasting(true);
        try {
            // Filter staff based on selection
            const selectedStaff = selected.map(index => staffList[index]);
            
            // Call broadcast endpoint
            const response = await axios.post(`${API_BASE}/broadcast-shift`, {
                selectedStaff,
                client,
                request,
                message
            });
            
            console.log("Broadcast response:", response.data);
            setShowSuccess(true);
        } catch (error) {
            console.error("Error broadcasting:", error);
            alert("Failed to broadcast messages. Try again.");
        } finally {
            setBroadcasting(false);
        }
    };

    return (
        <div className="roster-page">
            {/* Layout wrapper */}
            <div className="roster-layout">
                {/* Personal Information */}
                <div className="roster-personal-info">
                    <div className="roster-peronal-img-h">
                        <img
                            src={PersonalInformationIcon}
                            alt="personalInformation"
                            style={{ width: '40px', marginRight: '14px' }}
                        />
                        <h3 className="roster-section-title">Personal Information</h3>
                    </div>

                    <div className="roster-info-grid">
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>ID: <span style={{ color: 'black' }}>{client.id || 'N/A'}</span></p>
                            <p>Name: <span style={{ color: 'black' }}>{client.client_name || 'N/A'}</span></p>
                            <p>DOB: <span style={{ color: 'black' }}>{client.dob || 'N/A'}</span></p>
                            <p>Gender: <span style={{ color: 'black' }}>{client.gender || 'N/A'}</span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Phone: <span style={{ color: 'black' }}>{client.phone || 'N/A'}</span></p>
                            <p>Plan Start Date: <span style={{ color: 'black' }}>{client.plan_start_date || 'N/A'}</span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Address: <span style={{ color: 'black' }}>
                                {client.address
                                    ? `${client.address.street_number} ${client.address.street}, ${client.address.suburb}, ${client.address.state} ${client.address.postcode}, ${client.address.country}`
                                    : 'N/A'}
                            </span></p>
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
                        {rosteringResponse?.data?.roster_history?.length > 0 ? (
                            rosteringResponse.data.roster_history.map((staff, index) => (
                                <div className="history-card-roster" key={index}>
                                    <img src={ContactIcon} alt="contactIcon" style={{ width: '24px', marginRight: '14px' }} />
                                    <div>
                                        <p className="staff-details">
                                            Staff Name: <span style={{ color: 'black' }}>{staff.staff_name}</span>
                                        </p>
                                        <p className="staff-details" style={{ fontWeight: '400' }}>{staff.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No roster history available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Available Staff */}
            <div className="roster-staff-section">
                <h3 className="roster-section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Available Staff</h3>
                <div className="roster-staff-cards">
                    {staffList.length > 0 ? (
                        staffList.map((staff, index) => (
                            <div
                                key={index}
                                className={`roster-staff-card ${selected.includes(index) ? "roster-selected" : ""}`}
                                onClick={() => handleSelect(index)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <div className="roster-staff-number">{index + 1}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'black' }}>{staff.name}</div>
                                </div>
                                <p className="staff-details" style={{ fontWeight: '400' }}>Rate: <span style={{ color: 'black' }}>{staff.hourly_rate}</span></p>
                                <p className="staff-details" style={{ fontWeight: '400' }}>Gender: <span style={{ color: 'black' }}>{staff.gender}</span></p>
                                <p className="staff-details" style={{ fontWeight: '400' }}>Age: <span style={{ color: 'black' }}>{staff.age}</span></p>
                            </div>
                        ))
                    ) : (
                        <p>No staff with role "SW" available.</p>
                    )}
                </div>
            </div>

            {/* Broadcast Button */}
            <button 
                className="roster-broadcast-btn" 
                onClick={handleBroadcast}
                disabled={broadcasting}
            >
                {broadcasting ? "Broadcasting..." : "Broadcast SMS to Staff"}
            </button>

            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-card">
                        <img src={SuccessCheck} alt="success" className="success-img" />
                        <p>Messages sent successfully!</p>
                        <button className="done-btn" onClick={() => setScreen(1)}>
                            <GoArrowLeft size={24} color="white" style={{ marginLeft: '6px' }} /> Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RosterDetails;
