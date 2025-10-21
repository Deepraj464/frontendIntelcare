import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../Styles/TlcCustomReporting.css";
import TLCLogo from "../../../Images/TLCLogo.png";
import UploadTlcIcon from "../../../Images/UploadTlcIcon.png";
import { FiChevronDown } from "react-icons/fi";

export default function TlcCustomerReporting(props) {
  console.log("props", props)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [fileNames, setFileNames] = useState({
    payroll: [],
    people: [],
    employee: [],
  });


  const optionsState = [
    { label: "New South Wales", value: "New South Wales" },
    { label: "Queensland", value: "Queensland" },
    { label: "Victoria", value: "Victoria" },
  ];

  const optionsDepartment = [
    { label: "ACAC", value: "ACAC" },
    { label: "AUGU", value: "AUGU" },
    { label: "AUS Chief Executive Officer", value: "AUS Chief Executive Officer" },
    { label: "Accommodation", value: "Accommodation" },
    { label: "Allied Health", value: "Allied Health" },
    { label: "Behaviour", value: "Behaviour" },
    { label: "Customer Care", value: "Customer Care" },
    { label: "DS - WERR", value: "DS - WERR" },
    { label: "Day Program", value: "Day Program" },
    { label: "Finance", value: "Finance" },
    { label: "Global Chief Executive Officer", value: "Global Chief Executive Officer" },
    { label: "Growth and Marketing", value: "Growth and Marketing" },
    { label: "HUB - Central Coast", value: "HUB - Central Coast" },
    { label: "Hub - Bankstown", value: "Hub - Bankstown" },
    { label: "Inactive", value: "Inactive" },
    { label: "Information Communications and Technology", value: "Information Communications and Technology" },
    { label: "MAC", value: "MAC" },
    { label: "MayeFoodz", value: "MayeFoodz" },
    { label: "NDIS", value: "NDIS" },
    { label: "OT", value: "OT" },
    { label: "Operations", value: "Operations" },
    { label: "PHYSIO", value: "PHYSIO" },
    { label: "PSYCH", value: "PSYCH" },
    { label: "People and Culture", value: "People and Culture" },
    { label: "Quality and Safeguards", value: "Quality and Safeguards" },
    { label: "Scheduling", value: "Scheduling" },
    { label: "Speech", value: "Speech" },
    { label: "Support Coordination", value: "Support Coordination" },
    { label: "Travel", value: "Travel" },
  ];

  const optionsRole = [
    { label: "Admin Assistant", value: "Admin Assistant" },
    { label: "Area Manager", value: "Area Manager" },
    { label: "Behaviour Support Practitioner", value: "Behaviour Support Practitioner" },
    { label: "Business Development Manager", value: "Business Development Manager" },
    { label: "CEO - Australian Operations", value: "CEO - Australian Operations" },
    { label: "Customer Care Coordinator", value: "Customer Care Coordinator" },
    { label: "Customer Care Manager", value: "Customer Care Manager" },
    { label: "Customer Care Specialist", value: "Customer Care Specialist" },
    { label: "Day Program Coordinator", value: "Day Program Coordinator" },
    { label: "Direct Service Coordinator", value: "Direct Service Coordinator" },
    { label: "Direct Services Manager", value: "Direct Services Manager" },
    { label: "Domestic Assistant", value: "Domestic Assistant" },
    { label: "Group Chief Executive Officer", value: "Group Chief Executive Officer" },
    { label: "House Lead", value: "House Lead" },
    { label: "National Business Development Manager", value: "National Business Development Manager" },
    { label: "Physiotherapist", value: "Physiotherapist" },
    { label: "Program Manager", value: "Program Manager" },
    { label: "Quality & Safeguarding Officer", value: "Quality & Safeguarding Officer" },
    { label: "Quality Coordinator", value: "Quality Coordinator" },
    { label: "SIL Intake Coordinator", value: "SIL Intake Coordinator" },
    { label: "Senior Support Coordinator", value: "Senior Support Coordinator" },
    { label: "State Manager", value: "State Manager" },
    { label: "Support Coordinator", value: "Support Coordinator" },
    { label: "Support Coordinator Team Leader", value: "Support Coordinator Team Leader" },
    { label: "Support Worker", value: "Support Worker" },
    { label: "Team Leader", value: "Team Leader" },
  ];

  const optionsType = [
    { label: "Casual", value: "Casual" },
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
  ];
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("filters"); // filters | loading | overview | breakdown

  // API response data
  const [analysisData, setAnalysisData] = useState(null);

  // track if there’s an error
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files); // 👈 convert FileList to Array
    if (files.length > 0) {
      setFileNames((prev) => ({
        ...prev,
        [type]: files.map((f) => f.name),
      }));
    }
  };


  // const handleAnalyse = () => {
  //   alert("Analysing with applied filters...");
  // };

  const handleAnalyse = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range first!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStage("loading");
      console.log("🚀 Starting analysis process...");

      // Step 1: Prepare FormData for all selected files
      const formData = new FormData();
      Object.keys(fileNames).forEach((key) => {
        const input = document.querySelector(`input[data-type="${key}"]`);
        if (input && input.files.length > 0) {
          Array.from(input.files).forEach((file) => {
            formData.append("files", file);
          });
          console.log(`📦 Added ${input.files.length} ${key} file(s) to FormData`);
        } else {
          console.warn(`⚠️ No files found for ${key}`);
        }
      });

      if (![...formData.keys()].length) {
        alert("Please upload at least one file before analyzing!");
        setLoading(false);
        setStage("filters");
        return;
      }

      // Step 2: Upload files
      console.log("📤 Uploading files...");
      const uploadRes = await fetch("https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/upload-latest", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      console.log("uploaded data", uploadData)
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "File upload failed.");
      }
      console.log("✅ Files uploaded successfully.");

      // Step 3: Build filter query params
      const query = new URLSearchParams({
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      });

      if (selectedState.length)
        query.append("state", selectedState.map((s) => s.value).join(","));
      if (selectedDepartment.length)
        query.append("department", selectedDepartment.map((d) => d.value).join(","));
      if (selectedEmploymentType.length)
        query.append("employmentType", selectedEmploymentType.map((e) => e.value).join(","));
      if (selectedRole.length)
        query.append("role", selectedRole.map((r) => r.value).join(","));

      const url = `https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/filter?${query.toString()}`;
      console.log("🌐 Calling analyze API:", url);

      // Step 4: Fetch analyze data
      const analyzeRes = await fetch(url);
      const analyzeData = await analyzeRes.json();
      console.log("analyze data", analyzeData)
      if (!analyzeRes.ok || !analyzeData.analysisResult) {
        throw new Error("Analysis failed. No valid response received.");
      }

      console.log("✅ Analysis data received successfully.");
      setAnalysisData(analyzeData.analysisResult);
      setStage("overview");
    } catch (err) {
      console.error("❌ Error in handleAnalyse:", err);
      setError(err.message);
      setStage("filters");
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // ✅ Fetch user history when component loads
  useEffect(() => {
    const fetchHistory = async () => {
      const email = props.user?.email?.trim().toLowerCase();
      if (!email) return;
      try {
        setLoadingHistory(true);
        const res = await fetch(`https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/history?email=${email}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch history");
        setHistoryList(data.data);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };


    fetchHistory();
  }, [props.user]);
  const handleHistoryClick = async (item) => {
    try {
      console.log("📥 Fetching full analysis for:", item.id);

      const res = await fetch(
        `https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/getById/${item.id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch analysis");

      console.log("✅ Loaded analysis data:", data.data);
      setAnalysisData(data.data.analysisResult);
      setStage("overview");
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Error loading analysis:", err);
      alert("Failed to load analysis: " + err.message);
    }
  };


  const handleSaveToDatabase = async () => {
    if (!analysisData) {
      alert("No analysis data found. Please run an analysis first.");
      return;
    }

    const email = props.user.email.trim().toLowerCase();
    if (!email) {
      alert("Email is missing — cannot save data.");
      return;
    }

    setSaving(true);
    try {
      console.log("📤 Saving analysis data to database...");

      // 🟢 Attach filters inside analysisData itself
      const enrichedAnalysis = {
        ...analysisData,
        filters: {
          start: startDate ? startDate.toISOString().split("T")[0] : null,
          end: endDate ? endDate.toISOString().split("T")[0] : null,
          state: selectedState.map((s) => s.value).join(", "),
          department: selectedDepartment.map((d) => d.value).join(", "),
          role: selectedRole.map((r) => r.value).join(", "),
          employmentType: selectedEmploymentType.map((e) => e.value).join(", "),
        },
      };

      const response = await fetch(
        "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisData: enrichedAnalysis, // ✅ merged version
            email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Failed to save:", result.error);
        alert(`Error: ${result.error || "Failed to save data."}`);
        return;
      }

      console.log("✅ Save response:", result);
      alert("✅ Analysis data saved successfully!");
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("Something went wrong while saving data.");
    } finally {
      setSaving(false);
    }
  };





  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select Date Range";
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  // ------------------- CUSTOM MULTISELECT -------------------
  const MultiSelectCustom = ({ options, selected, setSelected, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const toggleOption = (option) => {
      if (selected.some((o) => o.value === option.value)) {
        setSelected(selected.filter((o) => o.value !== option.value));
      } else {
        setSelected([...selected, option]);
      }
    };

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="custom-multiselect" ref={ref}>
        {/* Input Box */}
        <div
          className="custom-input"
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              color: selected.length === 0 ? "#999" : "#000", // Placeholder gray, selected black
            }}
          >
            {selected.length === 0
              ? placeholder
              : selected.length === 1
                ? selected[0].label
                : `${selected[0].label} +${selected.length - 1}`}
          </span>
          <FiChevronDown
            style={{
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>

        {/* Dropdown Options */}
        {open && (
          <div className="options-dropdown">
            {options.map((option) => {
              const isSelected = selected.some((o) => o.value === option.value);
              return (
                <div
                  key={option.value}
                  className={`option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleOption(option)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    style={{ marginRight: "8px" }}
                  />
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };



  const PlotlyChart = React.memo(({ chartHTML, id }) => {
    const containerRef = useRef(null);
    const renderedRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !chartHTML || renderedRef.current) return;

      // Create a safe inner wrapper
      const innerWrapper = document.createElement("div");
      innerWrapper.className = "chart-inner";
      container.replaceChildren(innerWrapper); // safe reset

      const renderChart = async () => {
        const virtualDOM = document.createElement("div");
        virtualDOM.innerHTML = chartHTML.trim();

        const scripts = Array.from(virtualDOM.querySelectorAll("script"));
        scripts.forEach((s) => s.remove());

        // Inject static content inside the inner wrapper only
        innerWrapper.innerHTML = virtualDOM.innerHTML;

        // Execute inline & external scripts safely
        for (const script of scripts) {
          await new Promise((resolve) => {
            const newScript = document.createElement("script");
            newScript.async = true;

            if (script.src) {
              newScript.src = script.src;
              newScript.onload = resolve;
              newScript.onerror = resolve;
              document.body.appendChild(newScript);
            } else {
              setTimeout(() => {
                try {
                  new Function(script.textContent || "")();
                } catch (e) {
                  console.warn("⚠️ Inline Plotly script error:", e);
                }
                resolve();
              }, 0);
            }
          });
        }

        requestAnimationFrame(() => {
          const plots = innerWrapper.querySelectorAll(".plotly-graph-div");
          plots.forEach((div) => {
            const isTable = div.classList.contains("plotly-table");

            // ✅ Differentiate charts vs tables
            div.style.scale = isTable ? "1" : "0.55";
            div.style.transformOrigin = "top center";
            div.style.transition = "scale 0.4s ease, opacity 0.6s ease";
            div.style.opacity = "1";
            div.style.width = "100%";
            div.style.height = isTable ? "480px" : "260px"; // 🟢 tables taller
            div.style.marginTop = isTable ? "40px" : "0"; // 🟢 spacing above tables

            // ✅ Add top margin *inside* actual chart (not the box)
            if (!isTable) {
              div.querySelectorAll("svg, canvas").forEach((el) => {
                el.style.marginTop = "250px"; // 🟢 add space inside actual chart area
              });
            }

            div.parentElement.style.overflow = "hidden";
          });
        });



        renderedRef.current = true;
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !renderedRef.current) {
            setIsVisible(true);
            observer.disconnect();
            renderChart();
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
        // ✅ Clear only inner wrapper safely (no removeChild conflicts)
        if (container.contains(innerWrapper)) {
          container.replaceChildren();
        }
        renderedRef.current = false;
      };
    }, [chartHTML]);

    return (
      <div
        ref={containerRef}
        id={id}
        className="chart-box fade-in"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: "280px",
          width: "100%",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          position: "relative",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0px)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {!renderedRef.current && (
          <div
            style={{
              fontSize: "14px",
              color: "#999",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Rendering chart...
          </div>
        )}
      </div>
    );
  });



  // ------------------- END CUSTOM MULTISELECT -------------------

  return (
    <div className="page-containersss">

      {/* Header */}
      <header className="header">


        <div className="left-headerss">
          <img src={TLCLogo} alt="Logo" className="tlclogo" />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="date-text">{formatDateRange()}</div>
            <button className="new-tab-btn">New Tab +</button>
          </div>
        </div>
        <button
          className="save-btn"
          onClick={handleSaveToDatabase}
          disabled={saving}
        >
          {saving ? "Processing..." : "Save to Database"}
        </button>

      </header>

      {/* Filters */}
      <section className="filters-card">
        <div className="filters-header">Filters</div>
        <div className="filters-grid">
          {/* Date Range Picker */}
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            placeholderText="Select Date Range"
            className="filter-input"
          />

          {/* Custom Multi-select dropdowns */}
          <MultiSelectCustom
            options={optionsState}
            selected={selectedState}
            setSelected={setSelectedState}
            placeholder="Select State"
          />
          <MultiSelectCustom
            options={optionsDepartment}
            selected={selectedDepartment}
            setSelected={setSelectedDepartment}
            placeholder="Select Department"
          />
          <MultiSelectCustom
            options={optionsRole}
            selected={selectedRole}
            setSelected={setSelectedRole}
            placeholder="Select Role"
          />
          <MultiSelectCustom
            options={optionsType}
            selected={selectedEmploymentType}
            setSelected={setSelectedEmploymentType}
            placeholder="Employment Type"
          />
        </div>
      </section>

      {/* Upload Sections */}
      <section className="uploads-containers">
        {[
          { key: "payroll", label: "Payroll Data" },
          { key: "people", label: "People and Teams Data" },
          { key: "employee", label: "Employee Update Data" },
        ].map((item) => (
          <div key={item.key}>
            <div style={{ textAlign: "left", fontSize: "12px", fontFamily: "Inter" }}>
              Upload {item.label}
            </div>
            <div className="upload-boxes">
              <label>
                <input
                  type="file"
                  multiple  // 👈 allows multiple file selection
                  accept=".xlsx, .xls"
                  data-type={item.key} // 👈 useful for upload identification
                  onChange={(e) => handleFileChange(e, item.key)}
                />

                <div className="upload-content">
                  <div className="uploadss-iconss">
                    <img
                      src={UploadTlcIcon}
                      alt="uploadtlcIcon"
                      style={{ height: "48px", width: "48px" }}
                    />
                  </div>
                  <p>
                    {fileNames[item.key].length > 0 ? (
                      <strong>
                        {fileNames[item.key].length === 1
                          ? fileNames[item.key][0] // show full name if only one
                          : `${fileNames[item.key][0]}, ...`} {/* show first + ... */}
                      </strong>
                    ) : (
                      <>
                        Click to upload <span>{item.label}</span>
                      </>
                    )}
                  </p>


                  <small>.XLSX, .XLS</small>
                </div>
              </label>
            </div>
          </div>
        ))}
      </section>
      {stage === "loading" && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Processing your data, please wait...</p>
        </div>
      )}
      {/* Analyse Button */}
      <div className="search-section">
        {/* Payroll Overview Dashboard */}
        {stage === "overview" && analysisData && (
          <section className="dashboard">
            <h2 className="section-title">
              {(() => {
                const titles = {
                  1: "Payroll Overview",
                  2: "Detailed Breakdown",
                  3: "Leave & Absences",
                };
                return titles[currentPage] || `Page ${currentPage}`;
              })()}
            </h2>


            {analysisData && (
              <div className="summary-cards">
                {(() => {
                  const pageKey = `page ${currentPage}`;
                  const pageScorecard = analysisData.pages?.[pageKey]?.scorecard || {};

                  // ✅ Allowed keys differ slightly per page (optional)
                  const allowedKeysByPage = {
                    1: [
                      "Average Cost per Hour ($/hr)",
                      "Overtime Hours ($)",
                      "Total Paid Hours ($)",
                      "Total Payroll Cost ($) Gross",
                      "Weekend & Public Holiday Cost ($)",
                      "Working Employees",
                    ],
                    2: [
                      "Average Cost per Hour ($/hr)",
                      "Working Employees",
                      "Overtime Hours ($)",
                      "Weekend & Public Holiday Cost ($)",
                    ],
                    3: [
                      "% Employees on Leave",
                      "Total Leave Hours",
                    ],
                  };

                  const allowedKeys = allowedKeysByPage[currentPage] || [];

                  // ✅ Render only values that exist in that page’s scorecard
                  return Object.entries(pageScorecard)
                    .filter(([label]) => allowedKeys.length === 0 || allowedKeys.includes(label))
                    .map(([label, value], index) => (
                      <div key={index} className="summary-card">
                        <p>{label}</p>
                        <h3>
                          {typeof value === "number"
                            ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                            : value}
                        </h3>
                      </div>
                    ));
                })()}
              </div>
            )}






            {/* === CHARTS === */}
            <div className="charts-grid">
              {(analysisData.pages?.[`page ${currentPage}`]?.figures || []).map(
                (chartHTML, index) => (
                  <PlotlyChart
                    key={`${currentPage}-${index}`}
                    id={`chart-${currentPage}-${index}`}
                    chartHTML={chartHTML}
                  />
                )
              )}
            </div>

            {currentPage === 1 && (
              (() => {
                const tableHTML =
                  analysisData.table ||
                  analysisData.pages?.["page 1"]?.table ||
                  "";

                if (!tableHTML) return null;

                return (
                  <div className="table-box">
                    <PlotlyChart
                      id={`table-${currentPage}`}
                      chartHTML={tableHTML}
                    />
                  </div>
                );
              })()
            )}



            {/* === PAGINATION === */}
            {/* === PAGINATION (Hide buttons when not needed) === */}
            <div className="nav-buttons">
              {currentPage > 1 && (
                <button
                  className="back-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ← Previous
                </button>
              )}

              {analysisData.pages?.[`page ${currentPage + 1}`] && (
                <button
                  className="next-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              )}
            </div>

          </section>
        )}


        {stage === "breakdown" && analysisData && (
          <section className="dashboard">
            <h2 className="section-title">Detailed Breakdown</h2>

            <div className="charts-grid">
              {(analysisData.pages?.[`page ${currentPage}`]?.figures || []).map(
                (chartHTML, index) => (
                  <PlotlyChart
                    key={`${currentPage}-${index}`}
                    id={`chart-${currentPage}-${index}`}
                    chartHTML={chartHTML}
                  />
                )
              )}
            </div>



            <div className="nav-buttons">
              <button className="back-btn" onClick={() => setStage("overview")}>
                ← Back to Payroll Overview
              </button>
              <button className="next-btn" onClick={() => setStage("filters")}>
                Back to Filters →
              </button>
            </div>
          </section>
        )}


        {stage === "filters" && !analysisData && (
          <button className="search-btn" onClick={handleAnalyse} disabled={loading}>
            {loading ? "Processing..." : "Analyse"}
          </button>
        )}
      </div>

      {stage !== "loading" && (
        <section className="history-container">
          <div className="history-title">History</div>

          {loadingHistory ? (
            <p style={{ textAlign: "center", color: "#555" }}>Loading history...</p>
          ) : historyList.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>No saved history found.</p>
          ) : (
            historyList.map((item, index) => {
              const createdAt = new Date(item.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              });

              const filters = item.analysisResult?.filters || item?.filters || {};
              const { state, department, role, employmentType, start, end } = filters;

              return (
                <div
                  key={item.id || index}
                  className="history-card-modern"
                  onClick={() => handleHistoryClick(item)}
                >
                  {/* Header Row */}
                  <div className="history-top">
                    <div className="history-date-range">
                      <strong className="label">Date Range:</strong>{" "}
                      <span className="value">
                        {start
                          ? `${new Date(start).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })}`
                          : "N/A"}{" "}
                        –{" "}
                        {end
                          ? `${new Date(end).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })}`
                          : "N/A"}
                      </span>
                    </div>

                    <div className="history-open-icon">↗</div>
                  </div>

                  {/* Saved On */}
                  <div className="saved-on">
                    <span className="saved-label">Saved On:</span>{" "}
                    <span className="saved-value">{createdAt}</span>
                  </div>

                  {/* Filters Row */}
                  <div className="history-filters">
                    {state && (
                      <span className="filter-item">
                        <strong>State:</strong> {state}
                      </span>
                    )}
                    {department && (
                      <span className="filter-item">
                        <strong>Department:</strong> {department}
                      </span>
                    )}
                    {role && (
                      <span className="filter-item">
                        <strong>Role:</strong> {role}
                      </span>
                    )}
                    {employmentType && (
                      <span className="filter-item">
                        <strong>Employment Type:</strong> {employmentType}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}



    </div>
  );

}
