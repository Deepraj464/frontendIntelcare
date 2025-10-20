import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../Styles/TlcCustomReporting.css";
import TLCLogo from "../../../Images/TLCLogo.png";
import UploadTlcIcon from "../../../Images/UploadTlcIcon.png";
import { FiChevronDown } from "react-icons/fi";

export default function TlcCustomerReporting() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState([]);
  const [fileNames, setFileNames] = useState({
    payroll: "",
    people: "",
    employee: "",
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [type]: file.name }));
    }
  };

  const handleAnalyse = () => {
    alert("Analysing with applied filters...");
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
        <button className="save-btn">Save to Database</button>
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
                  accept=".xlsx, .xls"
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
                    {fileNames[item.key] ? (
                      <strong>{fileNames[item.key]}</strong>
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

      {/* Analyse Button */}
      <div className="search-section">
        <button className="search-btn" onClick={handleAnalyse}>
          Analyse
        </button>
      </div>

      {/* History Section */}
      <section className="history-container">
        <div className="history-title">History</div>
        <div className="history-card">
          <div className="history-header">
            <p>
              <strong>Date Range:</strong> 28 Dec 22 – 10 Jan 23
            </p>
            <small>Saved On: 28 Dec 25</small>
          </div>
          <div className="history-details">
            <span>State: Adelaide +3</span>
            <span>Department: Software +2</span>
            <span>Role: Tester +3</span>
            <span>Employment Type: Full Time +2</span>
          </div>
        </div>
      </section>
    </div>
  );
}
