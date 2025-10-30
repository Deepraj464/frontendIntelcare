import React, { useState } from "react";
import "../../../Styles/RosterDetails.css";
import PersonalInformationIcon from '../../../Images/PersonalInformation.png';
import ContactIcon from '../../../Images/ContactNameicon.png';
import SuccessCheck from '../../../Images/SuccessCheck.png';
import { GoHistory, GoArrowLeft } from "react-icons/go";
import axios from "axios";

const RosterDetails = ({ setScreen, rosteringResponse, API_BASE, selectedClient }) => {
    const [selected, setSelected] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [broadcasting, setBroadcasting] = useState(false);

    // ✅ Handle both response structures (direct rostering vs filler+rostering)
    const isFillerResponse = rosteringResponse?.filler;

    // Extract client data based on response type
    const client = isFillerResponse
        ? rosteringResponse?.filler?.match?.matched_record || {}
        : rosteringResponse?.data?.client || {};

    // Extract ranked staff from correct path
    const rankedStaff = isFillerResponse
        ? rosteringResponse?.rostering_summary?.final_ranked || []
        : rosteringResponse?.data?.final_ranked || [];

    // Extract request details
    const request = isFillerResponse
        ? rosteringResponse?.filler?.llm?.inputs || {}
        : rosteringResponse?.data?.request || {};

    const message = rosteringResponse?.message || "";

    console.log("Client data:", client);
    console.log("Ranked staff:", rankedStaff);

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
            // ✅ FIXED: Use rankedStaff (displayed staff) instead of staffList
            const selectedStaff = selected.map(index => rankedStaff[index]);

            // Call broadcast endpoint
            const response = await axios.post(`${API_BASE}/broadcast`, {
                clientData: {
                    ClientId: client.ClientId || client.id || selectedClient?.clientId,
                    PreferredName: client.PreferredName || client.FirstName || selectedClient?.name
                },
                staffList: selected.map(index => ({
                    name: rankedStaff[index].name,
                    phone: "+61419015351",
                    role: "SW"
                })),
                rosteringManagers: [
                    {
                        name: "Kris",
                        phone: "+61419015351", // hardcoded RM number
                        role: "RM"
                    }
                ]
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

    // Helper function to format address
    const formatAddress = () => {
        if (client.Address1) {
            return `${client.Address1}${client.Address2 ? ', ' + client.Address2 : ''}, ${client.Suburb}, ${client.State} ${client.PostCode}`;
        }
        if (client.address) {
            return typeof client.address === 'string'
                ? client.address
                : `${client.address.street_number} ${client.address.street}, ${client.address.suburb}, ${client.address.state} ${client.address.postcode}, ${client.address.country}`;
        }
        return selectedClient?.address || 'N/A';
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
                            <p>ID: <span style={{ color: 'black' }}>
                                {client.ClientId || client.id || selectedClient?.clientId || request.client_id || 'N/A'}
                            </span></p>
                            <p>Name: <span style={{ color: 'black' }}>
                                {client.PreferredName || client.FirstName || client.client_name || selectedClient?.name || request.client_name || 'N/A'}
                            </span></p>
                            <p>DOB: <span style={{ color: 'black' }}>
                                {client.DateOfBirth || client.dob || 'N/A'}
                            </span></p>
                            <p>Gender: <span style={{ color: 'black' }}>
                                {client.Gender || client.gender || selectedClient?.sex || 'N/A'}
                            </span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Phone: <span style={{ color: 'black' }}>
                                {client.Phone1 || client.phone || selectedClient?.phone || 'N/A'}
                            </span></p>
                            <p>Plan Start Date: <span style={{ color: 'black' }}>
                                {client.ServiceStart || client.plan_start_date || request.shift_date || selectedClient?.date || 'N/A'}
                            </span></p>
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Address: <span style={{ color: 'black' }}>
                                {formatAddress()}
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
                            <p style={{ padding: '20px', color: '#666', fontSize: '14px' }}>No roster history available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Available Staff */}
            <div className="roster-staff-section">
                <h3 className="roster-section-title" style={{ textAlign: "left", marginBottom: "20px" }}>
                    Available Staff
                </h3>

                <div className="roster-staff-cards">
                    {rankedStaff.length > 0 ? (
                        rankedStaff.map((staff, index) => (
                            <div
                                key={index}
                                className={`roster-staff-card ${selected.includes(index) ? "roster-selected" : ""}`}
                                onClick={() => handleSelect(index)}
                            >
                                {/* Header with Rank & Name */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                    <div className="roster-staff-number">{index + 1}</div>
                                    <div style={{ fontSize: "15px", fontWeight: "600", color: "black" }}>
                                        {staff.name || "Unknown"}
                                    </div>
                                </div>

                                {/* Score */}
                                <p className="staff-details" style={{ fontWeight: "600", fontSize: "14px" }}>
                                    Score: <span style={{ color: "#6C4CDC", fontWeight: "700" }}>{staff.score || "N/A"}</span>
                                </p>

                                {/* Gender */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Gender: <span style={{ color: "black" }}>{staff.sex || staff.gender || "N/A"}</span>
                                </p>

                                {/* Phone */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Phone: <span style={{ color: "black" }}>{staff.phone || "N/A"}</span>
                                </p>

                                {/* Email */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Email: <span style={{ color: "black" }}>{staff.email || "N/A"}</span>
                                </p>

                                {/* Languages */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Languages: <span style={{ color: "black" }}>{staff.languages || "N/A"}</span>
                                </p>

                                {/* Experience Years */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Experience: <span style={{ color: "black" }}>{staff.experience_years ? `${staff.experience_years} years` : "N/A"}</span>
                                </p>

                                {/* Role Description */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Role: <span style={{ color: "black" }}>{staff.role_description || "N/A"}</span>
                                </p>

                                {/* Award Description (if not null) */}
                                {staff.award_desc && (
                                    <p className="staff-details" style={{ fontWeight: "400", fontSize: "13px" }}>
                                        Award: <span style={{ color: "black" }}>{staff.award_desc}</span>
                                    </p>
                                )}

                                {/* Location */}
                                <p className="staff-details" style={{ fontWeight: "400" }}>
                                    Location: <span style={{ color: "black" }}>{staff.location?.address || "N/A"}</span>
                                </p>

                                {/* Skill Descriptions */}
                                {staff.skill_descriptions && staff.skill_descriptions.length > 0 && (
                                    <div style={{ marginTop: "10px" }}>
                                        <p className="staff-details" style={{ fontWeight: "600", marginBottom: "6px" }}>
                                            Skills:
                                        </p>
                                        <ul style={{ paddingLeft: "20px", fontSize: "12px", color: "#555", margin: "0" }}>
                                            {staff.skill_descriptions.map((skill, idx) => (
                                                <li key={idx} style={{ marginBottom: "4px" }}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Reason (Highlighted at bottom) */}
                                {staff.reason && (
                                    <p className="staff-details" style={{
                                        fontWeight: "400",
                                        fontSize: "13px",
                                        marginTop: "12px",
                                        padding: "8px",
                                        background: "#f9f7ff",
                                        borderRadius: "6px",
                                        borderLeft: "3px solid #6C4CDC"
                                    }}>
                                        <strong>Why this staff?</strong> <span style={{ color: "black" }}>{staff.reason}</span>
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No staff available for this shift.</p>
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