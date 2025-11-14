import React, { useState } from "react";
import '../../../Styles/IncidentAuditing.css';
import UploadFiles from "../../UploadFiles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import star from '../../../Images/star.png';
import axios from "axios";
import Toggle from "react-toggle";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import PulsatingLoader from "../../PulsatingLoader";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const TASK_QUEUE = [
    "Analysing data",
    "Confirming incident reports are included",
    "Incident audit started",
    "Processing safety protocols",
    "Validating compliance requirements",
    "Generating final report",
];



const IncidentAuditing = (props) => {
    const [incidentAuditingFiles, setIncidentAuditingFiles] = useState([]);
    const [isIncidentAuditingProcessing, setIsIncidentAuditingProcessing] = useState(false);
    const [incidentAuditingProgress, setIncidentAuditingProgress] = useState(0);
    const [responseData, setResponseData] = useState(null);
    const [activeTab, setActiveTab] = useState("incident"); // default tab
    const [syncEnabled, setSyncEnabled] = useState(false);
    const [startDay, setStartDay] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [endDay, setEndDay] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [currentTask, setCurrentTask] = useState(TASK_QUEUE[0]);
    const [expandedSources, setExpandedSources] = useState([]);


    const isButtonDisabled = incidentAuditingFiles.length === 0;


    const dummyResponseData = {
        reportable_incidents: 23,
        total_incidents: 13,
        overall_compliance: 100,
        type_of_incident: [
            { type: "Medication", count: 5 },
            { type: "Behaviour", count: 2 },
            { type: "Injury", count: 3 },
            { type: "Workplace Safety", count: 1 },
            { type: "Documentation", count: 2 },
        ],
        incidents: [
            {
                client_name: "Aziza Seror",
                severity: "Moderate",
                incident_number: "INC-001",
                type: "Medication",
                date_reported: "2025-03-24",
                reported_by: "Phybian Chyin",
                reportable: false,
                summary:
                    "Client declined medication when staff attempted to administer it in the morning.",
                behavioural_analysis:
                    "Medication refusal might indicate non-compliance with regimen. Regular follow-up advised.",
                sources: [
                    {
                        title: "Incident Management - SEROR Aziza (50)",
                        description:
                            "Aziza entered the office asking for work phone...",
                    },
                    {
                        title: "Incident Report Data.xlsx",
                        description:
                            'To, Actions taken, Service manager comments, General manager comments, CEO comments, HR comments, Documents reviewed, Interviews undertaken, "Other (photos, sketches, previous incidents, personal observations)"',
                    },
                ],
            },
            {
                client_name: "Daniel Green",
                severity: "High",
                incident_number: "INC-002",
                type: "Behaviour",
                date_reported: "2025-03-22",
                reported_by: "Maya Ross",
                reportable: true,
                summary:
                    "Client became verbally aggressive towards staff during a scheduled activity.",
                behavioural_analysis:
                    "Aggression triggered by environmental noise. Reduce sensory stressors.",
                sources: [
                    {
                        title: "Incident Summary.docx",
                        description:
                            "Incident summary of verbal aggression recorded by staff.",
                    },
                    {
                        title: "Staff Report Form",
                        description:
                            "Detailed notes by on-duty staff describing incident sequence and actions taken.",
                    },
                ],
            },
            {
                client_name: "Linda Thomas",
                severity: "Low",
                incident_number: "INC-003",
                type: "Injury",
                date_reported: "2025-03-20",
                reported_by: "James Cole",
                reportable: false,
                summary:
                    "Minor bruise noticed on right arm during care routine.",
                behavioural_analysis:
                    "Likely accidental contact. Continue monitoring for changes.",
                sources: [
                    {
                        title: "Incident Report Data.xlsx",
                        description:
                            "Incident form showing injury details and follow-up recommendations.",
                    },
                ],
            },
            {
                client_name: "Mark Smith",
                severity: "Moderate",
                incident_number: "INC-004",
                type: "Workplace Safety",
                date_reported: "2025-03-18",
                reported_by: "Clara Johnson",
                reportable: true,
                summary:
                    "Spilled liquid found near entrance, possible slip hazard identified.",
                behavioural_analysis:
                    "Environmental hazard—ensure routine safety checks.",
                sources: [
                    {
                        title: "Safety Log 2025",
                        description:
                            "Entry noting safety hazard and immediate cleanup actions taken.",
                    },
                    {
                        title: "Incident Report Data.xlsx",
                        description:
                            "Record of environmental hazards and preventive measures logged.",
                    },
                ],
            },
        ],
    };



    const handleAnalyse = async () => {
        if (incidentAuditingFiles.length === 0) return;
        setIsIncidentAuditingProcessing(true);
        setIncidentAuditingProgress(2);


        let taskIndex = 0;
        setCurrentTask(TASK_QUEUE[taskIndex]);

        const taskInterval = setInterval(() => {
            taskIndex++;
            if (taskIndex < TASK_QUEUE.length) {
                setCurrentTask(TASK_QUEUE[taskIndex]);
            }
        }, 20000); // every 30 sec update task

        // Fake progress: increment 2% every 15ms up to 95%
        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += 0.15; // smooth & slow
            if (progressValue >= 95) progressValue = 70; // oscillate between 80–95%
            setIncidentAuditingProgress(progressValue);
        }, 80);

        try {
            const formData = new FormData();
            incidentAuditingFiles.forEach(file => formData.append("files", file));

            const response = await axios.post(
                "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/ndis/incidents_reporting/process",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log(response);
            setResponseData(response.data);
        } catch (error) {
            console.error("Error analysing files:", error);
            alert("Something went wrong while processing files.");
        } finally {
            clearInterval(interval);
            clearInterval(taskInterval);
            // Smoothly finish progress to 100%
            let progress = incidentAuditingProgress;
            const finishInterval = setInterval(() => {
                progress += 1;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(finishInterval);
                }
                setIncidentAuditingProgress(progress);
            }, 20);

            setTimeout(() => setIsIncidentAuditingProcessing(false), 300); // small delay for UX
        }
    };



    return (
        <>
            {/* 🌀 Show loader while processing */}
            {isIncidentAuditingProcessing ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                    {/* Replace with your custom loader if you have one */}
                    <PulsatingLoader currentTask={currentTask} progress={incidentAuditingProgress} />
                </div>
            ) : dummyResponseData ? (
                /* ✅ Show response reports after processing finishes */
                <>
                    {/* Header */}
                    <div className="incident-dashboard-header">
                        <div className="incident-h">Incident Audit Dashboard</div>
                        <div className="incident-dashboard-filters">
                            <input
                                type="text"
                                placeholder="Search Client or Description..."
                                className="incident-dashboard-search"
                            />
                            <select className="incident-dashboard-select">
                                <option value="ALL">All</option>
                                <option value="YES">Reportable</option>
                                <option value="NO">Non Reportable</option>
                            </select>
                            <select className="incident-dashboard-select">
                                <option value="ALL">All Types</option>
                                <option value="injury">Injury</option>
                                <option value="medication">Medication</option>
                                <option value="behaviour">Behaviour</option>
                                <option value="absconding">Absconding</option>
                                <option value="abuse_or_neglect">Abuse / Neglect</option>
                                <option value="restrictive_practice">Restrictive Practice</option>
                                <option value="near_miss">Near Miss</option>
                                <option value="property_damage">Property Damage</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="incident-dashboard-summary">
                        <div className="incident-dashboard-card">
                            <p>Reportable Incidents</p>
                            <h3>{dummyResponseData.reportable_incidents}</h3>
                        </div>
                        <div className="incident-dashboard-card">
                            <p>Total Incidents</p>
                            <h3>{dummyResponseData.total_incidents}</h3>
                        </div>
                        <div className="incident-dashboard-card">
                            <p>Overall Compliance</p>
                            <h3>{dummyResponseData.overall_compliance}%</h3>
                        </div>
                    </div>

                    {/* Type of Incident Table */}
                    <div className="incident-dashboard-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type Of Incident</th>
                                    <th>Numbers Reported</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyResponseData.type_of_incident.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.type}</td>
                                        <td>{row.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Incident Cards */}
                    <h3 className="incident-dashboard-section-title">Incidents</h3>
                    <div className="incident-dashboard-cards">
                        {dummyResponseData.incidents.map((incident, idx) => (
                            <div className="incident-dashboard-card-item" key={idx}>
                                <div className="incident-dashboard-card-header">
                                    <h4>{incident.client_name}</h4>
                                    <span
                                        className={`incident-dashboard-badge ${incident.reportable
                                            ? "incident-dashboard-badge-nonreportable"
                                            : "incident-dashboard-badge-nonreportable"
                                            }`}
                                    >
                                        {incident.reportable ? "Reportable" : "Non Reportable"}
                                    </span>
                                </div>

                                <div className="incident-dashboard-card-info">
                                    <p>
                                        <strong>Severity:</strong> {incident.severity}
                                    </p>
                                    <p>
                                        <strong>Incident#:</strong> {incident.incident_number}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {incident.type}
                                    </p>
                                    <p>
                                        <strong>Date Reported:</strong> {incident.date_reported}
                                    </p>
                                    <p>
                                        <strong>Reported By:</strong> {incident.reported_by}
                                    </p>
                                </div>

                                <div className="incident-dashboard-card-section">
                                    <strong>Summary</strong>
                                    <p>{incident.summary}</p>
                                </div>

                                <div className="incident-dashboard-card-section">
                                    <strong>Behavioural Analysis</strong>
                                    <p>{incident.behavioural_analysis}</p>
                                </div>

                                {/* Sources Section */}
                                <div className="incident-dashboard-card-sources">
                                    <button
                                        className="incident-dashboard-toggle-btn"
                                        onClick={() =>
                                            setExpandedSources((prev) =>
                                                prev.includes(idx)
                                                    ? prev.filter((i) => i !== idx)
                                                    : [...prev, idx]
                                            )
                                        }
                                    >
                                        {expandedSources.includes(idx) ? (
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '6px' }}>
                                                Hide Sources <IoIosArrowUp />
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '6px' }}>
                                                Show Sources <IoIosArrowDown />
                                            </div>
                                        )}
                                    </button>


                                    {expandedSources.includes(idx) && (
                                        <div className="incident-dashboard-sources-list">
                                            {incident.sources.map((src, i) => (
                                                <div key={i} className="incident-dashboard-source-item">
                                                    <h5>{src.title}</h5>
                                                    <p>{src.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* 📁 Default: show upload + info UI */
                <>
                    <div className="financial-header">
                        <div></div>
                        <div
                            style={{
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "100px",
                            }}
                        >
                            <h1 className="titless">INCIDENT AUDITING</h1>
                            <Tippy
                                content={
                                    <div
                                        style={{
                                            width: "450px",
                                            height: "auto",
                                            padding: "4px",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Incident report is mandatory.
                                    </div>
                                }
                                trigger="mouseenter focus click"
                                interactive={true}
                                placement="top"
                                theme="custom"
                            >
                                <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                    <IoMdInformationCircleOutline size={22} color="#5B36E1" />
                                </div>
                            </Tippy>
                        </div>
                        <div className="sync-toggle">
                            <div style={{ fontSize: "14px", fontWeight: "500", fontFamily: "Inter" }}>
                                Sync With Your System
                            </div>
                            <Toggle
                                checked={syncEnabled}
                                onChange={() => setSyncEnabled(!syncEnabled)}
                                className="custom-toggle"
                                icons={false}
                            />
                        </div>
                    </div>

                    {/* Info Table */}
                    <div className="info-table">
                        <div className="table-headerss">
                            <span>If You Upload This...</span>
                            <span>Our AI Will Instantly...</span>
                        </div>
                        <div className="table-rowss">
                            <div>Care Management System - Incident Report</div>
                            <ul>
                                <li>Collates evidence to support higher funding requests.</li>
                                <li>Uncover CAPA (Corrective and Preventive Actions) insights per client.</li>
                            </ul>
                        </div>
                        <div className="table-rowss">
                            <div>Behaviour Support System - Behaviour Support Report</div>
                            <ul>
                                <li>Auto-generates NDIS evidence summaries and reports.</li>
                                <li>Links incidents to unmet care or supervision needs.</li>
                            </ul>
                        </div>
                        <div className="table-rowss">
                            <div>Care Management System - Shift Notes Report</div>
                            <ul>
                                <li>Flags behavioural or mood changes in participants.</li>
                                <li>Receive a concise, person-centred support analysis report.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Date selectors */}
                    <div className="date-section">
                        {/* Start */}
                        <div className="date-picker">
                            <label style={{ fontSize: "14px", fontWeight: "500", fontFamily: "Inter" }}>
                                Report Start Date
                            </label>
                            <div className="date-inputs">
                                <select value={startDay} onChange={(e) => setStartDay(e.target.value)}>
                                    <option value="">DD</option>
                                    {Array.from({ length: 31 }, (_, i) => {
                                        const day = (i + 1).toString().padStart(2, "0");
                                        return (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                                    <option value="">MM</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthValue = (i + 1).toString().padStart(2, "0");
                                        const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
                                        return (
                                            <option key={monthValue} value={monthValue}>
                                                {monthName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* End */}
                        <div className="date-picker">
                            <label style={{ fontSize: "14px", fontWeight: "500", fontFamily: "Inter" }}>
                                Report End Date
                            </label>
                            <div className="date-inputs">
                                <select value={endDay} onChange={(e) => setEndDay(e.target.value)}>
                                    <option value="">DD</option>
                                    {Array.from({ length: 31 }, (_, i) => {
                                        const day = (i + 1).toString().padStart(2, "0");
                                        return (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                                    <option value="">MM</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthValue = (i + 1).toString().padStart(2, "0");
                                        const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
                                        return (
                                            <option key={monthValue} value={monthValue}>
                                                {monthName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* File uploader */}
                    <div className="uploader-grid" style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ width: "50%" }}>
                            <UploadFiles
                                files={incidentAuditingFiles}
                                setFiles={setIncidentAuditingFiles}
                                title={props.selectedRole}
                                subtitle="Upload .xlsx, .csv, .xls, .pdf or .doc file"
                                fileformat=".xlsx, .csv, .xls, .pdf, .doc"
                                removeFile={(index) =>
                                    setIncidentAuditingFiles((prev) => prev.filter((_, i) => i !== index))
                                }
                                multiple
                                isProcessing={isIncidentAuditingProcessing}
                            />
                        </div>
                    </div>

                    {/* Analyse button */}
                    <button
                        className="analyse-btn"
                        onClick={handleAnalyse}
                        disabled={isButtonDisabled || isIncidentAuditingProcessing}
                        style={{
                            backgroundColor: isButtonDisabled || isIncidentAuditingProcessing ? "#A1A1AA" : "#000",
                            cursor: isIncidentAuditingProcessing ? "not-allowed" : "pointer",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            Analyse <img src={star} alt="img" style={{ width: "20px", height: "20px" }} />
                        </div>
                    </button>
                </>
            )}
        </>
    );

};

export default IncidentAuditing;
