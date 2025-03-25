import React, { useState } from "react";
import "../Styles/UploaderPage.css";
import UploadIcon from '../../src/Images/upload.png';
import ExpandIcon from '../../src/Images/ExpandIcon.png';
import ExploreIcon from '../../src/Images/ExploreIcon.png';
import BlackExpandIcon from '../../src/Images/BlackExpandIcon.png';
import ExcelSheetsLogo from '../../src/Images/ExcelSheetsLogo.png';
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


const Sidebar = ({ onCollapse }) => {
    const [showRoles, setShowRoles] = useState(false);

    const toggleRoles = () => {
        setShowRoles(!showRoles);
    };

    return (
        <div className="sidebar">
            {/* Expand/Collapse Sidebar */}
            <div className="logo" onClick={onCollapse} style={{ cursor: 'pointer' }}>
                <img src={ExpandIcon} height={27} width={28} alt='expandicon'/>
            </div>

            {/* Explore Roles Button */}
            <div
                className="sidebar-btn explore"
                onClick={toggleRoles}
                style={{ cursor: 'pointer' }}
            >
                <img src={ExploreIcon} height={20} width={20} style={{ marginRight: 10 }} alt="explore icon"/>
                Explore Roles
            </div>

            {/* Roles List */}
            {showRoles && (
                <div className="roles-list">
                    <div className="role-item">
                        <p>Owner/Director/Finance</p></div>
                    <div className="role-item">
                        <p>Care manager</p><BiLockAlt size={15} color="white" />
                    </div>
                    <div className="role-item">
                        <p>Operations manager</p><BiLockAlt size={15} color="white" />
                    </div>
                    <div className="role-item">
                        <p>HR</p><BiLockAlt size={15} color="white" />
                    </div>
                </div>
            )}
            {/* New Chat */}
            <button className="sidebar-btn new-chat">+ New chat</button>
        </div>
    );
};




const UploaderBox = ({ file, setFile, title, removeFile }) => {
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
                (Include Total Available Hours, Billable Hours, and Utilization Rate %)
            </p>
            <div className="upload-area">
                <label htmlFor={`file-upload-${title}`} className="upload-label">
                    <div className="upload-icon">
                        <img src={UploadIcon} height={42} width={42} alt="Upload icon"/>
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
                        <img src={ExcelSheetsLogo} height={28} width={21} alt="excel"/>
                    </div>
                    <div style={{ fontSize: '15px', fontFamily: 'Roboto', fontWeight: '600' }}>{file.name}</div>
                    <div className="remove-btn">
                        <img src={CrossIcon} height={24} width={24} alt="cross"/>
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
    const [showReport, setShowReport] = useState(false); // NEW STATE
    const [visualizations, setVisualizations] = useState([]);
    const [documentString,setDocumentString]=useState('');
    const [report, setReport] = useState('');
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };
  

    const isButtonDisabled = !file1 && !file2 && !file3 && !file4;

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

            const response = await axios.post('http://127.0.0.1:5000/', formData);

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
    const handleSend = async () => {
        if (!input.trim()) return;
        // Add user message ONCE
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "user", text: input }
        ]);
      
        try {
          // Call Flask Q&A API
          const response = await axios.post('http://127.0.0.1:5000/qanda', {
            document: documentString,
            query: input
          });
      
          console.log("API Response:", response.data.response.text);
      
          // Add bot reply ONLY
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", text:  response.data.response.text || "No response from server." }
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
      


    return (
        <div className="page-container">
            {sidebarVisible ? (
                <Sidebar onCollapse={toggleSidebar} />
            ) : (
                <div className="collapsed-button" onClick={toggleSidebar}>
                    <img src={BlackExpandIcon} height={27} width={28} alt="blackexpand"/>
                </div>
            )}
            <div className="main-content" style={{ padding: showReport && '8px 10% 40px 10%' }}>
                <div className="top-bar">
                    <img src={PersonIcon} height={40} width={40} style={{ cursor: 'pointer', marginRight: '-40px' }} onClick={()=>{setShowSignIn(true)}} alt="person"/>
                </div>
                <SignIn show={showSignIn} onClose={() => setShowSignIn(false)} />

                {!showReport ? (
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
                        <div className="uploader-grid">
                            {/* Uploader boxes - same as before */}
                            <UploaderBox
                                file={file3}
                                setFile={setFile3}
                                title="1. Upload Your Financial Data"
                                removeFile={() => setFile3(null)}
                            />
                            <UploaderBox
                                file={file4}
                                setFile={setFile4}
                                title="2. Upload Your Wages"
                                removeFile={() => setFile4(null)}
                            />
                            <UploaderBox
                                file={file1}
                                setFile={setFile1}
                                title="3. Upload Your Caregiver Utilization Report"
                                removeFile={() => setFile1(null)}
                            />
                            <UploaderBox
                                file={file2}
                                setFile={setFile2}
                                title="4. Upload Your Client Acquisition & Retention Rate"
                                removeFile={() => setFile2(null)}
                            />
                        </div>
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

                    </>
                ) : (
                    <>
                        {/* TOP CARDS */}
                        {showReport && (
                            <div className="card-grid" >
                                {visualizations.map((viz, index) => (
                                    <div key={index} className="data-card">
                                        <h4>{viz.metricName}</h4>
                                        <img src={`data:image/png;base64,${viz.image}`} alt={viz.metricName} style={{ width: "100%" }} />
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* REPORT */}
                        <div className="report-box">
                            <h2 style={{ marginBottom: '6px', fontFamily: 'sans-serif' }}>REPORT</h2>
                            {/* <div style={{ fontFamily: 'sans-serif', fontWeight: 'lighter', fontSize: '16px' }}>{report}</div> */}
                            <ReportViewer report={report} />
                            <p style={{ marginTop: "20px", fontStyle: "italic" }}>
                                This report is auto-generated using Intelcare's proprietary AI technology, ensuring accuracy and personalized recommendations.
                            </p>
                        </div>


                        {/* Floating Button */}
                        {/* Floating Ask AI Button */}
                        <div
                            style={{
                                position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#000000', color: '#fff', borderRadius: '40px', width: '100px',
                                height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', cursor: 'pointer', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', zIndex: 999
                            }}
                            onClick={() => setShowAIChat(!showAIChat)}
                        >
                            Ask AI
                        </div>

                        {/* Floating Chat Box */}
                        {showAIChat && (
                            <div style={{
                                position: 'fixed', bottom: '100px', right: '30px', width: '500px', height: '550px',
                                backgroundColor: '#000000', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                padding: '15px', zIndex: 999, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            }}>
                                {/* Close Button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button onClick={() => setShowAIChat(false)} style={{
                                        background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#ffffff'
                                    }}>×</button>
                                </div>

                                {/* Chat Messages */}
                                <div style={{ flex: 1, marginTop: '10px', overflowY: 'auto', padding: '10px' }}>
                                    {messages.map((msg, index) => (
                                        <div key={index} style={{
                                            display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{
                                                backgroundColor: msg.sender === 'user' ? '#FFFFFF' : '#FFFFFF',
                                                padding: '10px', borderRadius: '10px', maxWidth: '75%',fontSize:'14px',textAlign:'left',
                                                color: 'black'
                                            }}>
                                                <MarkdownParser text={msg.text}/>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && <p style={{ color: '#999' }}>How can I assist you today?</p>}
                                </div>

                                {/* Input & Send */}
                                <div style={{ position: 'relative', marginTop: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Type your question..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        style={{
                                            width: '100%',
                                            padding: '8px 40px 8px 8px', // Padding for icon space
                                            borderRadius: '5px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                    <FaPaperPlane
                                        onClick={handleSend}
                                        size={18}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: 'white'
                                        }}
                                        color="white"
                                    />
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
