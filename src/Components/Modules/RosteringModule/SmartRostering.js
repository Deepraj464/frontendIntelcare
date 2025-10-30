import React, { useEffect, useState } from "react";
import "../../../Styles/SmartRostering.css";
import { FiUploadCloud } from "react-icons/fi";
import SearchIcon from '../../../Images/SearchIcon.png';
import { BiSend } from "react-icons/bi";
import RosterDetails from "./RosterDetails";
import { RiDeleteBin6Line } from "react-icons/ri";
import fileIcon from '../../../Images/FileIcon.png';
import axios from "axios";

const API_BASE = "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net";

const SmartRostering = () => {
    const [screen, setScreen] = useState(1);
    const [query, setQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rosteringResponse, setRosteringResponse] = useState(null);
    const [rosteringMetrics, setRosteringMetrics] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-GB", options);

    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 3;
    const unallocatedClients = [
        {
            date: "12/10/2025",
            clientId: "2334",
            name: "John",
            sex: "Male",
            phone: "+61 234 223 234",
            email: "john23@gmail.com",
            address: "45 Sydney Street",
            startTime: "12:00hrs",
            minutes: "24min",
            onHoldType: "Cancelled",
            onHoldNote: "Cancelled by Sam",
        },
        {
            date: "13/10/2025",
            clientId: "4567",
            name: "Alice",
            sex: "Female",
            phone: "+61 298 765 123",
            email: "alice@gmail.com",
            address: "19 Greenway Ave",
            startTime: "14:30hrs",
            minutes: "30min",
            onHoldType: "Rescheduled",
            onHoldNote: "Rescheduled by Manager",
        },
        {
            date: "14/10/2025",
            clientId: "5643",
            name: "Robert",
            sex: "Male",
            phone: "+61 412 888 990",
            email: "robert@gmail.com",
            address: "72 City View Rd",
            startTime: "10:15hrs",
            minutes: "45min",
            onHoldType: "Pending",
            onHoldNote: "Awaiting Staff Confirmation",
        },
        {
            date: "15/10/2025",
            clientId: "8876",
            name: "Sara",
            sex: "Female",
            phone: "+61 234 222 777",
            email: "sara@gmail.com",
            address: "120 Hillside Blvd",
            startTime: "09:00hrs",
            minutes: "60min",
            onHoldType: "Cancelled",
            onHoldNote: "Client Not Available",
        },
        {
            date: "16/10/2025",
            clientId: "7789",
            name: "Michael",
            sex: "Male",
            phone: "+61 210 456 789",
            email: "michael@gmail.com",
            address: "88 Riverbank Lane",
            startTime: "16:00hrs",
            minutes: "40min",
            onHoldType: "Hold",
            onHoldNote: "Awaiting Shift Approval",
        },
        {
            date: "17/10/2025",
            clientId: "9921",
            name: "Emily",
            sex: "Female",
            phone: "+61 245 334 123",
            email: "emily@gmail.com",
            address: "31 Parkside Close",
            startTime: "11:30hrs",
            minutes: "35min",
            onHoldType: "Cancelled",
            onHoldNote: "Cancelled by Scheduler",
        },
    ];
    useEffect(() => {
        const fetchRosteringData = async () => {
            try {
                const response = await axios.get(
                    "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/get-header-metrices"
                );
                setRosteringMetrics(response.data);
            } catch (error) {
                console.error("Error fetching rostering data:", error);
            }
        };

        fetchRosteringData();
    }, []);
    // console.log("rosteringResponse",rosteringMetrics)
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // take all selected files
        setSelectedFile((prev) => {
            const combined = [...prev, ...files];
            if (combined.length > 2) {
                alert("You can only upload a maximum of 2 files");
                return combined.slice(0, 2); // keep only first 2
            }
            return combined;
        });
    };

    const removeFile = (index) => {
        setSelectedFile((prev) => prev.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        if (startIndex + visibleCount < unallocatedClients.length) {
            setStartIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex((prev) => prev - 1);
        }
    };

    const visibleClients = unallocatedClients.slice(startIndex, startIndex + visibleCount);


    useEffect(() => {
        if (screen === 1) {
            setQuery("");
            setSelectedFile([]);
        }
    }, [screen]);
    // 🔹 Call backend rostering API (Controller 1)
    const handleSubmit = async () => {
        if (selectedFile.length !== 2) {
            alert("Please upload exactly 2 files before sending.");
            return;
        }
        if (!query) {
            alert("Please enter a query first.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            selectedFile.forEach((file) => formData.append("files", file));
            formData.append("prompt", query);

            // Use the correct endpoint for rostering
            const response = await axios.post(`${API_BASE}/fetch-staff-client`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Rostering API response:", response.data);
            if (response.data)
                setRosteringResponse(response.data);
            setScreen(2);
        } catch (error) {
            console.error("Error calling rostering API:", error);
            alert("Failed to fetch roster. Try again.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {screen === 1 && (
                <div className="rostering-dashboard">
                    <h2 className="rostering-date">{formattedDate}</h2>
                    <div className="info-table" style={{ marginBottom: '40px' }}>
                        <div className="table-headerss">
                            <span>If You Upload This...</span>
                            <span>Our AI Will Instantly...</span>
                        </div>
                        <div className="table-rowss">
                            <div>Fortnightly Roster Schedule.</div>
                            <ul>
                                <div style={{ padding: '0px 0px 8px 0px' }}>
                                    <li>Ensures 100% shift coverage with no missed or unfilled shifts.</li>
                                    <li>Sends automatic SMS invites to fill shifts instantly.</li>
                                </div>
                                <div style={{ padding: '8px 0px' }}>
                                    <li>Analyses overtime patterns and past shift history.</li>
                                    <li>Matches client care needs with the best-suited staff.</li>
                                </div>
                                <div style={{ padding: '8px 0px' }}>
                                    <li>Factors in hourly rates, distance, and availability.</li>
                                    <li>Recommends the top 5 most cost-efficient staff for each shift.</li>
                                    <li>Keeps rosters profitable, compliant, and fully staffed in minutes.</li>
                                </div>
                            </ul>
                        </div>
                    </div>

                    <div className="rostering-stats-row">
                        <div className="rostering-stat-card">
                            <p>Shift Coverage %</p>
                            <span className="rostering-circle rostering-green">{rosteringMetrics?.shift_coverage ? rosteringMetrics?.shift_coverage : 2}</span>
                        </div>

                        <div className="rostering-stat-card">
                            <p>At-Risk Shifts</p>
                            <span className="rostering-circle rostering-orange">{rosteringMetrics?.Unallocated_shift ? rosteringMetrics?.Unallocated_shift : 2}</span>
                        </div>

                        <div className="rostering-stat-card">
                            <p>Staff Utilisation %</p>
                            <span className="rostering-circle rostering-green">{rosteringMetrics?.staff_utilisation ? rosteringMetrics?.staff_utilisation : 2}</span>
                        </div>
                        <div className="rostering-upload-card">
                            <div>
                                {selectedFile.map((file, index) => (
                                    <div key={index} style={{ border: '1px solid #6c4cdc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', padding: '8px 10px', marginBottom: '4px', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="file-icon">
                                                <img src={fileIcon} height={15} width={10} alt="Zip" />
                                            </div>
                                            <div style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: '600', marginRight: '10px' }}>
                                                {file.name.length > 20 ? file.name.slice(0, 15) + "..." : file.name}
                                            </div>
                                        </div>
                                        <div className="remove-btn" onClick={() => removeFile(index)}>
                                            <RiDeleteBin6Line size={16} color="red" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!selectedFile.length && (
                                <>
                                    <div className="upload-icon">
                                        <FiUploadCloud color="#6C4CDC" />
                                    </div>
                                    <p>Browse Files</p>
                                    <small>Format: .xlsx, .csv, .xls only</small>
                                </>
                            )}
                            <div style={{ marginTop: "12px" }}>
                                <label htmlFor="rostering-file-upload" className="rostering-upload-label">
                                    Browse Files
                                    <input
                                        type="file"
                                        id="rostering-file-upload"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                        multiple
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="unallocated-shifts-section" style={{ marginTop: "40px" }}>
                        <h3
                            style={{
                                fontFamily: "Inter",
                                fontWeight: "600",
                                marginBottom: "20px",
                                textAlign: 'left'
                            }}
                        >
                            Unallocated Shifts
                        </h3>

                        {/* Outer scrollable wrapper */}
                        <div
                            id="unallocated-scroll-container"
                            style={{
                                position: "relative",
                                width: "100%",
                                margin: "0 auto",
                                overflowX: "auto",
                                overflowY: "hidden",
                                scrollBehavior: "smooth",
                                scrollbarWidth: "thin",
                                paddingBottom: "10px",
                                paddingTop: '10px'
                            }}
                        >
                            {/* Inner flex container */}
                            <div
                                className="unallocated-shifts-cards"
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    width: `${unallocatedClients.length * 330}px`, // enough width for all cards
                                    transition: "transform 0.6s ease-in-out",
                                }}
                            >
                                {unallocatedClients.map((client, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            flex: "0 0 300px",
                                            border: "1px solid #6c4cdc",
                                            borderRadius: "10px",
                                            padding: "14px",
                                            background: "#fff",
                                            fontFamily: "Inter",
                                            textAlign: "left",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                            userSelect: "none",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                            scrollbarWidth:'none'
                                            
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = " 0 0 10px rgba(86, 21, 208, 0.4)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                                        }}
                                        onClick={() => {
                                            setSelectedClient(client);
                                            setScreen(2);
                                        }}
                                    >
                                        <p style={{ marginBottom: '8px' }}><strong>Date:</strong> {client.date}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Client ID:</strong> {client.clientId}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Client Name:</strong> {client.name}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Sex:</strong> {client.sex}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> {client.phone}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {client.email}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Address:</strong> {client.address}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Start Time:</strong> {client.startTime}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Minutes:</strong> {client.minutes}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>OnHoldType:</strong> {client.onHoldType}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>OnHoldNote:</strong> {client.onHoldNote}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination / Arrow controls */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "20px",
                                gap: "10px",
                            }}
                        >
                            <button
                                onClick={() => {
                                    const container = document.getElementById("unallocated-scroll-container");
                                    container.scrollBy({ left: -320, behavior: "smooth" });
                                    setStartIndex((prev) => Math.max(prev - 1, 0));
                                }}
                                disabled={startIndex === 0}
                                style={{
                                    background: "#f1f0ff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    cursor: "pointer",
                                    opacity: startIndex === 0 ? 0.5 : 1,
                                    fontSize: "18px",
                                }}
                            >
                                &#8249;
                            </button>

                            <span style={{ fontFamily: "Inter", fontSize: "14px" }}>
                                {Math.min(startIndex + visibleCount, unallocatedClients.length)} /{" "}
                                {unallocatedClients.length}
                            </span>

                            <button
                                onClick={() => {
                                    const container = document.getElementById("unallocated-scroll-container");
                                    container.scrollBy({ left: 320, behavior: "smooth" });
                                    setStartIndex((prev) =>
                                        Math.min(prev + 1, unallocatedClients.length - visibleCount)
                                    );
                                }}
                                disabled={startIndex + visibleCount >= unallocatedClients.length}
                                style={{
                                    background: "#f1f0ff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    cursor: "pointer",
                                    opacity:
                                        startIndex + visibleCount >= unallocatedClients.length ? 0.5 : 1,
                                    fontSize: "18px",
                                }}
                            >
                                &#8250;
                            </button>
                        </div>
                    </div>


                    <div className="rostering-input-box">
                        <div style={{ fontWeight: '600', fontSize: '16px', fontFamily: 'Inter', marginBottom: '24px' }}>Want to roster for anybody specific?</div>
                        <div className="rostering-input-wrapper">
                            <div className="rostering-search-icon">
                                <img src={SearchIcon} alt='SearchIcon' style={{ width: '21px', height: '20px' }} />
                            </div>
                            <textarea
                                rows={6}
                                placeholder="I am looking for..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button className="rostering-send-btn" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Sending..." : <BiSend />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {screen === 2 && (
                <RosterDetails
                    setScreen={setScreen}
                    rosteringResponse={rosteringResponse}
                    API_BASE={API_BASE}
                    selectedClient={selectedClient}
                />
            )}
        </>
    );
};

export default SmartRostering;