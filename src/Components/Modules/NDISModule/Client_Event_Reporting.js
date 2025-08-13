import React, { useState } from "react";
import axios from "axios";
import "../../../Styles/ClientEvent.css";

const BASE_URL =
  "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io";

const Client_Event_Reporting = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportMode, setReportMode] = useState("one-time");
  const [loading, setLoading] = useState(false);
  const [stage3Data, setStage3Data] = useState(null);
  const [askAIResult, setAskAIResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [loadingAskAI, setLoadingAskAI] = useState(false);

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

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      const params = {
        include_text: 0,
        run_stage3: 1,
        concurrency: 4,
      };

      const processRes = await axios.post(
        `${BASE_URL}/clients-events/report`,
        formData,
        {
          params,
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 900000,
        }
      );

      if (processRes.data?.stage3) {
        const s3 = processRes.data.stage3;

        // Convert object to array of event strings, sorted by number
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
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong! Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    if (!stage3Data) {
      alert("Please run analysis first");
      return;
    }
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setLoadingAskAI(true);
    setAskAIResult(null);

    try {
      const stage3Obj = {};
      stage3Data.forEach((content, idx) => {
        stage3Obj[`event${idx + 1}`] = content;
      });

      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("question", question);
      formData.append("stage3", JSON.stringify(stage3Obj));
      formData.append("concurrency", 6);
      formData.append("include_text", 0);

      const askAIRes = await axios.post(
        `${BASE_URL}/clients-events/askai`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 900000,
        }
      );

      setAskAIResult(
        askAIRes.data.answer_markdown.replace(/\. /g, ".\n\n") ||
          "No answer received"
      );
    } catch (err) {
      console.error("Ask AI Error:", err.response?.data || err);
      alert("Something went wrong in Ask AI! Check console for details.");
    } finally {
      setLoadingAskAI(false);
    }
  };

  const monthlyReports = [
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
    { date: "12 September", type: "SE", format: "Txt", link: "#" },
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
    { date: "12 Aug", type: "SE", format: "Txt", link: "#" },
  ];

  return (
    <div className="upload-page">
      {/* Toggle */}
      <div className="report-toggle">
        <button
          className={reportMode === "one-time" ? "active" : ""}
          onClick={() => setReportMode("one-time")}
        >
          One Time
        </button>
        <button
          className={reportMode === "monthly" ? "active" : ""}
          onClick={() => setReportMode("monthly")}
        >
          Monthly Report
        </button>
      </div>

      {/* One Time Mode */}
      {reportMode === "one-time" && (
        <>
          <h1 className="page-title">Client Event & Incident Reporting</h1>
          <p className="page-subtitle">Upload your data</p>

          {/* Upload */}
          <div className="upload-container">
            <div className="upload-header">
              <span className="upload-title">
                Client Event & Incident Reporting
              </span>
              <div className="info-icon" title="Upload files for analysis">
                ?
              </div>
            </div>

            <div className="upload-box">
              <div className="upload-icon">☁️</div>
              <div className="upload-text">Drop file or browse</div>
              <div className="upload-format">
                Format: .docx, .xlsx, .xls, .csv, .pdf
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".docx,.xlsx,.xls,.csv,.pdf"
                id="file-input"
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="browse-files-btn">
                Browse Files
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="file-list">
                {selectedFiles.map((file, idx) => (
                  <p key={idx} className="file-name">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Analyse Button */}
          <button
            className="analyse-btn"
            onClick={handleAnalyse}
            disabled={loading}
          >
            {loading ? "Analysing..." : "Analyse ✨"}
          </button>

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
          {stage3Data && (
            <div className="ask-ai-container">
              <label>Ask AI a Question:</label>
              <div className="ask-ai-input-wrapper">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                />
                <button onClick={handleAskAI} disabled={loadingAskAI}>
                  {loadingAskAI ? "Thinking..." : "Ask 🤖"}
                </button>
              </div>

              {askAIResult && (
                <div className="results-box">
                  <h3>AskAI Answer</h3>
                  <p>{askAIResult}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Monthly Report Mode */}
      {reportMode === "monthly" && (
        <>
          <h1 className="page-title">Monthly Reports</h1>
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
