import React, { useState, useEffect } from "react";
import "../Styles/UploaderPage.css";
import UploadIcon from '../../src/Images/upload.png';
import ExpandIcon from '../../src/Images/ExpandIcon.png';
import ExploreIcon from '../../src/Images/ExploreIcon.png';
import BlackExpandIcon from '../../src/Images/BlackExpandIcon.png';
import ExcelSheetsLogo from '../../src/Images/ExcelSheetsLogo.png';
import ZipIcon from '../../src/Images/zipIcon.png';
import CrossIcon from '../../src/Images/CrossIcon.png';
import PersonIcon from '../../src/Images/Personicon.png';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { BiLinkExternal } from "react-icons/bi";
import { BiLockAlt } from "react-icons/bi";
import Modal from "./Modal";
import ReportViewer from "./ReportViewer";
import SignIn from "./SignIn";
import MarkdownParser from "./MarkdownParser";
import { auth, signOut } from "../firebase";
import JSZip from "jszip";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Sidebar = ({ onCollapse, selectedRole, setSelectedRole, showReport, setShowReport, showFinalZipReport, setShowFinalZipReport }) => {
    const [showRoles, setShowRoles] = useState(false);

    const toggleRoles = () => {
        setShowRoles(!showRoles);
    };
    const roles = ['Owner/Director/Finance', 'Care manager', 'Operations manager', 'HR', 'Incident Management'];


    return (
        <div className="sidebar">
            {/* Expand/Collapse Sidebar */}
            <div className="logo" onClick={onCollapse} style={{ cursor: 'pointer' }}>
                <img src={ExpandIcon} height={27} width={28} alt='expandicon' />
            </div>

            {/* Explore Roles Button */}
            <div
                className="sidebar-btn explore"
                onClick={toggleRoles}
                style={{ cursor: 'pointer' }}
            >
                <img src={ExploreIcon} height={20} width={20} style={{ marginRight: 10 }} alt="explore icon" />
                Explore Roles
            </div>

            {/* Roles List */}
            {showRoles && (
                <div className="roles-list">
                    {roles.map(role => {
                        const isLocked = ['Care manager', 'Operations manager', 'HR'].includes(role);
                        return (
                            <div
                                key={role}
                                className={`role-item ${selectedRole === role ? 'active-role' : ''} ${isLocked ? 'locked-role' : ''}`}
                                onClick={
                                    !isLocked
                                        ? () => {
                                            setSelectedRole(role);
                                            if (showReport) setShowReport(false);
                                            if (showFinalZipReport) setShowFinalZipReport(false); 
                                        }
                                        : null
                                }
                                style={{ cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.6 : 1 }}
                            >
                                <p>{role}</p>
                                {isLocked && <BiLockAlt size={15} color="white" />}
                            </div>
                        );
                    })}
                </div>
            )}
            {/* New Chat */}
            <button className="sidebar-btn new-chat">+ New chat</button>
        </div>
    );
};




const UploaderCSVBox = ({ file, setFile, title, subtitle, removeFile }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setLoading(true);
            setTimeout(() => {
                setFile(selectedFile);
                setLoading(false);
            }, 1500);
        }
    };

    return (
        <div className={`uploader-box ${loading ? "loading" : ""}`}>
            {loading && (
                <div className="loader-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <p className="uploader-title">{title}</p>
            <p className="uploader-subtitle">
                {subtitle}
            </p>
            <div className="upload-area">
                <label htmlFor={`file-upload-${title}`} className="upload-label">
                    <div className="upload-icon">
                        <img src={UploadIcon} height={42} width={42} alt="Upload icon" />
                    </div>
                    <div className="uploaddiv">Upload</div>
                    <input
                        type="file"
                        id={`file-upload-${title}`}
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        disabled={loading}
                    />
                </label>
            </div>
            <p className="support-text">Only support .xlsx and .csv files</p>
            {file && (
                <div className="file-info" onClick={removeFile}>
                    <div className="file-icon">
                        <img src={ExcelSheetsLogo} height={28} width={21} alt="excel" />
                    </div>
                    <div style={{ fontSize: '15px', fontFamily: 'Roboto', fontWeight: '600' }}>{file.name}</div>
                    <div className="remove-btn">
                        <img src={CrossIcon} height={24} width={24} alt="cross" />
                    </div>
                </div>
            )}
        </div>
    );
};
const UploaderZipBox = ({ file, setFile, title, subtitle, removeFile, disabled = false }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (disabled) return; // Prevent uploading if disabled
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setLoading(true);
            setTimeout(() => {
                setFile(selectedFile);
                setLoading(false);
            }, 1500);
        }
    };

    return (
        <div className={`uploader-box ${loading ? "loading" : ""} ${disabled ? "disabled" : ""}`}>
            {loading && (
                <div className="loader-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <p className="uploader-title">{title}</p>
            <p className="uploader-subtitle">{subtitle}</p>
            <div className="upload-area">
                <label
                    htmlFor={`file-upload-${title}`}
                    className="upload-label"
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                    <div className="upload-icon">
                        <img src={UploadIcon} height={42} width={42} alt="Upload icon" />
                    </div>
                    <div className="uploaddiv">Upload</div>
                    <input
                        type="file"
                        id={`file-upload-${title}`}
                        accept=".zip"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        disabled={disabled || loading}
                    />
                </label>
            </div>
            <p className="support-text">Only support zip files</p>
            {file && (
                <div className="file-info" onClick={removeFile}>
                    <div className="file-icon">
                        <img src={ZipIcon} height={28} width={21} alt="Zip" />
                    </div>
                    <div style={{ fontSize: '15px', fontFamily: 'Roboto', fontWeight: '600' }}>{file.name}</div>
                    <div className="remove-btn">
                        <img src={CrossIcon} height={24} width={24} alt="cross" />
                    </div>
                </div>
            )}
        </div>
    );
};



const UploaderPage = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [zipFile1, setZipFIle1] = useState(null);
    const [zipFile2, setZipFIle2] = useState(null);
    const [zipFile3, setZipFIle3] = useState(null);
    const [zipFile4, setZipFIle4] = useState(null);
    const [showReport, setShowReport] = useState(false); // NEW STATE
    const [visualizations, setVisualizations] = useState([]);
    const [documentString, setDocumentString] = useState('');
    const [report, setReport] = useState('');
    const [progress, setProgress] = useState(0);
    const [zipProgress, setZipProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isZipProcessing, setIsZipProcessing] = useState(false);
    const [showFinalZipReport, setShowFinalZipReport] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Owner/Director/Finance');
    const [reportZipData, setReportZipdata] = useState([])

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };


    const isButtonDisabled = !file1 && !file2 && !file3 && !file4;
    const isZipButtonDisabled = !zipFile1

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleAnalyse = async () => {
        const files = [
            { file: file1, metric_name: "Caregiver Utilization Rate" },
            { file: file2, metric_name: "Client Acquisition & Retention Rate" },
            { file: file3, metric_name: "EBITDA Margin" },
            { file: file4, metric_name: "Wages as a Percentage of Revenue" }
        ];

        const filesData = [];
        const formData = new FormData();

        files.forEach(({ file, metric_name }) => {
            if (file) {
                filesData.push({ filename: file.name, metric_name });
                formData.append('files', file);
            }
        });

        if (filesData.length === 0) {
            alert("Please upload at least one file.");
            return;
        }

        formData.append('file_metrics', JSON.stringify(filesData));

        try {
            setIsProcessing(true);
            setProgress(5); // Start progress

            // Simulate progress bar
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) return prev + 5;
                    return prev;
                });
            }, 1000);

            const response = await axios.post('https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/', formData);

            clearInterval(interval);
            setProgress(100); // Set to 100% when done
            console.log("API Response:", response.data);

            const visualArray = [];

            response.data.forEach((item) => {
                if (item.visualization) {
                    Object.entries(item.visualization).forEach(([metricName, images]) => {
                        visualArray.push({
                            metricName,
                            image: images[0],
                        });
                    });
                }
            });

            setVisualizations(visualArray);
            setReport(response.data[0].report);
            setDocumentString(response.data[0].files_in_string_format)

            // Brief pause after 100% then show report
            setTimeout(() => {
                setShowReport(true); // Navigate or show next section
                setIsProcessing(false);
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            alert("Error occurred during analysis.");
            setIsProcessing(false);
            setProgress(0);
        }
    };
    const handleGenerate = async () => {
        if (!zipFile1) {
            alert("Please upload a zip file");
            return;
        }

        setIsZipProcessing(true);
        setZipProgress(0);
        setShowFinalZipReport(false);
        const allResponses = [];

        let virtualProgress = 0;
        let virtualProgressInterval;

        // Start virtual progress
        const startVirtualProgress = () => {
            virtualProgressInterval = setInterval(() => {
                virtualProgress += Math.random() * 3 + 1; // Random progress step
                if (virtualProgress >= 99) {
                    virtualProgress = 99;
                    clearInterval(virtualProgressInterval);
                }
                setZipProgress(Math.floor(virtualProgress));
            }, 6000); // Every 200ms
        };

        try {
            startVirtualProgress();

            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipFile1);

            const pdfFiles = Object.keys(loadedZip.files).filter((fileName) =>
                fileName.endsWith(".pdf")
            );

            for (const fileName of pdfFiles) {
                const fileData = await loadedZip.files[fileName].async("blob");

                const formData = new FormData();
                formData.append("file", fileData, fileName);

                try {
                    const response = await axios.post(
                        "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/incident_reporting",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    if (response?.data?.data) {
                        allResponses.push(...response.data.data);
                    } else {
                        allResponses.push({ file: fileName, error: "No data in response" });
                    }
                } catch (error) {
                    allResponses.push({
                        file: fileName,
                        error: error?.response?.data?.error || error.message,
                    });
                }
            }

            // Set progress to 100% when complete
            clearInterval(virtualProgressInterval);
            setZipProgress(100);

            setReportZipdata(allResponses);
            setShowFinalZipReport(true);
        } catch (error) {
            console.error("Error processing ZIP:", error);
            alert("Failed to process the ZIP file.");
        } finally {
            setIsZipProcessing(false);
        }
    };


    const handleSend = async () => {
        if (!input.trim()) return;
        // Add user message ONCE
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: input }
        ]);

        try {
            // Call Flask Q&A API
            const response = await axios.post('https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/qanda', {
                document: documentString,
                query: input
            });

            console.log("API Response:", response.data.response.text);

            // Add bot reply ONLY
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: response.data.response.text || "No response from server." }
            ]);

            setInput(''); // Clear input

        } catch (error) {
            console.error("Error calling API:", error);

            // Add bot error reply ONLY
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: "Sorry, something went wrong!" }
            ]);

            setInput('');
        }
    };

    const handleDownloadCSV = () => {
        if (!Array.isArray(reportZipData) || reportZipData?.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(reportZipData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        saveAs(blob, 'Incident_Report.csv');
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setShowSignIn(false); // Ensure sign-in doesn't show if user exists
            } else {
                setShowSignIn(true);
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, []);



    // Handle Logout
    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        setShowDropdown(false);
    };



    return (
        <div className="page-container">
            {sidebarVisible ? (
                <Sidebar onCollapse={toggleSidebar} selectedRole={selectedRole} setSelectedRole={setSelectedRole} showReport={showReport} setShowReport={setShowReport} showFinalZipReport={showFinalZipReport} setShowFinalZipReport={setShowFinalZipReport} />
            ) : (
                <div className="collapsed-button" onClick={toggleSidebar}>
                    <img src={BlackExpandIcon} height={27} width={28} alt="blackexpand" />
                </div>
            )}
            <div className="main-content" style={{ padding: showReport && '8px 10% 40px 10%' }}>
                <div className="top-bar">
                    <img
                        src={PersonIcon}
                        height={40}
                        width={40}
                        style={{ cursor: 'pointer', marginRight: '-40px' }}
                        onClick={() => {
                            if (!user) {
                                setShowSignIn(true);
                            } else {
                                setShowDropdown((prev) => !prev);
                            }
                        }}
                        alt="person"
                    />

                </div>
                <SignIn show={showSignIn} onClose={() => setShowSignIn(false)} />
                {showDropdown && (
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <div className="profile-dropdown" style={{ marginRight: '-90px' }}>
                            <p style={{ fontSize: '14px' }}>{user.email}</p>
                            <button onClick={handleLogout} className="logout-button" >Logout</button>
                        </div>
                    </div>
                )}

                {(!showReport && !showFinalZipReport) ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={handleModalOpen}>
                            <div className="page-title-btn">
                                <div style={{ marginRight: '10px' }}>
                                    Types of report to upload
                                </div>
                                <BiLinkExternal size={28} color="#FFFFFF" />
                            </div>
                        </div>
                        <Modal isVisible={isModalVisible} onClose={handleModalClose}>
                        </Modal>
                        {selectedRole === 'Owner/Director/Finance' ? (
                            <div className="uploader-grid">
                                {/* Uploader boxes - same as before */}
                                <UploaderCSVBox
                                    file={file3}
                                    setFile={setFile3}
                                    title="1. Upload Your Financial Report"
                                    subtitle="(Include Income, Interest, Taxes, Depreciation, Amortization)"
                                    removeFile={() => setFile3(null)}
                                />
                                <UploaderCSVBox
                                    file={file4}
                                    setFile={setFile4}
                                    title="2. Upload Your Wages Report"
                                    subtitle="(Include Total Revenue, Total Wages, Wage Percentage %)"
                                    removeFile={() => setFile4(null)}
                                />
                                <UploaderCSVBox
                                    file={file1}
                                    setFile={setFile1}
                                    title="3. Upload Your Caregiver Utilization Report"
                                    subtitle="(Include Total Available Hours, Billable Hours, Utilization Rate %)"
                                    removeFile={() => setFile1(null)}
                                />
                                <UploaderCSVBox
                                    file={file2}
                                    setFile={setFile2}
                                    title="4. Upload Your Client Acquisition & Retention Rate Report"
                                    subtitle="(Include Total Clients, New Clients, Lost Clients, Retention Rate %, Acquistion Rate %)"
                                    removeFile={() => setFile2(null)}
                                />
                            </div>
                        ) : (
                            <div className="uploader-grid">
                                <UploaderZipBox
                                    file={zipFile1}
                                    setFile={setZipFIle1}
                                    title="Incident Logs"
                                    subtitle="Upload incident logs"
                                    removeFile={() => setZipFIle1(null)}
                                    disabled={false}
                                />
                                <UploaderZipBox
                                    file={zipFile2}
                                    setFile={setZipFIle2}
                                    title="Investigation Reports"
                                    subtitle="Upload reports"
                                    removeFile={() => setZipFIle2(null)}
                                    disabled={true}
                                />
                                <UploaderZipBox
                                    file={zipFile3}
                                    setFile={setZipFIle3}
                                    title="Root Cause Analysis"
                                    subtitle="Upload RCA docs"
                                    removeFile={() => setZipFIle3(null)}
                                    disabled={true}
                                />
                                <UploaderZipBox
                                    file={zipFile4}
                                    setFile={setZipFIle4}
                                    title="Corrective Actions"
                                    subtitle="Upload action plans"
                                    removeFile={() => setZipFIle4(null)}
                                    disabled={true}
                                />

                            </div>
                        )}
                        {selectedRole === 'Owner/Director/Finance' ? (
                            <button
                                className="analyse-btn"
                                disabled={isButtonDisabled || isProcessing}
                                style={{
                                    backgroundColor: isButtonDisabled || isProcessing ? '#A1A1AA' : '#000',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handleAnalyse}
                            >
                                {isProcessing ? `${progress}% Processing...` : 'Analyse'}
                            </button>
                        ) : (
                            <button
                                className="analyse-btn"
                                disabled={isZipButtonDisabled || isZipProcessing}
                                style={{
                                    backgroundColor: isZipButtonDisabled || isZipProcessing ? '#A1A1AA' : '#000',
                                    cursor: isZipProcessing ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handleGenerate}
                            >
                                {isZipProcessing ? `${zipProgress}% Processing...` : 'Generate'}
                            </button>
                        )}

                    </>
                ) : (
                    <>
                        {showReport && selectedRole === 'Owner/Director/Finance' && (
                            <>
                                <div className="card-grid">
                                    {visualizations.map((viz, index) => (
                                        <div key={index} className="data-card">
                                            <h4>{viz.metricName}</h4>
                                            <img src={`data:image/png;base64,${viz.image}`} alt={viz.metricName} style={{ width: "100%" }} />
                                        </div>
                                    ))}
                                </div>

                                <div className="report-box">
                                    <h2 style={{ marginBottom: '6px', fontFamily: 'sans-serif' }}>REPORT</h2>
                                    <ReportViewer report={report} />
                                    <p style={{ marginTop: "20px", fontStyle: "italic" }}>This report is auto-generated using Intelcare's proprietary AI technology, ensuring accuracy and personalized recommendations.</p>
                                </div>

                                <div style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#000', color: '#fff', borderRadius: '40px', width: '100px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', cursor: 'pointer', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', zIndex: 999 }} onClick={() => setShowAIChat(!showAIChat)}>
                                    Ask AI
                                </div>

                                {showAIChat && (
                                    <div style={{ position: 'fixed', bottom: '100px', right: '30px', width: '500px', height: '550px', backgroundColor: '#000', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', padding: '15px', zIndex: 999, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setShowAIChat(false)} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#fff' }}>×</button>
                                        </div>

                                        <div style={{ flex: 1, marginTop: '10px', overflowY: 'auto', padding: '10px' }}>
                                            {messages.map((msg, index) => (
                                                <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                                                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', maxWidth: '75%', fontSize: '14px', textAlign: 'left', color: 'black' }}>
                                                        <MarkdownParser text={msg.text} />
                                                    </div>
                                                </div>
                                            ))}
                                            {messages.length === 0 && <p style={{ color: '#999' }}>How can I assist you today?</p>}
                                        </div>

                                        <div style={{ position: 'relative', marginTop: '10px' }}>
                                            <input type="text" placeholder="Type your question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} style={{ width: '100%', padding: '8px 40px 8px 8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                            <FaPaperPlane onClick={handleSend} size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'white' }} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {(showFinalZipReport && selectedRole === 'Incident Management') && (
                            <div className="reports-box" style={{ height: 'auto' }}>
                                <h2 style={{ marginBottom: '14px' }}>Summary Report</h2>

                                {Array.isArray(reportZipData) && reportZipData?.length > 0 && (
                                    <ul style={{ marginLeft: '20px', marginRight: '20px' }}>
                                        {Object.entries(reportZipData[0]).map(([key, value]) => (
                                            <li key={key} style={{ marginBottom: '4px' }}>
                                                <strong>{key}:</strong> {String(value)}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>Click below to download Full Report</p>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                                    <button className="download-btn" style={{ padding: '14px', backgroundColor: 'black', color: 'white', border: 'none', outline: 'none', borderRadius: '12px', fontSize: '18px', cursor: 'pointer' }} onClick={handleDownloadCSV}>
                                        Download Excel Report
                                    </button>
                                </div>
                            </div>
                        )}

                    </>

                )}
            </div>
        </div>
    );
};

export default UploaderPage;
