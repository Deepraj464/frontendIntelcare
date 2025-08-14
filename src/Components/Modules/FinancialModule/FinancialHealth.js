import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import SummaryReport from "../../SummaryReportViewer";
import UploadFiles from "../../UploadFiles";
import UploaderCSVBox from "../../UploaderCSVBox";
import star from '../../../Images/star.png';
import '../../../Styles/UploaderPage.css';
import NewReportIcon from '../../../Images/NewReportIcon.png';

const FinancialHealth = (props) => {
    const [financialReportFiles, setFinancialReportFiles] = useState([]);
    const [financialTemplate, setFinancialTemplate] = useState(null);
    const [standardFinancialExcelFile, setStandardFiancialExcelFile] = useState([]);
    const [uploadedFinancialExcelFile, setUploadedFinancialExcelFile] = useState(null);
    const [financialReport, setFinancialReport] = useState(null);
    const [financialVisualizations, setFinancialVisualizations] = useState([]);
    const [isFinancialProcessing, setIsFinancialProcessing] = useState(false);
    const [financialprogress, setFinancialProgress] = useState(0);
    const [financialshowReport, setFinancialShowReport] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false);


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

    const handleDownloadStandardExcel = async () => {
        if (!Array.isArray(standardFinancialExcelFile) || standardFinancialExcelFile.length === 0) {
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

        const wbout = XLSX.write(mergedWorkbook, { bookType: "xlsx", type: "binary" });
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
        if (financialReportFiles.length === 0) {
            alert("Please upload the report files.");
            return;
        }

        props.handleClick();
        setIsFinancialProcessing(true);
        setFinancialProgress(1);

        const interval = setInterval(() => {
            setFinancialProgress((prev) => (prev < 92 ? prev + 2 : prev));
        }, 5000);

        try {
            if (props.selectedRole === "Financial Health") {
                let metricMap = {};
                metricMap = {
                    "Hours Monthly": "hours",
                    "Wages Monthly": "wages",
                    "Income by Service Monthly": "income_by_service",
                    "Claimable per week": "claimables",
                };
                const getMetricFromSheetName = (sheetName) => {
                    for (let key in metricMap) {
                        if (sheetName.toLowerCase().includes(key.toLowerCase())) {
                            return metricMap[key];
                        }
                    }
                    return "claimables";
                };
                // console.log('MetricMap', metricMap);
                const generateSheetBlob = async (fileOrBlob, sheetName) => {
                    const buffer = await fileOrBlob.arrayBuffer();
                    const wb = XLSX.read(buffer, { type: "array" });
                    const newWb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(newWb, wb.Sheets[sheetName], sheetName);
                    const arrayBuffer = XLSX.write(newWb, { bookType: "xlsx", type: "array" });
                    return new Blob([arrayBuffer], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                };

                const standardFiles = [];
                const uploadedFiles = [];
                let stdTemplatePath = "";

                if (props.selectedRole === "Financial Health") {
                    stdTemplatePath = "/MonthlyReportTemplate.xlsx";
                }
                const stdTemplateResponse = await fetch(stdTemplatePath);
                const stdTemplateBlob = await stdTemplateResponse.blob();
                const stdBuffer = await stdTemplateBlob.arrayBuffer();
                const stdWorkbook = XLSX.read(stdBuffer, { type: "array" });

                for (const sheetName of stdWorkbook.SheetNames) {
                    const metric = getMetricFromSheetName(sheetName);
                    const sheetBlob = await generateSheetBlob(stdTemplateBlob, sheetName);

                    const formData = new FormData();
                    formData.append("template", sheetBlob, `${sheetName}.xlsx`);
                    financialReportFiles.forEach((file) => formData.append("source_files", file, file.name));
                    formData.append("metric_name", metric);
                    console.log(stdTemplatePath);

                    let standardEndpoint = "";
                    if (props.selectedRole === "Financial Health") {
                        standardEndpoint = "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/header-modules/financial/populate";
                    }

                    const stdAPIRes = await axios.post(
                        standardEndpoint,
                        formData,
                        { responseType: 'blob' }
                    );
                    const stdFile = new File([stdAPIRes.data], `${sheetName}_Standard_Report.xlsx`, {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    standardFiles.push(stdFile);
                }
                setStandardFiancialExcelFile(standardFiles);

                let uploadedExcelFileTemp = null;
                if (financialTemplate) {
                    const buffer = await financialTemplate.arrayBuffer();
                    const wb = XLSX.read(buffer, { type: "array" });

                    for (const sheetName of wb.SheetNames) {
                        const metric = getMetricFromSheetName(sheetName);

                        const newWb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(newWb, wb.Sheets[sheetName], sheetName);
                        const sheetBlob = new Blob(
                            [XLSX.write(newWb, { bookType: "xlsx", type: "array" })],
                            { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                        );

                        const formData = new FormData();
                        formData.append("template", sheetBlob, `${sheetName}.xlsx`);
                        financialReportFiles.forEach((file) => formData.append("files", file, file.name));
                        formData.append("context", "None");

                        const uploadRes = await axios.post(
                            "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/financial_reporting",
                            formData
                        );

                        const base64Data = uploadRes.data?.file_base64;
                        if (base64Data) {
                            const binary = atob(base64Data.split(",")[1] || base64Data);
                            const byteArray = new Uint8Array(binary.length);
                            for (let i = 0; i < binary.length; i++) {
                                byteArray[i] = binary.charCodeAt(i);
                            }
                            const blob = new Blob([byteArray], {
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            });
                            const uploadedFile = new File([blob], `${sheetName}_Uploaded_Report.xlsx`, {
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            });
                            uploadedFiles.push(uploadedFile);
                            uploadedExcelFileTemp = uploadedFile;
                        }
                    }
                    setUploadedFinancialExcelFile(uploadedExcelFileTemp);
                }

                const mergedWorkbook = XLSX.utils.book_new();
                let sheetCounter = 1;
                const appendSheets = async (file, label) => {
                    const buffer = await file.arrayBuffer();
                    const wb = XLSX.read(buffer, { type: "array" });

                    const sanitize = (name) => name.replace(/[:\\/?*\[\]]/g, '');
                    const maxSheetNameLength = 31;

                    wb.SheetNames.forEach((sheet) => {
                        const baseName = sanitize(`${label}_${sheet}`);
                        const truncatedBaseName = baseName.substring(0, maxSheetNameLength - 5); // Reserve space for counter
                        const safeSheetName = `${truncatedBaseName}_${sheetCounter++}`;
                        XLSX.utils.book_append_sheet(mergedWorkbook, wb.Sheets[sheet], safeSheetName);
                    });
                };
                for (const stdFile of standardFiles) await appendSheets(stdFile, "Standard");
                for (const upFile of uploadedFiles) await appendSheets(upFile, "Uploaded");

                const mergedBlob = new Blob(
                    [XLSX.write(mergedWorkbook, { bookType: "xlsx", type: "array" })],
                    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                );
                const mergedFile = new File([mergedBlob], "merged_report.xlsx", {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                const summariseForm = new FormData();
                summariseForm.append("file", mergedFile);
                console.log('SuumariseFor', summariseForm);
                let standardSummariseEndpoint = '';
                if (props.selectedRole === "Financial Health") {
                    standardSummariseEndpoint = "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/header-modules/financial/report";
                }
                const summaryResponse = await axios.post(
                    standardSummariseEndpoint,
                    summariseForm
                );
                console.log('DeepakAnalyis', summaryResponse);
                setFinancialReport(summaryResponse.data?.analysis || "No summary available.");

                // Visualisation only for Financial Health
                const visualiseForm = new FormData();
                visualiseForm.append("file", mergedFile);
                const expectedMetrics = [
                    "Hours of Service Delivered",
                    "Wages Plotting",
                    "Income Plotting",
                    "Services Plotting"
                ];

                try {
                    let standardVisulaiseEndpoint = '';
                    if (props.selectedRole === "Financial Health") {
                        standardVisulaiseEndpoint = "https://curki-backend-api-container.yellowflower-c21bea82.australiaeast.azurecontainerapps.io/header-modules/financial/visualise";
                    }
                    const visualiseResponse = await axios.post(
                        standardVisulaiseEndpoint,
                        visualiseForm
                    );
                    console.log(visualiseResponse);
                    const attachments = visualiseResponse.data?.attachments || [];

                    if (attachments.length > 0) {
                        const uniqueAttachments = attachments.filter((att, index, self) =>
                            index === self.findIndex(a => a.file_base64 === att.file_base64)
                        );

                        const visuals = uniqueAttachments.map((att) => {
                            const base64 = att.file_base64.startsWith("data:")
                                ? att.file_base64
                                : `data:image/png;base64,${att.file_base64}`;
                            return { image: base64 };
                        });
                        setFinancialVisualizations(visuals);
                    } else {
                        setFinancialVisualizations(expectedMetrics.map(metric => ({ metricName: metric, image: "/GraphPlacholder.png" })));
                    }
                } catch (visualError) {
                    console.error("Visualisation Error:", visualError);
                    setFinancialVisualizations(expectedMetrics.map(metric => ({ metricName: metric, image: "/GraphPlacholder.png" })));
                }
                clearInterval(interval);
                setFinancialProgress(100);
                setTimeout(() => {
                    setFinancialShowReport(true);
                    setIsFinancialProcessing(false);
                }, 500);

            }
        } catch (error) {
            console.error("Error:", error);
            alert("AI Overloading or network issue.");
            clearInterval(interval);
            setFinancialProgress(0);
            setIsFinancialProcessing(false);
        }
    };

    const isButtonDisabled = !financialTemplate && financialReportFiles.length === 0;

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


    return (
        <>
            {(!financialshowReport) ? (
                <>
                    <div className="selectedModule">{props.selectedRole}</div>
                    <div className="selectedModuleDescription">Upload your data and<br></br>get instant insights into spending, funding, and what needs attention</div>
                    <div>
                        <div className="uploader-grid">
                            <UploaderCSVBox
                                file={financialTemplate}
                                setFile={setFinancialTemplate}
                                title="Upload Your Template To Be Filled"
                                subtitle=".XLSX or .CSV Format Only"
                                removeFile={() => setFinancialTemplate(null)}
                                disabled={true}
                            />
                            <div style={{ width: '100%' }}>
                                <UploadFiles
                                    files={financialReportFiles}
                                    setFiles={setFinancialReportFiles}
                                    title={props.selectedRole}
                                    subtitle='Upload multiple .xlsx, .csv or .xls files'
                                    fileformat=".xlsx, .csv, .xls"
                                    removeFile={(index) => {
                                        setFinancialReportFiles(prev => prev.filter((_, i) => i !== index));
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
                            backgroundColor: isButtonDisabled || isFinancialProcessing ? '#A1A1AA' : '#000',
                            cursor: isFinancialProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleAnalyse}
                    >
                        {isFinancialProcessing ? `${financialprogress}% Processing...` : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Analyse<img src={star} alt='img' style={{ width: '20px', height: '20px' }} /></div>}
                    </button>
                    <div style={{ fontSize: '12px', color: 'grey', fontFamily: 'Inter', fontWeight: '400', textAlign: 'center', marginTop: '12px' }}>**Estimated Time to Analyse 4 min**</div>

                </>
            ) : (
                <>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '24px',marginTop:'14px' }}>
                        <button className="new-report-btn" onClick={resetFinancialHealthState}>
                            <img src={NewReportIcon} alt='newReporticon' style={{ width: '24px' }} /><div>New Report</div>
                        </button>
                    </div>
                    <div className="card-grid">
                        {financialVisualizations.map((viz, index) => (
                            <div key={index} className="data-card">
                                <h4>{viz?.metricName}</h4>
                                <img src={viz.image} alt={viz.metricName} style={{ width: "100%" }} />
                            </div>
                        ))}
                    </div>

                    <div className="reports-box" style={{ height: 'auto', marginTop: '30px', padding: '10px' }}>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '10px 30px', borderRadius: '10px' }}>
                            <SummaryReport summaryText={financialReport} handleDownloadAnalyedReportUploadedCSV={handleDownloadUploadedExcel} handleDownloadAnalyedStandardReportCSV={handleDownloadStandardExcel} selectedRole={props.selectedRole} resetFinancialHealthState={resetFinancialHealthState} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', fontSize: '13px', color: 'grey' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                    <input type="checkbox" id="aiConsent" checked={isConsentChecked} readOnly style={{ width: '16px', height: '16px', marginRight: '8px', accentColor: 'green', cursor: 'pointer' }} />
                                    <label htmlFor="aiConsent" style={{ cursor: 'pointer' }}>
                                        AI-generated content. Only to be used as a guide. I agree to T&C on curki.ai website.
                                    </label>
                                </div>
                                <button onClick={handleButtonClick} style={{ background: 'linear-gradient(180deg, rgba(139, 117, 255, 0.9) 27.88%, #6D51FF 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
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