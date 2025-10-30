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

const SmartRostering = (props) => {
    console.log("props in smart rostering", props)
    const userEmail = props?.user?.email
    const [screen, setScreen] = useState(1);
    const [query, setQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);
    const [rosteringResponse, setRosteringResponse] = useState(null);
    const [rosteringMetrics, setRosteringMetrics] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [unallocatedClients, setUnallocatedClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loading, setLoading] = useState(false);
    const [promptLoading, setPromptLoading] = useState(false);

    const today = new Date();
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = today.toLocaleDateString("en-GB", options);

    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 3;
    const [visualCareCreds, setVisualCareCreds] = useState(null);

    useEffect(() => {
        const fetchVisualCareCreds = async () => {
            try {
                const res = await axios.get(`${API_BASE}/get-visualcare-creds`);
                console.log("res", res)
                if (res.data?.success && res.data?.data?.length > 0) {
                    // Find the record where logged-in user's email is in rosteringManager.emails[]
                    const matched = res.data.data.find((entry) =>
                        entry.rosteringManager?.emails?.includes(userEmail)
                    );

                    if (!matched) {
                        alert("Access denied. Your email is not authorized to use Smart Rostering.");
                        return;
                    }

                    setVisualCareCreds(matched.creds); // ✅ Save credentials for later API use
                    console.log("✅ Authorized VisualCare credentials loaded:", matched.creds);
                } else {
                    alert("No VisualCare credentials found in the database.");
                }
            } catch (err) {
                console.error("❌ Error fetching VisualCare creds:", err);
                alert("Failed to load VisualCare credentials.");
            }
        };

        if (userEmail) fetchVisualCareCreds();
    }, [userEmail]);

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
    // 🔹 Fetch unallocated shifts from API
    console.log("visualCareCreds", visualCareCreds)
    useEffect(() => {
        const fetchUnallocatedShifts = async () => {
            setLoadingClients(true);
            try {
                // ✅ Add your credentials and query params dynamically
                console.log("visual care creds", visualCareCreds)
                const user = visualCareCreds?.user;
                const key = visualCareCreds?.key;
                const secret = visualCareCreds?.secret;
                const days = 3; // or make this dynamic later

                const res = await axios.get(
                    `${API_BASE}/getUnallocatedShifts`,
                    {
                        params: { user, key, secret },
                    }
                );

                console.log("Fetched unallocated shifts:", res.data);

                const grouped = res.data.grouped || {};
                const allClients = Object.entries(grouped).flatMap(([label, shifts]) =>
                    shifts.map((shift) => ({
                        date: shift.start_time?.split(" ")[0] || "-",
                        clientId: shift.id || "-",
                        name: shift.client_name || "Unknown",
                        sex: shift.sex || "-",
                        phone: shift.phone || "-",
                        email: shift.email || "-",
                        address: shift.address || "-",
                        startTime: shift.start_time?.split(" ")[1] || "-",
                        minutes: shift.minutes ? `${shift.minutes} min` : "-",
                        onHoldType: shift.onhold_type || "-",
                        onHoldNote: shift.onhold_note || "-",
                        dateOfService: shift.date_of_service || "-",
                        label, // today / tomorrow etc.
                    }))
                );

                setUnallocatedClients(allClients);
            } catch (error) {
                console.error("Error fetching unallocated shifts:", error);
            } finally {
                setLoadingClients(false);
            }
        };

        fetchUnallocatedShifts();
    }, [visualCareCreds]);


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
    const handleClientClick = async (client) => {
        setLoading(true);
        try {
            const user = visualCareCreds?.user;
            const key = visualCareCreds?.key;
            const secret = visualCareCreds?.secret;

            const inputs = {
                client_id: client.clientId,
                shift_date: client.dateOfService,
                shift_start: client.startTime,
                shift_minutes: client.minutes?.replace(" min", "") || 0,
            };

            console.log("📤 Sending to Smart Rostering Controller:", inputs);

            const response = await axios.post(
                `${API_BASE}/run-smart-rostering?user=${user}&key=${key}&secret=${secret}`,
                { inputs },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Smart Rostering Response:", response.data);

            // ⏳ Only now switch to screen 2 after data is ready
            if (response.data?.data?.final_ranked?.length > 0) {
                setRosteringResponse(response?.data);
                setSelectedClient(client);
                setScreen(2);
            } else {
                alert("No staff found for this shift.");
            }
        } catch (error) {
            console.error("❌ Error in Smart Rostering:", error);
            alert("Failed to run smart rostering.");
        } finally {
            setLoading(false);
        }
    };



const handleSubmit = async () => {
  if (selectedFile.length !== 2) {
    alert("Please upload exactly 2 files before sending.");
    return;
  }

  if (!query.trim()) {
    alert("Please enter a query first.");
    return;
  }

  setPromptLoading(true);
  try {
    const user = visualCareCreds?.user;
    const key = visualCareCreds?.key;
    const secret = visualCareCreds?.secret;

    console.log("📤 Sending to Filler + Smart Rostering Controller:", query);

    const response = await axios.post(
      `${API_BASE}/run-manifest-filler?user=${user}&key=${key}&secret=${secret}`,
      { prompt: query },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Combined Filler + Smart Rostering Response:", response.data);

    // ✅ Corrected access path for ranked staff
    const rankedStaff = response.data?.rostering_summary?.final_ranked || [];

    if (Array.isArray(rankedStaff) && rankedStaff.length > 0) {
      // Store entire response for details screen
      setRosteringResponse(response.data);

      // ✅ Extract client info from filler.llm.inputs
      const fillerInputs = response.data?.filler?.llm?.inputs || {};
      const selectedClientData = {
        name: fillerInputs.client_name || "Unknown",
        dateOfService: fillerInputs.shift_date || "-",
        startTime: fillerInputs.shift_start || "-",
        minutes: fillerInputs.shift_minutes
          ? `${fillerInputs.shift_minutes} min`
          : "-",
      };

      setSelectedClient(selectedClientData);
      setScreen(2); // move to details view
    } else {
      console.warn("⚠️ No ranked staff returned:", rankedStaff);
      alert("No staff found for this shift.");
    }
  } catch (error) {
    console.error("❌ Error running filler-smart-rostering:", error);
    alert("Failed to run manifest filler + smart rostering.");
  } finally {
    setPromptLoading(false);
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
                                textAlign: "left",
                            }}
                        >
                            Unallocated Shifts
                        </h3>

                        {loadingClients ? (
                            <p>Loading unallocated shifts...</p>
                        ) : unallocatedClients.length === 0 ? (
                            <p>No unallocated shifts found.</p>
                        ) : (
                            <>
                                {/* Scrollable Container */}
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
                                        paddingTop: "10px",
                                    }}
                                >
                                    <div
                                        className="unallocated-shifts-cards"
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            width: `${unallocatedClients.length * 330}px`,
                                            transition: "transform 0.6s ease-in-out",
                                        }}
                                    >
                                        {unallocatedClients
                                            .map((client, index) => (
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
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-5px)";
                                                        e.currentTarget.style.boxShadow =
                                                            "0 0 10px rgba(86, 21, 208, 0.4)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow =
                                                            "0 2px 6px rgba(0,0,0,0.08)";
                                                    }}
                                                    onClick={() => handleClientClick(client)}

                                                >
                                                    <p><strong>Date:</strong> {client.date}</p>
                                                    <p><strong>Date Of Service:</strong> {client.dateOfService}</p>
                                                    <p><strong>Client ID:</strong> {client.clientId}</p>
                                                    <p><strong>Client Name:</strong> {client.name}</p>
                                                    <p><strong>Sex:</strong> {client.sex}</p>
                                                    <p><strong>Phone:</strong> {client.phone}</p>
                                                    <p><strong>Email:</strong> {client.email}</p>
                                                    <p><strong>Address:</strong> {client.address}</p>
                                                    <p><strong>Start Time:</strong> {client.startTime}</p>
                                                    <p><strong>Minutes:</strong> {client.minutes}</p>
                                                    <p><strong>OnHoldType:</strong> {client.onHoldType}</p>
                                                    <p><strong>OnHoldNote:</strong> {client.onHoldNote}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Pagination */}
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
                                            const container = document.getElementById(
                                                "unallocated-scroll-container"
                                            );
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
                                            const container = document.getElementById(
                                                "unallocated-scroll-container"
                                            );
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
                            </>
                        )}
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
                            <button className="rostering-send-btn" onClick={handleSubmit} disabled={promptLoading}>
                                {promptLoading ? "Sending..." : <BiSend />}
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
            {loading && (
                <div className="overlay">
                    <div className="spinner"></div>
                    <p>Running Smart Rostering...</p>
                </div>
            )}
        </>
    );
};

export default SmartRostering;