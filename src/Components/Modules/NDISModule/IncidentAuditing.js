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


    const isButtonDisabled = incidentAuditingFiles.length === 0;

    const handleAnalyse = async () => {
        if (incidentAuditingFiles.length === 0) return;
        setIsIncidentAuditingProcessing(true);
        setIncidentAuditingProgress(2);

        // Fake progress: increment 2% every 15ms up to 95%
        const interval = setInterval(() => {
            setIncidentAuditingProgress(prev => (prev < 95 ? prev + 2 : prev));
        }, 3000);

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
            // Smoothly finish progress to 100%
            let progress = incidentAuditingProgress;
            const finishInterval = setInterval(() => {
                progress += 2;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(finishInterval);
                }
                setIncidentAuditingProgress(progress);
            }, 15);

            setTimeout(() => setIsIncidentAuditingProcessing(false), 300); // small delay for UX
        }
    };


    return (
        <>
            {!responseData && (
                <>
                    <div className="financial-header">
                        <div></div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center',marginLeft:'100px'}}>
                            <h1 className="titless">INCIDENT AUDITING</h1>
                            <Tippy
                                content={
                                    <div style={{ width: '450px', height: 'auto', padding: '4px', fontSize: '15px', fontWeight: '600' }}>
                                        Incident report is mandatory.
                                    </div>
                                }
                                trigger="mouseenter focus click"
                                interactive={true}
                                placement="top"
                                theme="custom"
                            >
                                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <IoMdInformationCircleOutline size={22} color="#5B36E1" />
                                </div>
                            </Tippy>
                        </div>
                        <div className="sync-toggle">
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    fontFamily: "Inter",
                                }}
                            >
                                Sync With Your System
                            </div>
                            <Toggle
                                checked={syncEnabled}
                                onChange={() => setSyncEnabled(!syncEnabled)}
                                className="custom-toggle"
                                icons={false} // ✅ No icons
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
                                <li>
                                Uncover CAPA (Corrective and Preventive Actions) insights per client.
                                </li>
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
                                <li>
                                Receive a concise, person-centred support analysis report.
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Date DropDown */}
                    <div className="date-section">
                        {/* Report Start Date */}
                        <div className="date-picker">
                            <label
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    fontFamily: "Inter",
                                }}
                            >
                                Report Start Date
                            </label>
                            <div className="date-inputs">
                                <select
                                    value={startDay}
                                    onChange={(e) => setStartDay(e.target.value)}
                                >
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
                                <select
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                >
                                    <option value="">MM</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthValue = (i + 1).toString().padStart(2, "0"); // 01, 02, 03
                                        const monthName = new Date(0, i).toLocaleString("en-US", {
                                            month: "short",
                                        }); // Jan, Feb
                                        return (
                                            <option key={monthValue} value={monthValue}>
                                                {monthName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Report End Date */}
                        <div className="date-picker">
                            <label
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    fontFamily: "Inter",
                                }}
                            >
                                Report End Date
                            </label>
                            <div className="date-inputs">
                                <select
                                    value={endDay}
                                    onChange={(e) => setEndDay(e.target.value)}
                                >
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
                                <select
                                    value={endMonth}
                                    onChange={(e) => setEndMonth(e.target.value)}
                                >
                                    <option value="">MM</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthValue = (i + 1).toString().padStart(2, "0"); // 01, 02, 03
                                        const monthName = new Date(0, i).toLocaleString("en-US", {
                                            month: "short",
                                        }); // Jan, Feb
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
                    <div className="uploader-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '50%' }}>
                            <UploadFiles
                                files={incidentAuditingFiles}
                                setFiles={setIncidentAuditingFiles}
                                title={props.selectedRole}
                                subtitle='Upload .xlsx, .csv, .xls, .pdf or .doc  file'
                                fileformat=".xlsx, .csv, .xls, .pdf, .doc"
                                removeFile={(index) => {
                                    setIncidentAuditingFiles(prev => prev.filter((_, i) => i !== index));
                                }}
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
                            backgroundColor: isButtonDisabled || isIncidentAuditingProcessing ? '#A1A1AA' : '#000',
                            cursor: isIncidentAuditingProcessing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isIncidentAuditingProcessing
                            ? `${incidentAuditingProgress}% Processing...`
                            : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Analyse<img src={star} alt='img' style={{ width: '20px', height: '20px' }} />
                            </div>}
                    </button>
                </>
            )}

            {/* Show response in tabs */}
            {responseData && (
                <div className="response-section">
                    {/* Tab buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                        <div className="tab-buttons">
                            <button
                                className={`report-tab ${activeTab === "incident" ? "active" : ""}`}
                                onClick={() => setActiveTab("incident")}
                            >
                                Incident Report
                            </button>
                            <button
                                className={`report-tab ${activeTab === "bsp" ? "active" : ""}`}
                                onClick={() => setActiveTab("bsp")}
                            >
                                BSP Analysis
                            </button>
                            <button
                                className={`report-tab ${activeTab === "final" ? "active" : ""}`}
                                onClick={() => setActiveTab("final")}
                            >
                                Final Report
                            </button>
                        </div>
                    </div>
                    {/* Tab content */}
                    <div className="tab-content" style={{ marginTop: "15px", marginBottom: '15px' }}>
                        {activeTab === "incident" && (
                            <div>
                                {responseData.incident_report
                                    ? Object.entries(responseData.incident_report)
                                        .filter(([key, value]) => typeof value === "string")
                                        .map(([key, value]) => (
                                            <div key={key} style={{ marginBottom: "20px", background: "#ded8ff", padding: "14px 30px", borderRadius: "5px", textAlign: "left", }}>
                                                <ReactMarkdown
                                                    children={value.replace(/```(?:\w+)?\n?/, "").replace(/```$/, "")}
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                                />
                                            </div>
                                        ))
                                    : "No Incident Report available"}
                            </div>
                        )}

                        {activeTab === "bsp" && (
                            <div style={{ background: "#f8f8f8", padding: "10px 30px", borderRadius: "5px", textAlign: 'left' }}>
                                <ReactMarkdown
                                    children={responseData.bsp_analysis_markdown || "No BSP Analysis available"}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                />
                            </div>
                        )}

                        {activeTab === "final" && (
                            <div>
                                {responseData.final_report && Object.keys(responseData.final_report).length > 0
                                    ? Object.entries(responseData.final_report).map(([client, report]) => (
                                        <div
                                            key={client}
                                            style={{
                                                marginBottom: "20px",
                                                background: "#ded8ff",
                                                padding: "10px 30px",
                                                textAlign: 'left',
                                                borderRadius: "5px",

                                            }}
                                        >
                                            <ReactMarkdown
                                                children={report.replace(/```(?:\w+)?\n?/, "").replace(/```$/, "")}
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                            />
                                        </div>
                                    ))
                                    : "No Final Report available"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default IncidentAuditing;
