import React, { useState } from "react";
import '../../../Styles/IncidentAuditing.css';
import UploadFiles from "../../UploadFiles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import star from '../../../Images/star.png';
import axios from "axios";

const IncidentAuditing = (props) => {
    const [incidentAuditingFiles, setIncidentAuditingFiles] = useState([]);
    const [isIncidentAuditingProcessing, setIsIncidentAuditingProcessing] = useState(false);
    const [incidentAuditingProgress, setIncidentAuditingProgress] = useState(0);
    const [responseData, setResponseData] = useState(null);
    const [activeTab, setActiveTab] = useState("incident"); // default tab


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
                    {/* File uploader */}
                    <div className="selectedModule">{props.selectedRole}</div>
                    <div className="selectedModuleDescription">
                        Compliance dashboard mapped to NDIS Practice Standards/Incident Rules,
                        <br />showing overdue items, upcoming deadlines, and audit readiness.
                    </div>
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
                                content="Incident report is mandatory."
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
                                            <div key={key} style={{ marginBottom: "20px", background: "#ded8ff", padding: "14px 30px", borderRadius: "5px", textAlign: "left",}}>
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
                            <div style={{ background: "#f8f8f8", padding: "10px 30px", borderRadius: "5px",  textAlign: 'left' }}>
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
                                                textAlign:'left',
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
