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
import { auth, getCount, incrementCount, signOut } from "../firebase";
import JSZip from "jszip";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FeedbackModal from "./FeedbackModal";
import SummaryReport from "./SummaryReportViewer";
import ReactMarkdown from "react-markdown";


const Sidebar = ({ onCollapse, selectedRole, setSelectedRole, showReport, setShowReport, showFinalZipReport, setShowFinalZipReport, showUploadedReport, setShowUploadReport, activeReportType, setActiveReportType, analysedReportdata, setAnalysedReportdata, majorTypeofReport, setMajorTypeOfReport }) => {
    // console.log(activeReportType);
    const [showRoles, setShowRoles] = useState(true);
    const [activeItem, setActiveItem] = useState("Quality and Safety Report");

    const toggleRoles = () => {
        // setShowRoles(!showRoles);
        setShowUploadReport(false);
    };
    const roles = ['Owner/Director/Finance', 'Care manager', 'Operations manager', 'HR', 'Incident Management'];
    const reportButtons = ["Quality and Safety Report", "Financial and Operational Report", "Service Delivery Report", "Workforce Report", "Incident Management Report", "Participant Outcomes Report"];
    const NDISButton = ["Audit & Registration Manager", "Incident & Complaint Reporter", "Restrictive Practice & Behaviour Support", "Worker-Screening & HR Compliance", "Financial & Claims Compliance", "Participant Outcomes & Capacity-Building"]
    // console.log(majorTypeofReport);


    return (
        <div className="sidebar">
            {/* Expand/Collapse Sidebar */}
            <div className="logo" onClick={onCollapse} style={{ cursor: 'pointer' }}>
                <img src={ExpandIcon} height={27} width={28} alt='expandicon' />
            </div>

            {/* Explore Roles Button */}
            <div className="sidebar-scroll-content" style={{ overflowY: 'auto', flex: 1 }}>
                <div
                    className="sidebar-btn explore"
                    onClick={toggleRoles}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={ExploreIcon} height={20} width={20} style={{ marginRight: 10 }} alt="explore icon" />
                    Explore Roles
                </div>
                {showRoles && (
                    <div className="roles-list">
                        {roles.map(role => {
                            const isLocked = ['Care manager', 'Operations manager', 'HR'].includes(role);
                            return (
                                <div
                                    key={role}
                                    className={`role-item ${activeItem === role ? 'active-role' : ''} ${isLocked ? 'locked-role' : ''}`}
                                    onClick={
                                        !isLocked
                                            ? () => {
                                                setSelectedRole(role);
                                                setActiveItem(role);
                                                if (showReport) setShowReport(false);
                                                if (showFinalZipReport) setShowFinalZipReport(false);
                                                if (showUploadedReport) setShowUploadReport(false)
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
                <div className="roles-list">
                    <div style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', marginLeft: '30px', fontFamily: 'Roboto', marginBottom: '12px' }}>SUPPORT AT HOME</div>
                    {reportButtons.map(report => (
                        <div
                            key={report}
                            className={`role-item ${activeItem === report ? 'active-role' : ''}`}
                            style={{ cursor: 'pointer', marginTop: '4px' }}
                            onClick={() => {
                                setActiveReportType(report);
                                setActiveItem(report);
                                setShowReport(false);
                                setShowFinalZipReport(false);
                                setShowUploadReport(true);
                                setMajorTypeOfReport('SUPPORT AT HOME');
                                if (analysedReportdata) setAnalysedReportdata(null)
                            }}
                        >
                            {report}
                        </div>
                    ))}
                </div>
                <div style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', marginLeft: '30px', fontFamily: 'Roboto', marginBottom: '12px', }}>NDIS</div>
                {NDISButton.map(report => (
                    <div
                        key={report}
                        className={`role-item ${activeItem === report ? 'active-role' : ''}`}
                        style={{ cursor: 'pointer', marginTop: '4px' }}
                        onClick={() => {
                            setActiveReportType(report);
                            setActiveItem(report);
                            setShowReport(false);
                            setShowFinalZipReport(false);
                            setShowUploadReport(true);
                            setMajorTypeOfReport('NDIS')
                            if (analysedReportdata) setAnalysedReportdata(null)
                        }}
                    >
                        {report}
                    </div>
                ))}
            </div>
            {/* Roles List */}

            {/* New Chat */}
            {/* <button className="sidebar-btn new-chat">+ New chat</button> */}
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
const UploadReports = ({ files, setFiles, title, subtitle, removeFile }) => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setLoading(true);
            setTimeout(() => {
                setFiles(prev => [...prev, ...selectedFiles]);
                setLoading(false);
            }, 1000);
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
            <p className="uploader-subtitle">{subtitle}</p>
            <div className="upload-area">
                <label htmlFor={`file-upload-${title}`} className="upload-label">
                    <div className="upload-icon">
                        <img src={UploadIcon} height={42} width={42} alt="Upload icon" />
                    </div>
                    <div className="uploaddiv">Upload</div>
                    <input
                        type="file"
                        id={`file-upload-${title}`}
                        accept=".zip, .pdf, .docx , .xlsx"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        disabled={loading}
                    />
                </label>
            </div>
            <div className="files-lists">
                {files.map((file, index) => (
                    <div className="files-infos" key={index} onClick={() => removeFile(index)}>
                        <div style={{ fontSize: '15px', fontFamily: 'Roboto', fontWeight: '600' }}>
                            {file.name}
                        </div>
                        <div className="remove-btn">
                            <img src={CrossIcon} height={24} width={24} alt="remove" />
                        </div>
                    </div>
                ))}
            </div>
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
    const [activeReportType, setActiveReportType] = useState(null);
    const [reportFiles, setReportFiles] = useState([]);
    const [showUploadedReport, setShowUploadReport] = useState(false);
    const [isAnalysingReportLoading, setIsAnalysingReportLoading] = useState(false);
    const [isAnalyseReportProgress, setIsAnalysedReportProgress] = useState(0);
    const [analysedReportdata, setAnalysedReportdata] = useState(null);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [template, setTemplate] = useState(null);
    const [parsedReports, setParsedReports] = useState(null);
    const [majorTypeofReport, setMajorTypeOfReport] = useState('');

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };
    useEffect(() => {
        getCount();
    }, []);


    const isButtonDisabled = !file1 && !file2 && !file3 && !file4;
    const isZipButtonDisabled = !zipFile1

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    useEffect(() => {
        setActiveReportType("Quality and Safety Report");
        setMajorTypeOfReport("SUPPORT AT HOME");
        setShowUploadReport(true);
        setShowReport(false);
        setShowFinalZipReport(false);
        if (analysedReportdata) setAnalysedReportdata(null);
    }, []);

    const handleAnalyse = async () => {
        const files = [
            { file: file1, metric_name: "Caregiver Utilization Rate" },
            { file: file2, metric_name: "Client Acquisition & Retention Rate" },
            { file: file3, metric_name: "EBITDA Margin" },
            { file: file4, metric_name: "Wages as a Percentage of Revenue" }
        ];
        handleClick();

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
        handleClick();
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

    const handleAnalyseReports = async () => {
        if (!activeReportType || reportFiles.length === 0) {
            alert("Please enter a metric name and select at least one file.");
            return;
        }
        handleClick();

        const formData = new FormData();

        // Add template file if it exists
        if (template) {
            formData.append("template", template);
        }

        // Add all report files
        Array.from(reportFiles).forEach((file) => {
            formData.append("files", file);
        });

        // Append metric name
        formData.append("metric_name", activeReportType);
        let progressInterval;

        // Determine the correct API endpoint
        let apiUrl = "";
        if (majorTypeofReport === "SUPPORT AT HOME") {
            apiUrl = "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/aged_care_reporting";
        } else if (majorTypeofReport === "NDIS") {
            apiUrl = "https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/NDIS_reporting";
        } else {
            alert("Invalid report type.");
            return;
        }

        try {
            setIsAnalysingReportLoading(true); // Show loader
            setIsAnalysedReportProgress(1);
            progressInterval = setInterval(() => {
                setIsAnalysedReportProgress((prevProgress) => {
                    if (prevProgress < 90) {
                        return prevProgress + 4; // Increase by 4% every interval
                    }
                    return prevProgress;
                });
            }, 4000);

            const response = await axios.post(apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            clearInterval(progressInterval);
            setIsAnalysedReportProgress(100);

            const responseData = response.data;
            console.log(responseData);
            console.log("Summary:", responseData.summary);

            const parsedReports = JSON.parse(responseData.response);
            setDocumentString(responseData.documents);
            setAnalysedReportdata(responseData.summary);
            setParsedReports(parsedReports);
            // alert("Reports analysed successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to connect to the server or analyse the reports.");
            clearInterval(progressInterval);
        } finally {
            setIsAnalysingReportLoading(false);
        }
    };
    console.log(parsedReports);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: input }
        ]);

        // Prepare payload
        const payload = {
            query: input
        };

        if (documentString) {
            payload.document = documentString;
        }

        try {
            const response = await axios.post(
                'https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/askai',
                payload
            );

            console.log("API Response:", response.data);

            const botReply = response.data?.response?.text || response.data?.response || "No response from server.";

            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: botReply }
            ]);

        } catch (error) {
            console.error("Error calling API:", error);

            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", text: "Sorry, something went wrong!" }
            ]);
        }

        setInput('');
    };


    const handleDownloadCSV = () => {
        if (!Array.isArray(reportZipData) || reportZipData?.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(reportZipData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        saveAs(blob, 'Incident_Report.csv');
    };
    const handleDownloadAnalyedReportCSV = () => {
        if (!parsedReports || !Array.isArray(parsedReports.data)) return;

        const incidentsArray = parsedReports.data; // ✅ Directly use the array
        const worksheet = XLSX.utils.json_to_sheet(incidentsArray);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        saveAs(blob, 'completed_template.csv');
    };
    const handleClick = async () => {
        await incrementCount();
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

    useEffect(() => {
        if (analysedReportdata) {
            const timer = setTimeout(() => {
                setShowFeedbackPopup(true);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [analysedReportdata]);

    // Handle Logout
    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        setShowDropdown(false);
    };


    return (
        <div className="page-container">
            {sidebarVisible ? (
                <Sidebar onCollapse={toggleSidebar} selectedRole={selectedRole} setSelectedRole={setSelectedRole} showReport={showReport} setShowReport={setShowReport} showFinalZipReport={showFinalZipReport} setShowFinalZipReport={setShowFinalZipReport} showUploadedReport={showUploadedReport} setShowUploadReport={setShowUploadReport} activeReportType={activeReportType} setActiveReportType={setActiveReportType} analysedReportdata={analysedReportdata} setAnalysedReportdata={setAnalysedReportdata} majorTypeofReport={majorTypeofReport} setMajorTypeOfReport={setMajorTypeOfReport} />
            ) : (
                <div className="collapsed-button" onClick={toggleSidebar}>
                    <img src={BlackExpandIcon} height={27} width={28} alt="blackexpand" />
                </div>
            )}
            <div className="main-content" style={{ padding: showReport && '8px 10% 40px 10%', overflowY: 'auto', flex: 1, }}>
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
                            <p style={{ fontSize: '14px' }}>{user?.email}</p>
                            <button onClick={handleLogout} className="logout-button" >Logout</button>
                        </div>
                    </div>
                )}
                {showFeedbackPopup && <FeedbackModal userEmail={user?.email} />}
                {showUploadedReport && activeReportType && (
                    <>
                        {!analysedReportdata ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} >
                                    <div className="page-title-btn" onClick={handleModalOpen}>
                                        <div style={{ marginRight: '10px' }}>
                                            Types of report to upload
                                        </div>
                                        <BiLinkExternal size={28} color="#FFFFFF" />
                                    </div>
                                </div>
                                <div className="uploader-grid">
                                    <UploaderCSVBox
                                        file={template}
                                        setFile={setTemplate}
                                        title='Upload your template to be filled'
                                        subtitle=".XLSX Format Only"
                                        removeFile={() => setTemplate(null)}
                                    />
                                    <UploadReports
                                        files={reportFiles}
                                        setFiles={setReportFiles}
                                        title={activeReportType}
                                        subtitle="Upload reports in ZIP, PDF, XLSX or DOCX format"
                                        removeFile={(index) => {
                                            setReportFiles(prev => prev.filter((_, i) => i !== index));
                                        }}
                                    />
                                </div>
                                <button
                                    className="analyse-btn"
                                    disabled={isAnalysingReportLoading}
                                    style={{ backgroundColor: '#000', marginTop: '20px' }}
                                    onClick={handleAnalyseReports}
                                >
                                    {isAnalysingReportLoading
                                        ? `Analysing... ${isAnalyseReportProgress}%`
                                        : "Analyse Reports"}
                                </button>
                            </>
                        ) : (
                            <div className="reports-box" style={{ height: 'auto', marginTop: '30px', padding: '10px' }}>
                                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 30px', borderRadius: '10px' }}>
                                    <SummaryReport summaryText={analysedReportdata} handleDownloadAnalyedReportCSV={handleDownloadAnalyedReportCSV} />
                                </div>
                            </div>

                        )}
                    </>
                )}



                {(!showReport && !showFinalZipReport && !showUploadedReport) ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={handleModalOpen}>
                            <div className="page-title-btn">
                                <div style={{ marginRight: '10px' }}>
                                    Types of report to upload
                                </div>
                                <BiLinkExternal size={28} color="#FFFFFF" />
                            </div>
                        </div>
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
                                    {/* <h2 style={{ marginBottom: '6px', fontFamily: 'sans-serif' }}>REPORT</h2> */}
                                    <div className="report-markdown">
                                        <ReactMarkdown>{report}</ReactMarkdown>
                                    </div>
                                    <p style={{ marginTop: "20px", fontStyle: "italic" }}>This report is auto-generated using Curki.ai's proprietary AI technology, ensuring accuracy and personalized recommendations.</p>
                                </div>
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
                <Modal isVisible={isModalVisible} onClose={handleModalClose}>
                </Modal>
                <div style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#000', color: '#fff', borderRadius: '40px', width: '100px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', cursor: 'pointer', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', zIndex: 999 }} onClick={() => setShowAIChat(!showAIChat)}>
                    Ask AI
                </div>

                {showAIChat && (
                    <div style={{ position: 'fixed', bottom: '100px', right: '30px', width: '350px', height: '400px', backgroundColor: '#000', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', padding: '15px', zIndex: 999, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                            <p style={{ color: '#FFFFFF', fontSize: '12px', }}>I can help with Support at Home, NDIS, compliance and reporting</p>
                            <button onClick={() => setShowAIChat(false)} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#fff', marginTop: '-4px' }}>×</button>
                        </div>

                        <div style={{ flex: 1, marginTop: '10px', overflowY: 'auto', padding: '10px' }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                                    <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '10px', maxWidth: '75%', fontSize: '14px', textAlign: 'left', color: 'black' }}>
                                        <MarkdownParser text={msg.text} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative', marginTop: '10px' }}>
                            <input type="text" placeholder="Type your question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} style={{ width: '100%', padding: '8px 40px 8px 8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            <FaPaperPlane onClick={handleSend} size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'white' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploaderPage;
