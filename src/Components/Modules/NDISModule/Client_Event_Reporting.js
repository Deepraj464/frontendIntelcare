import React, { useState } from "react";
import axios from "axios";
import "../../../Styles/ClientEvent.css";
import UploadFiles from "../../UploadFiles";
import star from '../../../Images/star.png';
import Toggle from "react-toggle";

const BASE_URL =
  "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io";

const Client_Event_Reporting = (props) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportMode, setReportMode] = useState("one-time");
  const [loading, setLoading] = useState(false);
  const [stage3Data, setStage3Data] = useState(null);
  const [askAIResult, setAskAIResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [loadingAskAI, setLoadingAskAI] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    if (filesArray.length + selectedFiles.length > 10) {
      alert("You can select up to 10 files only");
      return;
    }
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleAnalyse = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }

    setLoading(true);
    setStage3Data(null);
    setAskAIResult(null);
    setUploadProgress(0);

    let fakeProgressInterval;

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      const params = {
        include_text: 0,
        run_stage3: 1,
        concurrency: 4,
      };

      // 🔹 Start fake gradual progress immediately
      fakeProgressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 95) return prev + 1; // keep it below 100%
          return prev;
        });
      }, 300); // adjust speed here

      const processRes = await axios.post(
        `${BASE_URL}/ndis/clients-events/report`,
        formData,
        {
          params,
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 900000,
        }
      );

      if (processRes.data?.stage3) {
        const s3 = processRes.data.stage3;

        const eventsArray = Array.isArray(s3)
          ? s3
          : Object.keys(s3)
            .sort((a, b) => {
              const numA = parseInt(a.replace(/\D/g, ""), 10);
              const numB = parseInt(b.replace(/\D/g, ""), 10);
              return numA - numB;
            })
            .map((key) => s3[key]);

        setStage3Data(eventsArray);
      } else {
        alert("Stage 3 data not found in response");
      }

      // ✅ Jump to 100% once backend responds
      setUploadProgress(100);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong! Check console for details.");
    } finally {
      setLoading(false);
      if (fakeProgressInterval) clearInterval(fakeProgressInterval);

      // reset after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };




  // const handleAskAI = async () => {
  //   if (!stage3Data) {
  //     alert("Please run analysis first");
  //     return;
  //   }
  //   if (!question.trim()) {
  //     alert("Please enter a question");
  //     return;
  //   }

  //   setLoadingAskAI(true);
  //   setAskAIResult(null);

  //   try {
  //     const stage3Obj = {};
  //     stage3Data.forEach((content, idx) => {
  //       stage3Obj[`event${idx + 1}`] = content;
  //     });

  //     const formData = new FormData();
  //     selectedFiles.forEach((file) => formData.append("files", file));
  //     formData.append("question", question);
  //     formData.append("stage3", JSON.stringify(stage3Obj));
  //     formData.append("concurrency", 6);
  //     formData.append("include_text", 0);

  //     const askAIRes = await axios.post(
  //       `${BASE_URL}/clients-events/askai`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //         timeout: 900000,
  //       }
  //     );

  //     setAskAIResult(
  //       askAIRes.data.answer_markdown.replace(/\. /g, ".\n\n") ||
  //       "No answer received"
  //     );
  //   } catch (err) {
  //     console.error("Ask AI Error:", err.response?.data || err);
  //     alert("Something went wrong in Ask AI! Check console for details.");
  //   } finally {
  //     setLoadingAskAI(false);
  //   }
  // };

  const monthlyReports = [
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
    { date: "12 September", type: "SE", format: "Txt", link: "#" },
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
  ];

  return (
    <div className="upload-page">
      {/* Toggle */}
      <div className="financial-header">
        <div className="role-toggle-container">
          <div
            style={{
              backgroundColor:
              reportMode === "one-time" ? "#6C4CDC" : "#FFFFFF",
              color: reportMode === "one-time" ? "white" : "#6C4CDC",
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: "500",
            }}
            className="role-toggle"
            onClick={() => setReportMode("one-time")}
          >
            One Time
          </div>
          <div
            onClick={() => setReportMode("history")}
            style={{
              backgroundColor:
              reportMode === "history" ? "#6C4CDC" : "#FFFFFF",
              color:  reportMode === "history" ? "white" : "#6C4CDC",
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
              cursor: "pointer",
              padding: "6px 12px",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: "500",
            }}
            className="role-toggle"
          >
            History
          </div>
        </div>

        <h1 className="titless">PARTICIPANT EVENTS & INCIDENT MANAGEMENT</h1>
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
      <div className="info-table">
        <div className="table-headerss">
          <span>If You Upload This...</span>
          <span>Our AI Will Instantly...</span>
        </div>
        <div className="table-rowss">
          <div>Care Management System - Shift Notes Report</div>
          <ul>
            <li>Detects unreported incidents under NDIS rules</li>
            <li>Identifies high-risk participants needing follow-up.</li>
          </ul>
        </div>
        <div className="table-rowss">
          <div>Care Management System - Progress Notes Report</div>
          <ul>
            <li>Links repeated issues to specific staff or time slots.</li>
            <li>Predicts potential restrictive practice or escalation risks.</li>
          </ul>
        </div>
        <div className="table-rowss">
          <div>Rostering System - Shift Logs / Daily Support Notes Report</div>
          <ul>
            <li>Ensures incident and reportable event compliance.</li>
            <li>Tracks quality-of-support indicators from shift notes and progress notes.</li>
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
      {/* One Time Mode */}
      {reportMode === "one-time" && (
        <>
          <>
            <div
              className="uploader-grid"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ width: '50%' }}>
                <UploadFiles
                  files={selectedFiles}
                  setFiles={setSelectedFiles}
                  title={props.selectedRole}
                  subtitle="Upload multiple .docx, .xlsx, .xls, .csv, .pdf file"
                  fileformat=".xlsx,.csv,.xls,.docx,.pdf"
                  removeFile={(index) => {
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  multiple={true}
                  isProcessing={loading}
                />
              </div>
            </div>

            <button
              className="analyse-btn"
              disabled={loading}
              style={{ backgroundColor: '#000', marginTop: '20px' }}
              onClick={handleAnalyse}
            >
              {loading
                ? `Analysing...${uploadProgress}%`
                : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Analyse<img src={star} alt='img' style={{ width: '20px', height: '20px' }} /></div>}
            </button>
          </>

          {/* Stage 3 Events */}
          {stage3Data && (
            <div className="events-grid">
              {stage3Data.map((content, idx) => (
                <div key={idx} className="event-card">
                  <h4>Event {idx + 1}</h4>
                  <div
                    className="event-content"
                    dangerouslySetInnerHTML={{
                      __html: content
                        .replace(/^###\s*/gm, "")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Ask AI Section */}
          {/* {stage3Data && (
            <div className="ask-ai-container">
              <label style={{ marginLeft: "8px" }}>Ask AI a Question:</label>
              <div className="ask-ai-input-wrapper">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                />
                <button onClick={handleAskAI} disabled={loadingAskAI}>
                  {loadingAskAI ? "Thinking..." : "Ask"}
                </button>
              </div>

              {askAIResult && (
                <div className="results-box">
                  <h3>AI Answer</h3>
                  <p>{askAIResult}</p>
                </div>
              )}
            </div>
          )} */}
        </>
      )}

      {/* Monthly Report Mode */}
      {reportMode === "history" && (
        <>
          <h1 className="page-title">History</h1>
          <table className="report-table">
            <thead>
              <tr>
                <th>Report Date</th>
                <th>Type Of Report</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {monthlyReports.map((report, idx) => (
                <tr key={idx}>
                  <td>{report.date}</td>
                  <td>
                    <span className="report-type-badge">{report.type}</span>{" "}
                    {report.format}
                  </td>
                  <td>
                    <a href={report.link} target="_blank" rel="noreferrer">
                      <span className="link-icon">↗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Client_Event_Reporting;
