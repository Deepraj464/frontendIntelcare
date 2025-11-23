import React, { useEffect, useState } from "react";
import "../../../Styles/RosterDetails.css";
import PersonalInformationIcon from '../../../Images/PersonalInformation.png';
import ContactIcon from '../../../Images/ContactNameicon.png';
import SuccessCheck from '../../../Images/SuccessCheck.png';
import { GoHistory, GoArrowLeft } from "react-icons/go";
import axios from "axios";
import clockCircleIcon from "../../../Images/clock circle.png"
import clickHandIcon from "../../../Images/clock hand.png"
import star_icon from "../../../Images/rostering_star.png"
const RosterDetails = ({ setScreen, rosteringResponse, API_BASE, selectedClient, visualCareCreds }) => {
    // console.log("rostering response", rosteringResponse)
    // console.log("selectedClient",selectedClient)
    const [selected, setSelected] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [broadcasting, setBroadcasting] = useState(false);
    const [timesheetHistory, setTimesheetHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showClashing, setShowClashing] = useState(false);
    // console.log("rosteringResponse",rosteringResponse) 
    // Handle both response structures (direct rostering vs filler+rostering)
    const isFillerResponse = rosteringResponse?.filler;
    const clashingList = rosteringResponse?.preffered_worker_clashing_roster || [];
    const formatDateTime = (isoString) => {
        if (!isoString) return "N/A";

        const date = new Date(isoString);

        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        };

        return date.toLocaleString("en-AU", options);
    };

    const client = isFillerResponse
        ? rosteringResponse?.filler?.match?.matched_record || {}
        : rosteringResponse?.data?.client || {};

    // console.log('Client',selectedClient.prefSkillsDescription);
    const rankedStaff = isFillerResponse
        ? rosteringResponse?.rostering_summary?.final_ranked || []
        : rosteringResponse?.data?.final_ranked || [];

    // Extract request details
    const request = isFillerResponse
        ? rosteringResponse?.filler?.llm?.inputs || {}
        : rosteringResponse?.data?.request || {};

    const message = rosteringResponse?.message || "";

    // console.log("Client data:", client);
    // console.log("Ranked staff:", rankedStaff);

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
        // Get selected staff from rankedStaff
        const selectedStaff = selected.map(index => rankedStaff[index]);

        const payload = {
            clientData: {
                ClientId: client.ClientId || client.id || selectedClient?.clientId,
                PreferredName: client.PreferredName || client.FirstName || selectedClient?.name,
                startTime: request.shift_start_time || request.shift_start || request.startTime,  
                minutes: request.minutes || request.duration || selectedClient?.minutes || 60
            },

            staffList: selectedStaff.map(s => ({
                name: s.name,
                phone: "7020737478",     // using real phone
                role: "SW"
            })),

            rosteringManagers: [
                {
                    name: "Kris",
                    phone: "8618562951",
                    role: "RM"
                }
            ]
        };

        console.log("📤 Broadcast Payload:", payload);

        const response = await axios.post(`${API_BASE}/sampleBroadcast`, payload);

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
    // console.log(selectedClient)
    useEffect(() => {
        const fetchTimesheetHistory = async () => {
            if (!selectedClient || !visualCareCreds) return;

            setLoadingHistory(true);
            try {
                // 🕓 Dynamic date range (last 10 days)
                const today = new Date();
                const tenDaysAgo = new Date(today);
                tenDaysAgo.setDate(today.getDate() - 10);

                // Format as YYYY-MM-DD
                const formatDate = (date) => date.toISOString().split("T")[0];
                const fromDate = formatDate(tenDaysAgo);
                const toDate = formatDate(today);

                const { user, key, secret } = visualCareCreds;

                const res = await axios.get(`${API_BASE}/api/getTimesheets`, {
                    params: { user, key, secret, fromDate, toDate },
                });

                if (res.data?.success) {
                    // Normalize data
                    let allRecords = Array.isArray(res.data.data)
                        ? res.data.data
                        : res.data.data?.items || [];

                    // Sort by date (descending) and take latest 10
                    allRecords = allRecords
                        .sort((a, b) => new Date(b.DateOfService) - new Date(a.DateOfService))
                        .slice(0, 10);

                    setTimesheetHistory(allRecords);
                } else {
                    console.warn("⚠️ No timesheet data returned:", res.data);
                    setTimesheetHistory([]);
                }
            } catch (err) {
                console.error("❌ Error fetching timesheet history:", err);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchTimesheetHistory();
    }, [selectedClient, visualCareCreds]);
    // console.log("time sheet history", timesheetHistory)
    const ClockIcon = () => (
        <div
            style={{
                position: "relative",
                width: "14px", // 🔹 smaller icon size
                height: "14px",
                marginRight: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src={clockCircleIcon}
                alt="Clock Circle"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
            />
            <img
                src={clickHandIcon}
                alt="Clock Hand"
                style={{
                    position: "absolute",
                    width: "55%",
                    height: "55%",
                    objectFit: "contain",
                    marginLeft: "2px",
                    marginBottom: "1px",
                }}
            />
        </div>
    );
    return (
        <div className="roster-page">
            {/* Layout wrapper */}
            <div className="roster-layout">
                <div
                    className="roster-back-btn"
                    onClick={() => setScreen(1)}
                >
                    <GoArrowLeft size={22} color="#6C4CDC" />
                    <span>Back</span>
                </div>
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4' }}>
                            <p>Address: <span style={{ color: 'black' }}>
                                {formatAddress()}
                            </span></p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '54px', gap: '42px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E4E4E4', textAlign: 'left' }}>
                            <p>Skills: <span style={{ color: 'black' }}>
                                {selectedClient.prefSkillsDescription?.join(', ')}
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
                        {loadingHistory ? (
                            <p style={{ padding: '20px', color: '#666' }}>Loading timesheet history...</p>
                        ) : timesheetHistory.length > 0 ? (
                            timesheetHistory.map((item, index) => (
                                <div className="history-card-roster" key={index}>
                                    <img
                                        src={ContactIcon}
                                        alt="contactIcon"
                                        style={{ width: '24px', marginRight: '14px' }}
                                    />
                                    <div>
                                        <p className="staff-details">
                                            <strong>Date of Service:</strong>{' '}
                                            <span style={{ color: 'black' }}>
                                                {item.DateOfService || 'N/A'}
                                            </span>
                                        </p>
                                        <p className="staff-details">
                                            <strong>Worker Name:</strong>{' '}
                                            <span style={{ color: 'black' }}>
                                                {item.WorkerName ?? 'N/A'}
                                            </span>
                                        </p>
                                        <p className="staff-details">
                                            <strong>Minutes:</strong>{' '}
                                            <span style={{ color: 'black' }}>
                                                {item.Minutes ?? 'N/A'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ padding: '20px', color: '#666', fontSize: '14px' }}>
                                No recent timesheet records found.
                            </p>
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
                        rankedStaff.map((staff, index) => {
                            // if (!staff.eliminated_reason || staff.eliminated_reason.length === 0) {
                            //     staff.eliminated_reason = [
                            //         "Worked extra night shifts throughout the week due to a last-minute schedule change and staff shortage."
                            //     ];
                            // }
                            // if (!staff.overtime_hours) staff.overtime_hours = 3;
                            return (
                                <div
                                    key={index}
                                    className={`roster-staff-card ${selected.includes(index) ? "roster-selected" : ""}`}
                                    onClick={() => handleSelect(index)}
                                >
                                    {/* Header with Rank & Name */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", position: "relative" }}>
                                        <div className="roster-staff-number">{index + 1}</div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                                            <div style={{ fontSize: "15px", fontWeight: "600", color: "black" }}>
                                                {staff.name || "Unknown"}
                                            </div>

                                            {staff.preferred === "true" && (
                                                <img
                                                    src={star_icon}
                                                    alt="Preferred"
                                                    style={{
                                                        width: "18px",
                                                        height: "18px",
                                                        objectFit: "contain",
                                                        marginLeft: "50px",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Overtime and Elimination Info */}
                                    {(staff.overtime_hours > 0 || staff.eliminated_reason?.[0]) && (
                                        <div
                                            style={{
                                                marginTop: "10px",
                                                padding: "8px",
                                                background: "#f9f7ff",
                                                borderRadius: "6px",
                                                borderLeft: "3px solid #6C4CDC",
                                            }}
                                        >
                                            {staff.overtime_hours > 0 && (
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <ClockIcon />
                                                    <p className="staff-details" style={{ fontSize: "13px", fontWeight: "500", margin: 0 }}>
                                                        <strong>Overtime Hours:</strong>{" "}
                                                        <span style={{ color: "black" }}>{staff.overtime_hours}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {staff.eliminated_reason?.[0] && (
                                                <p className="staff-details" style={{ fontSize: "13px", fontWeight: "500", color: "black" }}>
                                                    <strong>Overtime Reason:</strong>{" "}
                                                    <span>{staff.eliminated_reason[0]}</span>
                                                </p>
                                            )}
                                        </div>
                                    )}

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
                                    {staff?.skills && staff?.skills.length > 0 && (
                                        <div style={{ marginTop: "10px" }}>
                                            <p className="staff-details" style={{ fontWeight: "600", marginBottom: "6px" }}>
                                                Skills:
                                            </p>
                                            <ul style={{ paddingLeft: "20px", fontSize: "12px", color: "#555", margin: "0" }}>
                                                {staff?.skills.map((skill, idx) => (
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
                            )
                        })
                    ) : (
                        <p>No staff available for this shift.</p>
                    )}
                </div>
            </div>
            {/* Preferred Worker Clashing Roster */}
            {clashingList.length > 0 && (
                <div className="clashing-container">

                    {/* Header Row */}
                    <div
                        className="clashing-header"
                        onClick={() => setShowClashing(!showClashing)}
                    >
                        <h3 className="clashing-title">
                            Preferred Worker – Clashing Roster
                        </h3>

                        <span className="clashing-toggle">
                            {showClashing ? "−" : "+"}
                        </span>
                    </div>

                    {/* Expandable List */}
                    {showClashing && (
                        <div className="clashing-list">
                            {clashingList.map((item, index) => (
                                <div className="clashing-item" key={index}>
                                    <p className="clashing-text">
                                        <strong>Worker:</strong> {item.worker_name}
                                    </p>
                                    <p className="clashing-text">
                                        <strong>Client ID:</strong> {item.client_id}
                                    </p>
                                    <p className="clashing-text">
                                        <strong>Start:</strong> {formatDateTime(item.start)}
                                    </p>
                                    <p className="clashing-text">
                                        <strong>End:</strong> {formatDateTime(item.end)}
                                    </p>
                                    <p className="clashing-text">
                                        <strong>Status:</strong> {item.status}
                                    </p>
                                    <p className="clashing-text">
                                        <strong>Minutes:</strong> {item.Minutes}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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

