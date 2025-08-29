import React, { useState, useEffect } from "react";
import "../Styles/UploaderPage.css";
import BlackExpandIcon from "../../src/Images/BlackExpandIcon.png";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import Modal from "./Modal";
import SignIn from "./SignIn";
import MarkdownParser from "./MarkdownParser";
import { auth, getCount, incrementCount, signOut } from "../firebase";
import FeedbackModal from "./FeedbackModal";
import PricingModal from "./PricingModal";
import SubscriptionStatus from "./SubscriptionStatus";
import { IoMdInformationCircleOutline } from "react-icons/io";
import askAiStar from "../Images/askaiStar.png";
import purpleStar from "../Images/PurpleStar.png";
import { RxCrossCircled } from "react-icons/rx";
import Sidebar from "./Sidebar";
import FinancialHealth from "./Modules/FinancialModule/FinancialHealth";
import SirsAnalysis from "./Modules/FinancialModule/SirsAnalysis";
import Qfr from "./Modules/FinancialModule/Qfr";
import Afr from "./Modules/FinancialModule/Afr";
import IncidentManagement from "./Modules/FinancialModule/IncidentManagement";
import CustomReporting from "./Modules/FinancialModule/CustomReporting";
import CareServicesEligibility from "./Modules/SupportAtHomeModule.js/CareServicesEligibilty";
import IncidentReport from "./Modules/SupportAtHomeModule.js/IncidentReport";
import QualityandRisk from "./Modules/SupportAtHomeModule.js/QualityandRisk";
import AiRostering from "./Modules/RosteringModule/Rostering";
import ResumeScreening from "./Modules/SupportAtHomeModule.js/HRAnalysis";
import Client_Event_Reporting from "./Modules/NDISModule/Client_Event_Reporting";
import SoftwareConnect from "./Modules/ConnectModule/SoftwareConnect";

const HomePage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [documentString, setDocumentString] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Financial Health");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [majorTypeofReport, setMajorTypeOfReport] = useState("");
  const [activeReportType, setActiveReportType] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showFinalZipReport, setShowFinalZipReport] = useState(false);
  const [showUploadedReport, setShowUploadReport] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  console.log("user", user)
  const handleModalOpen = () => setModalVisible(true);
  const handleModalClose = () => setModalVisible(false);

  useEffect(() => {
    getCount();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const payload = { query: input };
    if (documentString) payload.document = documentString;

    try {
      const response = await axios.post(
        "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/askai",
        payload
      );

      const botReply =
        response.data?.response?.text ||
        response.data?.response ||
        "No response from server.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong!" }]);
    }

    setInput("");
  };

  const handleClick = async () => {
    await incrementCount();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setShowSignIn(!currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowDropdown(false);
  };

  SubscriptionStatus(user, setShowPricingModal);

  return (
    <>
      {showPricingModal ? (
        <PricingModal onClose={() => setShowPricingModal(false)} email={user?.email} />
      ) : (
        <div className="page-container">
          {sidebarVisible ? (
            <Sidebar
              onCollapse={toggleSidebar}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              majorTypeofReport={majorTypeofReport}
              setMajorTypeOfReport={setMajorTypeOfReport}
              user={user}
              handleLogout={handleLogout}
              setShowDropdown={setShowDropdown}
              setShowSignIn={setShowSignIn}
              showDropdown={showDropdown}
              activeReportType={activeReportType}
              setActiveReportType={setActiveReportType}
              showReport={showReport}
              setShowReport={setShowReport}
              showFinalZipReport={showFinalZipReport}
              setShowFinalZipReport={setShowFinalZipReport}
              showUploadedReport={showUploadedReport}
              setShowUploadReport={setShowUploadReport}
            />
          ) : (
            <div className="collapsed-button" onClick={toggleSidebar}>
              <img src={BlackExpandIcon} height={27} width={28} alt="blackexpand" />
            </div>
          )}

          <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
            <SignIn show={showSignIn} onClose={() => setShowSignIn(false)} />

            <div className="typeofreportmaindiv" style={{ display: "flex", justifyContent: "flex-end", width: "100%", borderBottom: "1px solid #E8ECEF", backgroundColor: "white" }}>
              <div className="page-title-btn" onClick={handleModalOpen}>
                <IoMdInformationCircleOutline size={20} color="#5B36E1" /> Accepted Types Of Reports
              </div>
            </div>

            <div className="main-content" style={{ padding: "8px 10% 40px 10%", flex: 1 }}>
              {showFeedbackPopup && <FeedbackModal userEmail={user?.email} />}

              <>
                {!loadingUser && selectedRole === "Connect Your Systems" && user && (
                  <SoftwareConnect user={user} />
                )}
                <div style={{ display: selectedRole === "Financial Health" ? "block" : "none" }}>
                  <FinancialHealth selectedRole="Financial Health" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} user={user} />
                </div>

                <div style={{ display: selectedRole === "SIRS Analysis" ? "block" : "none" }}>
                  <SirsAnalysis selectedRole="SIRS Analysis" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Client Event & Incident Management" ? "block" : "none" }}>
                  <Client_Event_Reporting />
                </div>

                <div style={{ display: selectedRole === "Quarterly Financial Reporting" ? "block" : "none" }}>
                  <Qfr selectedRole="Quarterly Financial Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Annual Financial Reporting" ? "block" : "none" }}>
                  <Afr selectedRole="Annual Financial Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Custom Incident Management" ? "block" : "none" }}>
                  <IncidentManagement selectedRole="Custom Incident Management" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Custom Reporting" ? "block" : "none" }}>
                  <CustomReporting selectedRole="Custom Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Smart Onboarding (Staff)" ? "block" : "none" }}>
                  <ResumeScreening handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Care Plan Document" ? "block" : "none" }}>
                  <CareServicesEligibility selectedRole="Care Plan Document" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Incident Report" ? "block" : "none" }}>
                  <IncidentReport selectedRole="Incident Report" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Quality and Risk Reporting" ? "block" : "none" }}>
                  <QualityandRisk selectedRole="Quality and Risk Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Smart Rostering" ? "block" : "none" }}>
                  <AiRostering
                    userName={user?.displayName || "Emma"}
                    coverage={92}
                    uncoveredShifts={2}
                    availableStaff={18}
                    todayVisits={7}
                    promptPlaceholder="Find 5 qualified support workers..."
                    onSendPrompt={(text) => console.log("Prompt sent:", text)}
                  />
                </div>
              </>

              <Modal isVisible={isModalVisible} onClose={handleModalClose}></Modal>

              <div className="ask-ai-button" onClick={() => setShowAIChat(!showAIChat)}>
                <img src={askAiStar} alt="askAiStar" style={{ width: "22px", height: "22px" }} />
                <div style={{ fontFamily: "Inter", fontSize: "16px", color: "white" }}>Ask AI</div>
              </div>

              {showAIChat && (
                <div style={{ position: "fixed", bottom: "100px", right: "30px", width: "350px", height: "400px", backgroundColor: "#000", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.2)", zIndex: 999, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", backgroundColor: "white", borderTopRightRadius: "10px", borderTopLeftRadius: "10px", padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: "10px", marginLeft: "20px", alignItems: "center" }}>
                      <img src={purpleStar} alt="purple star" style={{ width: "24px", height: "24px" }} />
                      <div style={{ fontSize: "12px", fontFamily: "Inter" }}>I can help with Support at Home, NDIS, compliance and reporting</div>
                    </div>
                    <RxCrossCircled size={24} color="#4A4A4A" onClick={() => setShowAIChat(false)} style={{ cursor: "pointer" }} />
                  </div>

                  <div style={{ flex: 1, marginTop: "10px", overflowY: "auto", padding: "10px" }}>
                    {messages.map((msg, index) => (
                      <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                        <div style={{ backgroundColor: msg.sender === "user" ? "#fff" : "#6C4CDC", padding: "10px", borderRadius: "10px", maxWidth: "75%", fontSize: "14px", textAlign: "left", color: msg.sender === "user" ? "black" : "white", fontFamily: "Inter" }}>
                          <MarkdownParser text={msg.text} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ position: "relative", marginTop: "10px", marginBottom: "16px", width: "75%", display: "flex", alignSelf: "center" }}>
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      style={{ width: "100%", padding: "8px 40px 8px 8px", borderRadius: "10px", border: "1px solid #ccc" }}
                    />
                    <FaPaperPlane onClick={handleSend} size={18} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6C4CDC" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
