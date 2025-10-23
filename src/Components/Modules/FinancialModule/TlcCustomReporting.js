import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../Styles/TlcCustomReporting.css";
import TLCLogo from "../../../Images/TLCLogo.png";
import UploadTlcIcon from "../../../Images/UploadTlcIcon.png";
import { FiChevronDown } from "react-icons/fi";
import parse, { domToReact } from "html-react-parser";



export default function TlcCustomerReporting(props) {
  console.log("props", props);
  const [uploading, setUploading] = useState(false);

  // -------------------- MULTI TAB SUPPORT --------------------
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "Tab 1",
      startDate: null,
      endDate: null,
      selectedState: [],
      selectedDepartment: [],
      selectedRole: [],
      selectedEmploymentType: [],
      fileNames: { payroll: [], people: [], employee: [] },
      stage: "filters",
      analysisData: null,
      error: null,
      currentPage: 1,
    },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const activeTabData = tabs.find((t) => t.id === activeTab);

  const updateTab = (updates) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, ...updates } : t))
    );
  };

  const handleNewTab = () => {
    const newId = tabs.length ? Math.max(...tabs.map((t) => t.id)) + 1 : 1;
    const newTab = {
      id: newId,
      name: `Tab ${newId}`,
      startDate: null,
      endDate: null,
      selectedState: [],
      selectedDepartment: [],
      selectedRole: [],
      selectedEmploymentType: [],
      fileNames: { payroll: [], people: [], employee: [] },
      stage: "filters",
      analysisData: null,
      error: null,
      currentPage: 1,
    };
    console.log("Creating new tab:", newTab);
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newId);
  };

  const handleCloseTab = (id) => {
    console.log("Closing tab:", id);
    const remainingTabs = tabs.filter((t) => t.id !== id);
    setTabs(remainingTabs);
    if (id === activeTab && remainingTabs.length > 0) {
      setActiveTab(remainingTabs[0].id);
    }
  };
  // ------------------------------------------------------------

  // -------------------- BASE STATES --------------------
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isAllowed, setIsAllowed] = useState(null);
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

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // ✅ Basic validation — allow .csv, .xls, .xlsx
    const validFiles = files.filter((file) => {
      const name = file.name.toLowerCase();
      if (type === "payroll" && name.includes("pay journal")) return true;
      if (type === "people" && name.includes("people - team members")) return true;
      if (type === "employee" && name.includes("employeeupdate")) return true;
      return false;
    });

    if (validFiles.length === 0) {
      alert(`⚠️ Invalid file uploaded in ${type.toUpperCase()} section. Please check the file.`);
      e.target.value = "";
      return;
    }

    // ✅ Update this tab’s file list
    updateTab({
      fileNames: {
        ...activeTabData.fileNames,
        [type]: validFiles.map((f) => f.name),
      },
    });

    console.log(`✅ Selected ${type} files:`, validFiles.map((f) => f.name));
  };




  const handleAnalyse = async () => {
    if (!activeTabData) return;

    const {
      startDate,
      endDate,
      selectedState,
      selectedDepartment,
      selectedRole,
      selectedEmploymentType,
      fileNames,
    } = activeTabData;

    // ✅ Basic check for date range
    if (!startDate || !endDate) {
      alert("Please select a date range first!");
      return;
    }

    try {
      setLoading(true);
      updateTab({ stage: "loading", error: null });
      console.log("🚀 Starting analysis process for tab:", activeTab);

      // -------------------------------
      // STEP 1️⃣: VALIDATE FILE UPLOADS
      // -------------------------------
      const inputs = ["payroll", "people", "employee"].map((type) =>
        document.querySelector(`input[data-type="${type}"][data-tab="${activeTab}"]`)
      );

      const hasAnyFile = inputs.some(
        (input) => input && input.files && input.files.length > 0
      );

      if (hasAnyFile) {
        lastManualWithFilesRef.current = true;
        console.log("🧾 Upload path selected — validating uploaded files...");

        const invalidUploads = [];

        // ✅ Validate each file section
        for (const input of inputs) {
          if (!input) continue;
          const type = input.getAttribute("data-type");
          const files = Array.from(input.files);

          if (files.length === 0) {
            invalidUploads.push(`❌ Missing file(s) for ${type.toUpperCase()}`);
            continue;
          }

          const invalidFiles = files.filter((file) => {
            const name = file.name.toLowerCase();
            if (type === "payroll" && !name.includes("pay journal")) return true;
            if (type === "people" && !name.includes("people - team members")) return true;
            if (type === "employee" && !name.includes("employeeupdate")) return true;
            return false;
          });

          if (invalidFiles.length > 0) {
            invalidUploads.push(
              `⚠️ Incorrect file(s) in ${type.toUpperCase()} section: ${invalidFiles
                .map((f) => f.name)
                .join(", ")}`
            );
          }
        }

        // ✅ Check if all 3 sections have files
        const allTypesUploaded = inputs.every(
          (input) => input && input.files && input.files.length > 0
        );

        if (invalidUploads.length > 0 || !allTypesUploaded) {
          setLoading(false);
          updateTab({ stage: "filters" });

          let message = "⚠️ Please correct the following before analysing:\n\n";
          if (!allTypesUploaded)
            message += "- You must upload all three file types (Payroll, People, Employee)\n";
          if (invalidUploads.length > 0)
            message += "\n" + invalidUploads.join("\n");

          alert(message);
          return;
        }

        // ✅ If everything is valid, upload first
        console.log("✅ All uploaded files are valid. Uploading before analysis...");
        try {
          setUploading(true);
          const formData = new FormData();
          inputs.forEach((input) => {
            Array.from(input.files).forEach((file) => formData.append("files", file));
          });

          const uploadRes = await fetch(
            "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/payroll/upload-latest",
            { method: "POST", body: formData }
          );

          const uploadData = await uploadRes.json();
          console.log("📤 Upload API response:", uploadData);

          if (!uploadRes.ok) {
            throw new Error(uploadData.error || "File upload failed.");
          }

          console.log("✅ Files uploaded successfully before analysis.");
        } catch (uploadErr) {
          console.error("❌ Upload failed:", uploadErr);
          alert("Some files failed to upload. Continuing with existing data...");
        } finally {
          setUploading(false);
        }
      } else {
        lastManualWithFilesRef.current = false;
        console.log("📂 No files selected. Proceeding with existing database data...");
      }

      // -------------------------------
      // STEP 2️⃣: RUN ANALYSIS API
      // -------------------------------
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

      const analyzeRes = await fetch(url);
      const analyzeData = await analyzeRes.json();
      console.log("📊 Analyze API response:", analyzeData);

      if (!analyzeRes.ok || !analyzeData.analysisResult) {
        throw new Error(analyzeData.error || "Analysis failed. No valid response received.");
      }

      console.log("✅ Analysis data received successfully.");
      justRanManualAnalysisRef.current = true;
      updateTab({ analysisData: analyzeData.analysisResult, stage: "overview" });
      lastManualWithFilesRef.current = false;
    } catch (err) {
      console.error("❌ Error in handleAnalyse:", err);
      updateTab({ error: err.message, stage: "filters" });
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // 🧠 Auto-run analysis logic (final stable version)
  const lastAnalysisKeyRef = useRef("");
  const lastManualWithFilesRef = useRef(false);
  const justRanManualAnalysisRef = useRef(false);
  useEffect(() => {
    if (!activeTabData) return;
    if (justRanManualAnalysisRef.current) {
      console.log("⏸ Skipping auto-analyze (manual analyse just completed)");
      justRanManualAnalysisRef.current = false; // reset for next time
      return;
    }
    const {
      startDate,
      endDate,
      selectedState,
      selectedDepartment,
      selectedRole,
      selectedEmploymentType,
      fileNames,
      analysisData,
    } = activeTabData;

    const hasDateRange = startDate && endDate;

    const noFilesUploaded =
      !fileNames.payroll.length &&
      !fileNames.people.length &&
      !fileNames.employee.length;

    // ✅ Determine if auto-analysis should trigger
    const shouldAutoAnalyse =
      hasDateRange &&
      !uploading &&
      !loading &&
      (noFilesUploaded || analysisData) &&
      !lastManualWithFilesRef.current; // no upload or already analysed

    if (!shouldAutoAnalyse) return;

    // 🧩 Create a key to detect if filters changed since last analysis
    const currentKey = JSON.stringify({
      startDate,
      endDate,
      state: selectedState.map((s) => s.value).join(","),
      department: selectedDepartment.map((d) => d.value).join(","),
      role: selectedRole.map((r) => r.value).join(","),
      empType: selectedEmploymentType.map((e) => e.value).join(","),
    });

    // ⚠️ If nothing changed, don't reanalyse
    if (lastAnalysisKeyRef.current === currentKey) return;

    lastAnalysisKeyRef.current = currentKey;

    const timer = setTimeout(() => {
      console.log("⚙️ Auto-analyzing triggered (date/filter change, safe)...");
      handleAnalyse();
    }, 1000); // debounce
    if (noFilesUploaded) {
      lastManualWithFilesRef.current = false;
    }
    return () => clearTimeout(timer);
  }, [
    activeTabData,
    uploading,
    loading,
    activeTabData?.startDate,
    activeTabData?.endDate,
    activeTabData?.selectedState,
    activeTabData?.selectedDepartment,
    activeTabData?.selectedRole,
    activeTabData?.selectedEmploymentType,
    activeTabData?.analysisData,
  ]);
  // 🧩 Reset "isFromHistory" when user edits any filters or date
  useEffect(() => {
    if (!activeTabData) return;

    const { isFromHistory, analysisData, startDate, endDate, selectedState, selectedDepartment, selectedRole, selectedEmploymentType } = activeTabData;

    // Run only if it's a history-loaded record AND analysis exists
    if (!isFromHistory || !analysisData) return;

    const hasFiltersChanged = [
      startDate,
      endDate,
      selectedState?.length,
      selectedDepartment?.length,
      selectedRole?.length,
      selectedEmploymentType?.length,
    ].some(Boolean);

    // If user modifies any filter/date, allow saving again
    if (hasFiltersChanged) {
      updateTab({ isFromHistory: false });
    }
  }, [
    activeTabData?.startDate,
    activeTabData?.endDate,
    activeTabData?.selectedState,
    activeTabData?.selectedDepartment,
    activeTabData?.selectedRole,
    activeTabData?.selectedEmploymentType,
  ]);
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userEmail = props?.user?.email?.trim().toLowerCase();
        if (!userEmail) {
          setIsAllowed(false);
          return;
        }

        const res = await fetch(
          "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/getAllTlcEmails"
        );

        const data = await res.json();
        console.log("📥 Admin email list:", data);

        if (!res.ok || !data.emails) {
          console.warn("⚠️ Invalid response from getAllTlcEmails API");
          setIsAllowed(false);
          return;
        }

        const normalizedEmails = data.emails.map((e) => e.trim().toLowerCase());
        console.log("normalizedEmails", normalizedEmails)
        const hasAccess = normalizedEmails.includes(userEmail);

        setIsAllowed(hasAccess);
        console.log(`🔐 Access check for ${userEmail}:`, hasAccess);
      } catch (err) {
        console.error("❌ Error verifying access:", err);
        setIsAllowed(false);
      }
    };

    checkAccess();
  }, [props.user]);
  // -------------------- SAVE HANDLER --------------------
  const handleSaveToDatabase = async () => {
    if (!activeTabData) return;

    // ✅ If loaded from history, block saving again
    if (activeTabData.isFromHistory) {
      alert("⚠️ This analysis is already saved in the history list.");
      return;
    }

    const { analysisData, startDate, endDate, selectedState, selectedDepartment, selectedRole, selectedEmploymentType } = activeTabData;

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
      console.log("📤 Saving analysis data to database for tab:", activeTab);

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
            analysisData: enrichedAnalysis,
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
      // ✅ Optional: Mark as saved to prevent double-save
      updateTab({ isFromHistory: true });
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("Something went wrong while saving data.");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteHistory = async () => {
    if (!selectedHistoryId) return;

    try {
      setDeleting(true);
      const res = await fetch(
        "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/deleteById",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedHistoryId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete history.");

      console.log("✅ Deleted successfully:", data);
      setHistoryList((prev) => prev.filter((item) => item.id !== selectedHistoryId));
      setShowDeleteModal(false);
      alert("✅ Deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting:", err);
      alert("Failed to delete history: " + err.message);
    } finally {
      setDeleting(false);
    }
  };


  // -------------------- HISTORY FETCH --------------------
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

  // -------------------- HISTORY CLICK --------------------
  const handleHistoryClick = async (item) => {
    try {
      console.log("📥 Fetching full analysis for:", item.id);

      const res = await fetch(
        `https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/getById/${item.id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch analysis");

      console.log("✅ Loaded analysis data:", data.data);
      updateTab({
        analysisData: data.data.analysisResult,
        stage: "overview",
        currentPage: 1,
        isFromHistory: true, // ✅ mark as loaded from history
      });

    } catch (err) {
      console.error("❌ Error loading analysis:", err);
      alert("Failed to load analysis: " + err.message);
    }
  };

  const formatDateRange = () => {
    if (!activeTabData || !activeTabData.startDate || !activeTabData.endDate) return "Selected Date Range";
    return `${activeTabData.startDate.toLocaleDateString()} - ${activeTabData.endDate.toLocaleDateString()}`;
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
          <span style={{ color: selected.length === 0 ? "#ccc" : "#000", fontFamily: 'Inter' }}>
            {selected.length === 0
              ? placeholder
              : selected.length === 1
                ? selected[0].label
                : (
                  <>
                    {selected[0].label}{" "}
                    <span style={{ color: "#EA7323", fontSize: "12px", fontFamily: 'Inter' }}>
                      +{selected.length - 1}
                    </span>
                  </>
                )
            }
          </span>
          <FiChevronDown
            style={{
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>

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


  // const renderHtmlFigure = (htmlString) => {
  //   return parse(htmlString, {
  //     replace: (domNode) => {
  //       // Safely execute <script> tags
  //       if (domNode.name === "script") {
  //         if (domNode.children && domNode.children.length > 0) {
  //           try {
  //             new Function(domNode.children[0].data)();
  //           } catch (e) {
  //             console.warn("Script execution error", e);
  //           }
  //         }
  //         return null; // Don't render the <script> tag itself
  //       }
  //     },
  //   });
  // }

  const renderHtmlFigure = (htmlString) => {
    const parsed = parse(htmlString, {
      replace: (domNode) => (domNode.name === "script" ? null : undefined),
    });

    setTimeout(() => {
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;

        const scripts = tempDiv.getElementsByTagName("script");
        for (let script of scripts) {
          const newScript = document.createElement("script");
          if (script.src) newScript.src = script.src;
          else if (script.textContent) newScript.text = script.textContent;
          document.body.appendChild(newScript);
          document.body.removeChild(newScript);
        }
      } catch (e) {
        console.warn("Script execution error:", e);
      }
    }, 0);

    return parsed;
  };



  // -------------------- TAB BAR --------------------
  const renderTabBar = () => (
    <div className="tab-bar" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", paddingTop: "16px" }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: tab.id === activeTab ? "#1f2d3d" : "#f3f4f6",
            color: tab.id === activeTab ? "#fff" : "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: tab.id === activeTab ? 600 : 400,
            transition: "all 0.2s ease",
          }}
        >
          {tab.name}
          {tabs.length > 1 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(tab.id);
              }}
              style={{
                marginLeft: "4px",
                color: tab.id === activeTab ? "#ccc" : "#999",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
      <button
        onClick={handleNewTab}
        style={{
          background: "#e5e7eb",
          borderRadius: "8px",
          padding: "8px 14px",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "14px",
          transition: "all 0.2s ease",
        }}
      >
        + New Tab
      </button>
    </div>
  );

  if (!activeTabData) return null;

  if (!isAllowed) {
    return (
      <div style={{
        textAlign: "center",
        padding: "120px 20px",
        fontFamily: "Inter, sans-serif",
        color: "#1f2937"
      }}>
        <img
          src={TLCLogo}
          alt="Access Denied"
          style={{ width: "80px", opacity: 0.8, marginBottom: "20px" }}
        />
        <h2 style={{ fontSize: "24px", marginBottom: "12px", color: "#EA7323" }}>
          Access Restricted 🚫
        </h2>
        <p style={{ fontSize: "16px", color: "#555" }}>
          Sorry, your account (<strong>{props?.user?.email}</strong>) is not authorized to view this page.
        </p>
      </div>
    );
  }
  return (
    <div className="page-containersss">
      <div className="headerss">
        <div className="left-headerss">
          <img src={TLCLogo} alt="Logo" className="tlclogo" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="date-text">{formatDateRange()}</div>
              {renderTabBar()}
            </div>
            <button
              className="save-btnss"
              onClick={handleSaveToDatabase}
              disabled={saving}
            >
              {saving ? "Processing..." : "Save to Database"}
            </button>
          </div>
        </div>

      </div>

      <section className="filters-card">
        <div className="filters-header">Filters</div>
        <div className="filters-grid">
          <div>
            <DatePicker
              selectsRange
              startDate={activeTabData.startDate}
              endDate={activeTabData.endDate}
              onChange={(dates) => {
                const [start, end] = dates;
                updateTab({ startDate: start, endDate: end });
              }}
              placeholderText="Select Date Range"
              className="filter-input"
              dateFormat="dd/MM/yy"
            />
          </div>

          <MultiSelectCustom
            options={optionsState}
            selected={activeTabData.selectedState}
            setSelected={(v) => updateTab({ selectedState: v })}
            placeholder="Select State"
          />
          <MultiSelectCustom
            options={optionsDepartment}
            selected={activeTabData.selectedDepartment}
            setSelected={(v) => updateTab({ selectedDepartment: v })}
            placeholder="Select Department"
          />
          <MultiSelectCustom
            options={optionsRole}
            selected={activeTabData.selectedRole}
            setSelected={(v) => updateTab({ selectedRole: v })}
            placeholder="Select Role"
          />
          <MultiSelectCustom
            options={optionsType}
            selected={activeTabData.selectedEmploymentType}
            setSelected={(v) => updateTab({ selectedEmploymentType: v })}
            placeholder="Employment Type"
          />
        </div>
      </section>

      <section className="uploads-containers">
        {[
          { key: "payroll", label: "Payroll Data" },
          { key: "people", label: "People and Teams Data" },
          { key: "employee", label: "Employee Update Data" },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: "16px" }}>
            <div style={{ textAlign: "left", fontSize: "12px", fontFamily: "Inter", fontWeight: 500 }}>
              Upload {item.label}
            </div>

            <div className="upload-boxes">
              <label>
                <input
                  type="file"
                  multiple
                  accept=".xlsx, .xls, .csv"
                  data-type={item.key}
                  data-tab={activeTab}
                  onChange={(e) => handleFileChange(e, item.key)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="uploadss-iconss" style={{ cursor: 'pointer' }}>
                  <img src={UploadTlcIcon} alt="uploadtlcIcon" style={{ height: "48px", width: "48px" }} />
                </div>
                <p style={{ fontSize: '14px', color: '#444', fontFamily: 'Inter', cursor: 'pointer' }}>
                  {activeTabData.fileNames[item.key].length === 0
                    ? <>Click to upload <span style={{ color: '#EA7323' }}>{item.label}</span><br></br><small>.XLSX, .XLS, .CSV</small></>
                    : "Uploaded files:"}
                </p>
              </label>
              <div className="upload-content">
                {/* Uploaded files list */}
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {activeTabData.fileNames[item.key].map((fileName, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#DADADA",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        marginBottom: '4px'
                      }}
                    >
                      <span title={fileName}>
                        {fileName.length > 20 ? fileName.slice(0, 30) + "..." : fileName}
                      </span>
                      <span
                        style={{ cursor: "pointer", color: "#f97316", fontWeight: "bold" }}
                        onClick={() => {
                          // Remove file from the array
                          const updatedFiles = activeTabData.fileNames[item.key].filter((_, i) => i !== idx);
                          updateTab({
                            fileNames: { ...activeTabData.fileNames, [item.key]: updatedFiles },
                          });
                        }}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>


      {activeTabData.stage === "loading" && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Processing your data, please wait...</p>
        </div>
      )}

      <div className="search-section">
        {activeTabData.stage === "overview" && activeTabData.analysisData && (
          <section className="dashboard">
            <h2 className="section-title">
              {(() => {
                const titles = {
                  1: "Payroll Overview",
                  2: "Detailed Breakdown",
                  3: "Leave & Absences",
                };
                return titles[activeTabData.currentPage] || `Page ${activeTabData.currentPage}`;
              })()}
            </h2>

            {activeTabData.analysisData && (
              <div className="summary-cards">
                {(() => {
                  const pageKey = `page ${activeTabData.currentPage}`;
                  const pageScorecard = activeTabData.analysisData.pages?.[pageKey]?.scorecard || {};

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

                  const allowedKeys = allowedKeysByPage[activeTabData.currentPage] || [];

                  return Object.entries(pageScorecard)
                    .filter(([label]) => allowedKeys.length === 0 || allowedKeys.includes(label))
                    .map(([label, value], index) => (
                      <div key={index} className="summary-card">
                        <p>{label}</p>
                        <h3>
                          {typeof value === "number"
                            ? `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                            : value}
                        </h3>
                      </div>
                    ));
                })()}
              </div>
            )}

            <div className="charts-grid">
              {(activeTabData.analysisData.pages?.[`page ${activeTabData.currentPage}`]?.figures || [])
                .filter(
                  (chartHTML) =>
                    !chartHTML.toLowerCase().includes("<table") &&
                    !chartHTML.toLowerCase().includes("employee leave")
                )
                .map((chartHTML, index) => (
                  <div
                    key={`${activeTabData.currentPage}-${index}`}
                    id={`chart-${activeTabData.currentPage}-${index}`}
                  >
                    {renderHtmlFigure(chartHTML)}
                  </div>
                ))}
            </div>

            {/* Page 3 Table */}
            {activeTabData.currentPage === 3 && (() => {
              const tableFigure = (activeTabData.analysisData.pages?.[`page ${activeTabData.currentPage}`]?.figures || []).find(
                (html) =>
                  html.toLowerCase().includes("<table") ||
                  html.toLowerCase().includes("employee leave")
              );
              if (!tableFigure) return null;

              return (
                <div id={`leave-table-${activeTabData.currentPage}`}>
                  {renderHtmlFigure(tableFigure)}
                </div>
              );
            })()}

            {/* Page 1 Table */}
            {activeTabData.currentPage === 1 && (() => {
              const tableHTML =
                activeTabData.analysisData.table ||
                activeTabData.analysisData.pages?.["page 1"]?.table ||
                "";
              if (!tableHTML) return null;

              return (
                <div className="table-box" id={`table-${activeTabData.currentPage}`}>
                  {renderHtmlFigure(tableHTML)}
                </div>
              );
            })()}

            {/* Navigation Buttons */}
            <div className="nav-buttons">
              {activeTabData.currentPage > 1 && (
                <button
                  className="back-btn"
                  onClick={() => updateTab({ currentPage: 1 })}
                >
                  ← Back to Payroll Overview
                </button>
              )}

              {activeTabData.currentPage === 1 && (
                <button
                  className="next-btn"
                  onClick={() => updateTab({ currentPage: 2 })}
                  style={{
                    marginLeft: "auto",
                    background: "#f97316",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  View Detailed Breakdown →
                </button>
              )}

              {activeTabData.currentPage === 2 && (
                <button
                  className="next-btn"
                  onClick={() => updateTab({ currentPage: 3 })}
                  style={{
                    marginLeft: "auto",
                    background: "#f97316",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  View Leave Summary →
                </button>
              )}
            </div>

          </section>
        )}

        {activeTabData.stage === "filters" && !activeTabData.analysisData && (
          <button className="search-btn" onClick={handleAnalyse} disabled={loading}>
            {loading ? "Processing..." : "Analyse"}
          </button>
        )}
      </div>

      {activeTabData.stage !== "loading" && (
        <section className="history-container">
          <div className="history-title">History</div>

          {loadingHistory ? (
            <p style={{ textAlign: "center", color: "#555" }}>Loading history...</p>
          ) : historyList.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>No saved history found.</p>
          ) : (
            <>
              {historyList.map((item, index) => {
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
                    style={{
                      position: "relative",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* Delete button (cross icon) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHistoryId(item.id);
                        setShowDeleteModal(true);
                      }}
                      title="Delete analysis"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        color: "#EA7323",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                    >
                      ×
                    </button>

                    {/* History card body */}
                    <div onClick={() => handleHistoryClick(item)}>
                      <div className="history-top">
                        <div className="history-date-range">
                          <strong className="label">Date Range:</strong>{" "}
                          <span className="value">
                            {start
                              ? new Date(start).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              })
                              : "N/A"}{" "}
                            –{" "}
                            {end
                              ? new Date(end).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="history-open-icon">↗</div>
                      </div>

                      <div className="saved-on">
                        <span className="saved-label">Saved On:</span>{" "}
                        <span className="saved-value">{createdAt}</span>
                      </div>

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
                  </div>
                );
              })}

              {/* ✅ Delete confirmation modal (moved outside .map) */}
              {showDeleteModal && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "10px",
                      padding: "20px 28px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      textAlign: "center",
                      animation: "scaleIn 0.25s ease",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "16px",
                      }}
                    >
                      Are you sure?
                    </h4>

                    <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        style={{
                          background: "#E5E7EB",
                          color: "#111",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 16px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        No
                      </button>
                      <button
                        onClick={handleDeleteHistory}
                        disabled={deleting}
                        style={{
                          background: "#EA7323",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 16px",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: deleting ? 0.7 : 1,
                        }}
                      >
                        {deleting ? "..." : "Yes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}