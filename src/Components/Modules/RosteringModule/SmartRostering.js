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
    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-GB", options);
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
                                <div style={{padding:'0px 0px 8px 0px' }}>
                                    <li>Ensures 100% shift coverage with no missed or unfilled shifts.</li>
                                    <li>Sends automatic SMS invites to fill shifts instantly.</li>
                                </div>
                                <div style={{padding:'8px 0px' }}>
                                    <li>Analyses overtime patterns and past shift history.</li>
                                    <li>Matches client care needs with the best-suited staff.</li>
                                </div>
                                <div style={{padding:'8px 0px' }}>
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

                    <div className="rostering-input-box">
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
                        <p className="rostering-invite">• Invite a Team Member</p>
                    </div>
                </div>
            )}

            {screen === 2 && (
                <RosterDetails
                    setScreen={setScreen}
                    rosteringResponse={rosteringResponse}
                    API_BASE={API_BASE}
                />
            )}
        </>
    );
};

export default SmartRostering;