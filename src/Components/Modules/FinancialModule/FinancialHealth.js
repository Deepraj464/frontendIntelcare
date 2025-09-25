import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import SummaryReport from "../../SummaryReportViewer";
import UploadFiles from "../../UploadFiles";
import UploaderCSVBox from "../../UploaderCSVBox";
import star from "../../../Images/star.png";
import "../../../Styles/FinancialHealth.css";
import "../../../Styles/UploaderPage.css";
import NewReportIcon from "../../../Images/NewReportIcon.png";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import UploadFinancialFiles from "../../UploadFinancialFiles";
import ChartsDisplay from "../../ChartDisplay";
import Plot from "react-plotly.js";
import response from "./response_api_only";
import PreviewDataSection from "./PreviewDataSection";

const FinancialHealth = (props) => {
  const [financialReportFiles, setFinancialReportFiles] = useState([]);
  const [financialTemplate, setFinancialTemplate] = useState(null);
  const [standardFinancialExcelFile, setStandardFiancialExcelFile] = useState(
    []
  );
  const [uploadedFinancialExcelFile, setUploadedFinancialExcelFile] =
    useState(null);
  const [financialReport, setFinancialReport] = useState(null);
  const [financialVisualizations, setFinancialVisualizations] = useState([]);
  const [isFinancialProcessing, setIsFinancialProcessing] = useState(false);
  const [financialprogress, setFinancialProgress] = useState(0);
  const [financialshowReport, setFinancialShowReport] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  // New Addition......
  const [selectedActor, setSelectedActor] = useState("NDIS");
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [apiExcelUrls, setApiExcelUrls] = useState([]);
  const [title, setTitle] = useState("");
  const raw = response
  // console.log("raw",raw)
  // const excelUrls = Object.values(raw.excel_exports)
  //   .flat()
  //   .map(item => item.data_url)
  //   .filter(Boolean);
  // console.log("excel urls", excelUrls)

  const [titleArray, setTitleArray] = useState([]);

  // Inside your useEffect for merging API files
  // useEffect(() => {
  //   try {
  //     const mergedWorkbook = XLSX.utils.book_new();
  //     const usedSheetNames = new Set();

  //     const excelFiles = Object.values(raw.excel_exports).flat();
  //     const titlesArray = [];

  //     for (const fileData of excelFiles) {
  //       let base64 = fileData.data_url;
  //       let fileTitle = fileData.title;
  //       titlesArray.push(fileTitle);

  //       const base64String = base64.includes("base64,") ? base64.split("base64,")[1] : base64;
  //       const binary = atob(base64String);
  //       const arrayBuffer = new ArrayBuffer(binary.length);
  //       const view = new Uint8Array(arrayBuffer);
  //       for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i) & 0xff;

  //       const workbook = XLSX.read(arrayBuffer, { type: "array" });

  //       for (const sheetName of workbook.SheetNames) {
  //         let newSheetName = fileTitle.slice(0, 31);
  //         let counter = 1;
  //         while (usedSheetNames.has(newSheetName)) {
  //           const suffix = `_${counter++}`;
  //           newSheetName = fileTitle.slice(0, 31 - suffix.length) + suffix;
  //         }
  //         usedSheetNames.add(newSheetName);
  //         XLSX.utils.book_append_sheet(mergedWorkbook, workbook.Sheets[sheetName], newSheetName);
  //       }
  //     }

  //     setTitleArray(titlesArray);

  //     const wbout = XLSX.write(mergedWorkbook, { bookType: "xlsx", type: "binary" });
  //     const blob = new Blob([s2ab(wbout)], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const url = URL.createObjectURL(blob);
  //     setApiExcelUrls([url]);
  //   } catch (err) {
  //     console.error("Error merging API Excel files:", err);
  //   }
  // }, [raw?.excel_exports]);
  const handleButtonClick = () => {
    setIsConsentChecked(true);
  };

  const handleDownloadUploadedExcel = () => {
    if (!uploadedFinancialExcelFile) {
      alert("No Uploaded Excel file to download.");
      return;
    }

    const url = URL.createObjectURL(uploadedFinancialExcelFile);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", uploadedFinancialExcelFile.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  function toAWSDateTime(day, month, year = new Date().getFullYear()) {
    if (!day || !month) return null; // Handle missing values

    // Ensure day and month are two digits
    const dd = day.toString().padStart(2, "0");
    const mm = month.toString().padStart(2, "0");

    return `${year}-${mm}-${dd}T00:00:00Z`;
  }

  const handleDownloadStandardExcel = async () => {
    if (
      !Array.isArray(standardFinancialExcelFile) ||
      standardFinancialExcelFile.length === 0
    ) {
      alert("No Standard Excel files to download.");
      return;
    }

    const mergedWorkbook = XLSX.utils.book_new();
    const usedSheetNames = new Set();

    for (const file of standardFinancialExcelFile) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Get base name without extension and limit to 31 characters
      const rawName = file.name.replace(/\.xlsx$/i, "");
      let sheetName = rawName.slice(0, 31); // Truncate to 31 chars

      // Ensure uniqueness if names clash
      let counter = 1;
      while (usedSheetNames.has(sheetName)) {
        const suffix = `_${counter++}`;
        const base = rawName.slice(0, 31 - suffix.length);
        sheetName = base + suffix;
      }

      usedSheetNames.add(sheetName);
      XLSX.utils.book_append_sheet(mergedWorkbook, worksheet, sheetName);
    }

    const wbout = XLSX.write(mergedWorkbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const blob = new Blob([s2ab(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Combined_Standard_Report.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAnalyse = async () => {
    // Validation checks
    if (financialReportFiles.length === 0 && !syncEnabled) {
      alert("Please upload the report files or enable sync.");
      return;
    }
    if (syncEnabled && (!startDay || !startMonth || !endDay || !endMonth)) {
      alert("Please select both start and end dates when sync is enabled.");
      return;
    }

    props.handleClick();
    setIsFinancialProcessing(true);
    setFinancialProgress(1);

    const interval = setInterval(() => {
      setFinancialProgress((prev) => (prev < 92 ? prev + 2 : prev));
    }, 5000);

    try {
      const formData = new FormData();

      // Determine type correctly
      let type = "upload";
      if (syncEnabled && financialReportFiles.length > 0) type = "hybrid";
      else if (syncEnabled && financialReportFiles.length === 0) type = "api";

      // Handle dates
      let fromDate, toDate;
      if (type === "api" || type === "hybrid") {
        fromDate = toAWSDateTime(startDay, startMonth);
        toDate = toAWSDateTime(endDay, endMonth);
        if (!fromDate || !toDate) {
          alert("Please select valid start and end dates for sync mode.");
          clearInterval(interval);
          setIsFinancialProcessing(false);
          return;
        }
      } else {
        const currentYear = new Date().getFullYear();
        fromDate = `${currentYear}-01-01T00:00:00Z`;
        toDate = `${currentYear}-12-31T23:59:59Z`;
      }

      // Validate user email
      if (!props.user?.email) {
        alert("User email is required. Please log in again.");
        clearInterval(interval);
        setIsFinancialProcessing(false);
        return;
      }

      const userEmail = props.user.email.trim().toLowerCase();
      // const userEmail = "kris@curki.ai"
      // console.log("Using email:", userEmail);

      // Append required fields
      formData.append("type", type);
      formData.append("userEmail", userEmail);
      formData.append("provider", selectedActor);
      formData.append("fromDate", fromDate);
      formData.append("toDate", toDate);

      // Append files if needed
      if (type === "upload" || type === "hybrid") {
        if (financialReportFiles.length === 0) {
          alert("No files selected for upload.");
          clearInterval(interval);
          setIsFinancialProcessing(false);
          return;
        }
        financialReportFiles.forEach((file) => formData.append("files", file));
      }

      // --- Step 1: Call Analysis API ---
      const reportEndpoint = "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/report-middleware"
      let analysisData = null;

      if (userEmail === "kris@curki.ai" && type === "api") {
        // Call immediately
        const analysisRes = await axios.post(
          reportEndpoint,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
        console.log("Fast analysisRes", analysisRes);
        analysisData = analysisRes.data;

        if (!analysisData) throw new Error("Empty response from analysis API");

        // Artificial delay: wait 45s before continuing
        await new Promise((resolve) => setTimeout(resolve, 45000));
      } else {
        // Normal flow
        const analysisRes = await axios.post(
          reportEndpoint,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
        console.log("analysisRes", analysisRes);
        analysisData = analysisRes.data;

        if (!analysisData) throw new Error("Empty response from analysis API");
      }

      // --- Step 2: Build Visualization Payload ---
      let vizPayload;

      if (userEmail === "kris@curki.ai") {
        if (type === "api") {
          // Kris + API = requires parsed wrapping
          vizPayload = {
            reportResponse: {
              parsed: {
                type,
                provider: selectedActor,
                final: analysisData?.final || analysisData?.parsed?.final || {},
                figures: analysisData?.figures || analysisData?.parsed?.figures || [],
              },
            },
            from_date: fromDate,
            to_date: toDate,
          };
        } else {
          // Kris + Upload/Hybrid = use response directly
          vizPayload = {
            reportResponse: analysisData,
            from_date: fromDate,
            to_date: toDate,
          };
        }
      } else {
        // Non-Kris = normal behavior
        vizPayload = {
          reportResponse: analysisData,
          from_date: fromDate,
          to_date: toDate,
        };
      }


      // --- Step 3: Call Visualization API ---
      let vizData = null;
      console.log("vizload", vizPayload)
      if (userEmail !== "kris@curki.ai" || (userEmail === "kris@curki.ai" && type === "upload")) {
        const vizRes = await axios.post(
          "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/vizualize-reports",
          vizPayload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("vizRes", vizRes)
        vizData = vizRes.data;
      }

      // --- Step 4: Normalize Figures ---
      const normalizeFigures = (source) => {
        console.log("source", source)
        // Case: Kris or image-based figures
        if (Array.isArray(source?.figures)) {
          return source.figures.map((fig, i) => {
            if (fig.data_base64) {
              return {
                type: "image",
                image: `data:${fig.mime || "image/png"};base64,${fig.data_base64}`,
                metricName: fig.key || `Figure ${i + 1}`,
              };
            }
            if (fig.figure) {
              return {
                type: "json",
                figure: fig.figure,
                metricName: fig.key || `Figure ${i + 1}`,
              };
            }
            return null;
          }).filter(Boolean);
        }

        // Case: Non-Kris viz JSON charts
        if (Array.isArray(source?.data?.figures)) {
          return source.data.figures.map((fig, i) => ({
            type: "json",
            figure: fig.figure,
            metricName: fig.key || `Figure ${i + 1}`,
          }));
        }

        // Case: attachments (PNG images)
        if (Array.isArray(source?.data?.attachments)) {
          return source.data.attachments.map((att, i) => ({
            type: "image",
            image: `data:image/png;base64,${att.file_base64}`,
            metricName: att.filename
              ? att.filename.replace(/\.[^/.]+$/, "")
              : `Attachment ${i + 1}`,
          }));
        }

        return [];
      };
      console.log("vizPayload?.reportResponse?.excel_exports",vizPayload?.reportResponse?.excel_exports)
      if (type === "api") {
        if (vizPayload?.reportResponse?.excel_exports) {
          try {
            const mergedWorkbook = XLSX.utils.book_new();
            const usedSheetNames = new Set();

            const excelFiles = Object.values(vizPayload?.reportResponse?.excel_exports).flat();
            const titlesArray = [];

            for (const fileData of excelFiles) {
              let base64 = fileData.data_url;
              let fileTitle = fileData.title;
              titlesArray.push(fileTitle);

              const base64String = base64.includes("base64,") ? base64.split("base64,")[1] : base64;
              const binary = atob(base64String);
              const arrayBuffer = new ArrayBuffer(binary.length);
              const view = new Uint8Array(arrayBuffer);
              for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i) & 0xff;

              const workbook = XLSX.read(arrayBuffer, { type: "array" });

              for (const sheetName of workbook.SheetNames) {
                let newSheetName = fileTitle.slice(0, 31);
                let counter = 1;
                while (usedSheetNames.has(newSheetName)) {
                  const suffix = `_${counter++}`;
                  newSheetName = fileTitle.slice(0, 31 - suffix.length) + suffix;
                }
                usedSheetNames.add(newSheetName);
                XLSX.utils.book_append_sheet(mergedWorkbook, workbook.Sheets[sheetName], newSheetName);
              }
            }

            setTitleArray(titlesArray);

            const wbout = XLSX.write(mergedWorkbook, { bookType: "xlsx", type: "binary" });
            const blob = new Blob([s2ab(wbout)], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);
            setApiExcelUrls([url]);
          } catch (err) {
            console.error("Error merging API Excel files:", err);
          }
        }
      } else {
        setApiExcelUrls([]); // clear for non-API types
      }
      console.log("apiExcelUrls in handle analyse", apiExcelUrls)
      const figures = normalizeFigures(userEmail === "kris@curki.ai" && type !== "upload" ? analysisData : vizData);

      // --- Step 5: Save state ---
      setFinancialReport(analysisData.final);
      setFinancialVisualizations(figures);
      setFinancialShowReport(true);
      setIsFinancialProcessing(false);
      setFinancialProgress(100);

    } catch (err) {
      console.error("Error in analysis pipeline:", err);
      if (err.response) {
        const { status, data } = err.response;
        alert(`Error ${status}: ${data?.error || data?.message || "Unknown server error"}`);
      } else if (err.request) {
        alert("Network error. Please check your internet connection.");
      } else {
        alert(`Unexpected error: ${err.message}`);
      }
    } finally {
      clearInterval(interval);
      setIsFinancialProcessing(false);
      setFinancialProgress(100);
    }
  };

  const isButtonDisabled = !syncEnabled && financialReportFiles.length === 0;

  useEffect(() => {
    if (financialshowReport) {
      const timer = setTimeout(() => {
        props.setShowFeedbackPopup(true);
      }, 60000); // 1 minute

      return () => clearTimeout(timer); // Clear on unmount or change
    }
  }, [financialshowReport]);

  const resetFinancialHealthState = () => {
    setFinancialReportFiles([]);
    setFinancialTemplate(null);
    setStandardFiancialExcelFile([]);
    setUploadedFinancialExcelFile(null);
    setFinancialReport(null);
    setFinancialVisualizations([]);
    setIsFinancialProcessing(false);
    setFinancialProgress(0);
    setFinancialShowReport(false);
    setIsConsentChecked(false);
  };
  console.log("financial Visualizations", financialVisualizations);

  return (

    <>
      {!financialshowReport ? (
        <>
          {/* <PreviewDataSection
            apiExcelUrls={apiExcelUrls}
            titles={titleArray} // pass titles as a prop
          /> */}
          {/* Header Section */}
          <div className="financial-header">
            <div className="role-selector">
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "Inter",
                }}
              >
                Who are you?
              </div>
              <div className="role-toggle-container">
                <div
                  onClick={() => setSelectedActor("NDIS")}
                  style={{
                    backgroundColor:
                      selectedActor === "NDIS" ? "#6C4CDC" : "#FFFFFF",
                    color: selectedActor === "NDIS" ? "white" : "#6C4CDC",
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px",
                    cursor: "pointer",
                    padding: "6px 12px",
                    fontSize: "14px",
                    fontFamily: "Inter",
                    fontWeight: "500",
                  }}
                  className="role-toggle"
                >
                  NDIS
                </div>
                <div
                  onClick={() => setSelectedActor("aged-care")}
                  style={{
                    backgroundColor:
                      selectedActor === "aged-care" ? "#6C4CDC" : "#FFFFFF",
                    color: selectedActor === "aged-care" ? "white" : "#6C4CDC",
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
                  Aged Care
                </div>
              </div>
            </div>
            <h1 className="titless">FINANCIAL HEALTH</h1>
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
              <div>Client Funding Statements (NDIS/HCP)</div>
              <ul>
                <li>Find unspent funds expiring soon.</li>
                <li>
                  Show you which clients are under or over-utilising their plans
                </li>
              </ul>
            </div>
            <div className="table-rowss">
              <div>Timesheets & Roster Exports</div>
              <ul>
                <li>Pinpoint overtime hotspots and their cost</li>
                <li>Show wage cost vs revenue for every client and service.</li>
              </ul>
            </div>
            <div className="table-rowss">
              <div>Aged Receivables Report</div>
              <ul>
                <li>Triage overdue NDIS & client invoices.</li>
                <li>
                  Predict next week's cash flow based on what's still unpaid.
                </li>
              </ul>
            </div>
            <div className="table-rowss">
              <div>Profit & Loss Statement</div>
              <ul>
                <li>Analyse your true service line profitability.</li>
                <li>Flag rising costs that are eroding your margin.</li>
              </ul>
            </div>
            <div className="table-rowss">
              <div>Service Delivery Logs</div>
              <ul>
                <li>Find unspent funds expiring soon.</li>
                <li>
                  Show you which clients are under or over-utilising their plans
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
          <div>
            <div
              className="uploader-grid"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div style={{ width: "50%" }}>
                <UploadFinancialFiles
                  files={financialReportFiles}
                  setFiles={setFinancialReportFiles}
                  // title={props.selectedRole}
                  subtitle="Upload multiple .xlsx, .csv or .xls files"
                  fileformat=".xlsx, .csv, .xls"
                  removeFile={(index) => {
                    setFinancialReportFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                  content="Each individual row of the Excel/CSV sheet should represent a single client's information."
                  multiple={true}
                  isProcessing={isFinancialProcessing}
                />
              </div>
            </div>
          </div>

          <button
            className="analyse-btn"
            disabled={isButtonDisabled || isFinancialProcessing}
            style={{
              backgroundColor:
                isButtonDisabled || isFinancialProcessing ? "#A1A1AA" : "#000",
              cursor: isFinancialProcessing ? "not-allowed" : "pointer",
            }}
            onClick={handleAnalyse}
          >
            {isFinancialProcessing ? (
              `${financialprogress}% Processing...`
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                Analyse
                <img
                  src={star}
                  alt="img"
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
            )}
          </button>
          <div
            style={{
              fontSize: "12px",
              color: "grey",
              fontFamily: "Inter",
              fontWeight: "400",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            **Estimated Time to Analyse 4 min**
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "24px",
              marginTop: "14px",
            }}
          >
            <button
              className="new-report-btn"
              onClick={resetFinancialHealthState}
            >
              <img
                src={NewReportIcon}
                alt="newReporticon"
                style={{ width: "24px" }}
              />
              <div>New Report</div>
            </button>
          </div>
          <div className="graph-gridsss">
            {financialVisualizations.map((item, index) => (
              <div key={index} style={{ marginBottom: "30px" }}>
                {item.figure ? (
                  // Case 1: Plotly Graph
                  <Plot
                    data={item.figure.data}
                    layout={{
                      ...item.figure.layout,
                      autosize: true,
                      margin: { t: 120, l: 40, r: 40, b: 40 },
                    }}
                    style={{ width: "100%", height: "400px" }}
                    config={{
                      responsive: true,
                      displayModeBar: false,
                      displaylogo: false,
                    }}
                  />
                ) : item.image ? (
                  // Case 2: Image with title
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={item.image}
                      alt={item.metricName || `Attachment ${index + 1}`}
                      style={{ width: "100%" }}
                    />
                    {/* <h4
                      style={{
                        marginBottom: "10px",
                        fontFamily: "Inter",
                        fontSize: "16px",
                      }}
                    >
                      {item.metricName || `Attachment ${index + 1}`}
                    </h4> */}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div
            className="reports-box"
            style={{ height: "auto", marginTop: "30px", padding: "10px" }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "10px 30px",
                borderRadius: "10px",
              }}
            >
              <SummaryReport
                summaryText={financialReport}
                handleDownloadAnalyedReportUploadedCSV={
                  handleDownloadUploadedExcel
                }
                handleDownloadAnalyedStandardReportCSV={
                  handleDownloadStandardExcel
                }
                selectedRole={props.selectedRole}
                resetFinancialHealthState={resetFinancialHealthState}
              />
              {financialReport && apiExcelUrls?.length > 0 && (
  <PreviewDataSection
    apiExcelUrls={apiExcelUrls}
    titles={titleArray} // pass titles as a prop
  />
)}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px",
                  fontSize: "13px",
                  color: "grey",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="aiConsent"
                    checked={isConsentChecked}
                    readOnly
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                      accentColor: "green",
                      cursor: "pointer",
                    }}
                  />
                  <label htmlFor="aiConsent" style={{ cursor: "pointer" }}>
                    AI-generated content. Only to be used as a guide. I agree to
                    T&C on curki.ai website.
                  </label>
                </div>
                <button
                  onClick={handleButtonClick}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(139, 117, 255, 0.9) 27.88%, #6D51FF 100%)",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  I understand
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FinancialHealth;