import React, { useState, useEffect } from "react";
import "../Styles/UploaderPage.css";
import BlackExpandIcon from "../../src/Images/BlackExpandIcon.png";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import Modal from "./Modal";
import SignIn from "./SignIn";
import MarkdownParser from "./MarkdownParser";
import { auth, getCount, incrementCount, signOut } from "../firebase";
import FeedbackModal from "./FeedbackModal";
import PricingModal from "./PricingModal";
import SubscriptionStatus from "./SubscriptionStatus";
import { IoMdInformationCircleOutline } from "react-icons/io";
import askAiStar from "../Images/askaiStar.png";
import aksAiPurpleStar from '../Images/AskAiPurpleStar.png';
import purpleStar from "../Images/PurpleStar.png";
import askAiPersonIcon from '../Images/AskAiPersonIcon.png';
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
import ResumeScreening from "./Modules/SupportAtHomeModule.js/HRStaffView";
import Client_Event_Reporting from "./Modules/NDISModule/Client_Event_Reporting";
import SoftwareConnect from "./Modules/ConnectModule/SoftwareConnect";
import RosteringDashboard from "./Modules/RosteringModule/SmartRostering";
import HRAnalysis from "./Modules/SupportAtHomeModule.js/HRAnalysis";
import IncidentAuditing from "./Modules/NDISModule/IncidentAuditing";
import TlcCustomerReporting from "./Modules/FinancialModule/TlcCustomReporting";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const HomePage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [documentString, setDocumentString] = useState("");
  const [tlcAskAiPayload, setTlcAskAiPayload] = useState("");
  const [tlcAskAiHistoryPayload, setTlcAskAiHistoryPayload] = useState("");
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
  const isTlcPage = selectedRole === "TLC Payroll Custom";
  const handleModalOpen = () => setModalVisible(true);
  const handleModalClose = () => setModalVisible(false);

  const Suggestions = [
    "What is NDIS?",
    "What is Aged Care?",
    "How Does this module works?",
    "Do you offer support?"
  ];

  useEffect(() => {
    getCount();
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  console.log('Tlc', tlcAskAiPayload);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const tempBotMessage = { sender: "bot", text: "Generating response...", temp: true };
    setMessages((prev) => [...prev, tempBotMessage]);

    const userInput = input;
    setInput("");

    const isTlcPage = selectedRole === "TLC Payroll Custom";
    let payload = {};

    try {
      // 🟢 CASE 1: If TLC page and tlcAskAiPayload already exists (ready-to-use data)
      if (isTlcPage && tlcAskAiPayload && tlcAskAiPayload.length > 0) {
        payload = {
          objects: Array.isArray(tlcAskAiPayload)
            ? tlcAskAiPayload
            : [tlcAskAiPayload],
          query: userInput,
        };
      }

      // 🟢 CASE 2: If TLC page and tlcAskAiHistoryPayload exists (filters only → fetch filtered data)
      else if (isTlcPage && tlcAskAiHistoryPayload) {
        const { start, end } = tlcAskAiHistoryPayload.filters;

        const query = new URLSearchParams({
          start: new Date(start).toISOString().split("T")[0],
          end: new Date(end).toISOString().split("T")[0],
        });

        const filterApiResponse = await axios.get(
          `https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/filter?${query}`
        );

        console.log("filter api response in ask ai", filterApiResponse);

        const filteredPayload = filterApiResponse.data?.payload || [];

        payload = {
          objects: filteredPayload,
          query: userInput,
        };
      }

      // 🟢 CASE 3: Non-TLC pages
      else {
        payload = { query: userInput };
        if (documentString) payload.document = documentString;
      }

      console.log("🟡 Final payload in ask ai:", payload);

      const baseURL =
        "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io";
      const apiURL = isTlcPage
        ? `${baseURL}/tlc/payroll/payroll_askai`
        : `${baseURL}/askai`;

      console.log("Payload sending to API:", payload);
      const response = await axios.post(apiURL, payload);

      console.log("response from ask ai", response);

      const botReply = isTlcPage
        ? response.data?.answer || "No response"
        : response.data?.response?.text || response.data?.response || "No response";

      setMessages((prev) =>
        prev.map((msg) => (msg.temp ? { sender: "bot", text: botReply } : msg))
      );
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.temp ? { sender: "bot", text: "Something went wrong!" } : msg
        )
      );
    }
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

            <div className={isTlcPage ? "tlc-custom-main-content" : "main-content"}>
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

                <div style={{ display: selectedRole === "Participant Events & Incident Management" ? "block" : "none" }}>
                  <Client_Event_Reporting selectedRole='Participant Events & Incident Management' />
                </div>
                <div style={{ display: selectedRole === "Incident Auditing" ? "block" : "none" }}>
                  <IncidentAuditing selectedRole='Incident Auditing' />
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

                <div style={{ display: selectedRole === "TLC Payroll Custom" ? "block" : "none" }}>
                  {/* <CustomReporting selectedRole="Custom Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} /> */}
                  <TlcCustomerReporting user={user} setTlcAskAiPayload={setTlcAskAiPayload} tlcAskAiPayload={tlcAskAiPayload} setTlcAskAiHistoryPayload={setTlcAskAiHistoryPayload} tlcAskAiHistoryPayload={tlcAskAiHistoryPayload} />
                </div>

                <div style={{ display: selectedRole === "Smart Onboarding (Staff)" ? "block" : "none" }}>
                  <HRAnalysis handleClick={handleClick} selectedRole="Smart Onboarding (Staff)" setShowFeedbackPopup={setShowFeedbackPopup} user={user} />
                </div>

                <div style={{ display: selectedRole === "Client Profitability & Service" ? "block" : "none" }}>
                  <CareServicesEligibility selectedRole="Client Profitability & Service" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Incident Report" ? "block" : "none" }}>
                  <IncidentReport selectedRole="Incident Report" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Quality and Risk Reporting" ? "block" : "none" }}>
                  <QualityandRisk selectedRole="Quality and Risk Reporting" handleClick={handleClick} setShowFeedbackPopup={setShowFeedbackPopup} />
                </div>

                <div style={{ display: selectedRole === "Smart Rostering" ? "block" : "none" }}>
                  <RosteringDashboard />
                </div>
              </>

              <Modal isVisible={isModalVisible} onClose={handleModalClose}></Modal>


              <div className="ask-ai-button" onClick={() => setShowAIChat(!showAIChat)}>
                <img src={askAiStar} alt="askAiStar" style={{ width: "22px", height: "22px" }} />
                <div style={{ fontFamily: "Inter", fontSize: "16px", color: "white" }}>Ask AI</div>
              </div>

              {showAIChat && (
                <div style={{ position: "fixed", bottom: "85px", right: "30px", width: "45%", height: "80%", backgroundColor: "#FFFEFF", borderRadius: "24px", zIndex: 999, display: "flex", flexDirection: "column", justifyContent: "space-between", border: '1.09px solid #6C4CDC', boxShadow: '0px 4.36px 65.42px 0px #FFFFFF03', padding: ' 14px 30px' }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", borderTopRightRadius: "24px", borderTopLeftRadius: "24px", }}>
                    <RxCrossCircled size={24} color="#6c4cdc" onClick={() => setShowAIChat(false)} style={{ cursor: "pointer" }} />
                  </div>
                  {messages.length === 0 &&
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={purpleStar} alt='blue-star' style={{ width: '36px', height: 'auto' }} />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '24px', fontFamily: 'Inter', fontWeight: '500' }}>
                        Got a question? Just ask AI.
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '400', marginTop: '10px' }}>
                        Your Aged Care & NDIS helper.<br></br>Ask a question get simple, trusted guidance.
                      </div>
                    </div>
                  }

                  <div style={{ flex: 1, marginTop: "10px", overflowY: "auto", padding: "10px" }}>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                          marginBottom: "8px",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start", position: "relative" }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <img
                              src={aksAiPurpleStar}
                              alt="user icon"
                              style={{ width: "32px", height: "32px", display: msg.sender === 'user' ? 'none' : 'block' }}
                            />
                            <div
                              style={{
                                backgroundColor: msg.sender === "user" ? "#F9F8FF" : "#6C4CDC",
                                padding: "10px",
                                borderRadius: "10px",
                                maxWidth: "75%",
                                fontSize: "14px",
                                textAlign: "left",
                                color: msg.sender === "user" ? "black" : "white",
                                fontFamily: "Inter",
                                border: msg.sender === 'user' ? '1px solid #6c4cdc' : 'none'
                              }}
                              className="ask-ai-res-div"
                            >
                              <ReactMarkdown
                                children={msg.text
                                  .replace(/```(?:\w+)?\n?/, "")
                                  .replace(/```$/, "")
                                }
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                              />
                            </div>
                            <img
                              src={askAiPersonIcon}
                              alt="user icon"
                              style={{ width: "38px", height: "38px", display: msg.sender === 'user' ? 'block' : 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                  <div>
                    {messages.length === 0 &&
                      <div>
                        <div style={{ textAlign: 'left', marginBottom: '14px', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
                          Suggestions
                        </div>
                        <div style={{ display: "flex", flexDirection: 'column', width: '45%' }}>
                          {Suggestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => { }}
                              style={{ padding: "10px", borderRadius: "8px", background: "#F9F8FF", border: "1px solid #6c4cdc", cursor: "pointer", marginBottom: '10px', textAlign: 'left' }}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    }

                    <div style={{ position: "relative", marginTop: "10px", marginBottom: "16px", width: "100%", display: "flex", alignSelf: "center" }}>
                      <input
                        type="text"
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        style={{ width: "100%", padding: "12px 40px 12px 12px", borderRadius: "30px", border: "1px solid  #1602114D" }}
                      />
                      <FaCircleArrowRight onClick={handleSend} size={22} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6C4CDC" }} />
                    </div>

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
