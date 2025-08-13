import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import UploadFiles from "../../UploadFiles";
import star from "../../../Images/star.png";
import "../../../Styles/UploaderPage.css";
import SummaryReport from "../../SummaryReportViewer";
import "../../../Styles/UploaderPage.css";
const CareServicesEligibility = (props) => {
  const [carePlanreportFiles, setCarePlanReportFiles] = useState([]);
  const [isAnalysingCareReportLoading, setIsAnalysingCareReportLoading] =
    useState(false);
  const [isAnalysedCareReportProgress, setIsAnalysedCareReportProgress] =
    useState(0);
  const [analysedCareReportdata, setAnalysedCareReportdata] = useState([]);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleButtonClick = () => {
    setIsConsentChecked(true);
  };
  const handleAnalyseReports = async () => {
    if (carePlanreportFiles.length === 0) {
      alert("Please upload a file.");
      return;
    }

    props.handleClick();

    let progressInterval;
    try {
      setIsAnalysingCareReportLoading(true);
      setIsAnalysedCareReportProgress(1);

      // Start virtual progress
      progressInterval = setInterval(() => {
        setIsAnalysedCareReportProgress((prev) =>
          prev < 90 ? prev + 4 : prev
        );
      }, 4000);

      const file = carePlanreportFiles[0];
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const headers = sheetData[0];
      const dataRows = sheetData.slice(1); // skip header row

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowDict = {};
        headers.forEach((key, index) => {
          rowDict[key] = row[index];
        });

        try {
          const response = await axios.post(
            "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/care-analyze",
            { input_row: rowDict }
          );

          if (response.status === 200) {
            const result = response.data;
            setAnalysedCareReportdata((prev) => [...(prev || []), result]);

            // ✅ First row: show UI and stop loading/progress
            if (i === 0) {
              clearInterval(progressInterval);
              setIsAnalysedCareReportProgress(100);
              setIsAnalysingCareReportLoading(false);
            }
          }
        } catch (err) {
          console.error(`Error analyzing row ${i + 1}:`, err);

          if (i === 0) {
            clearInterval(progressInterval);
            setIsAnalysingCareReportLoading(false);
            alert("Error analyzing first row.");
          }
        }
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("Something went wrong while analyzing the report.");
      clearInterval(progressInterval);
      setIsAnalysingCareReportLoading(false);
    }
  };
  useEffect(() => {
    if (analysedCareReportdata.length !== 0) {
      const timer = setTimeout(() => {
        props.setShowFeedbackPopup(true);
      }, 60000); // 1 minute

      return () => clearTimeout(timer); // Clear on unmount or change
    }
  }, [analysedCareReportdata]);

  const resetCareServicesEligibilityState = () => {
    setCarePlanReportFiles([]);
    setIsAnalysingCareReportLoading(false);
    setIsAnalysedCareReportProgress(0);
    setAnalysedCareReportdata([]);
    setIsConsentChecked(false);
  };

  return (
    <>
      {analysedCareReportdata.length === 0 ? (
        <>
          <div className="selectedModule">{props.selectedRole}</div>
          <div className="selectedModuleDescription">
            Upload your data and<br></br>get instant insights into spending,
            funding, and what needs attention
          </div>
          <div
            className="uploader-grid"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ width: "50%" }}>
              <UploadFiles
                files={carePlanreportFiles}
                setFiles={setCarePlanReportFiles}
                title={props.selectedRole}
                subtitle="Upload a single .xlsx, .csv or .xls file"
                fileformat=".xlsx,.csv,.xls"
                removeFile={(index) => {
                  setCarePlanReportFiles((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
                content="Each individual row of the Excel/CSV sheet should represent  a single clients information"
                multiple={false}
                isProcessing={isAnalysingCareReportLoading}
              />
            </div>
          </div>

          <button
            className="analyse-btn"
            disabled={isAnalysingCareReportLoading}
            style={{ backgroundColor: "#000", marginTop: "20px" }}
            onClick={handleAnalyseReports}
          >
            {isAnalysingCareReportLoading ? (
              `Analysing... ${isAnalysedCareReportProgress}%`
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
        </>
      ) : (
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
              summaryText={analysedCareReportdata}
              selectedRole={props.selectedRole}
              resetCareServicesEligibilityState={
                resetCareServicesEligibilityState
              }
            />
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
      )}
    </>
  );
};

export default CareServicesEligibility;
