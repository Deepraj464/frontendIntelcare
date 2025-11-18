import React, { useState } from "react";
import '../../../Styles/TlcClientProfitability.css';
import TlcLogo from '../../../Images/TLCLogo.png';
import UploadTlcIcon from '../../../Images/UploadTlcIcon.png';
import star from '../../../Images/star.png';
import Select from "react-select";
const TlcClientProfitability = () => {
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [files, setFiles] = useState([]);
    const [isTlcClientProfitabilityLoading, setTlcClientProfitabilityLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: "8px",
            borderColor: state.isFocused ? "#6C4CDC" : "#ccc",
            boxShadow: state.isFocused ? "0 0 0 0.5px #6C4CDC" : "none",
            padding: "2px 6px",
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#6C4CDC"
                : state.isFocused
                    ? "#EFE8FF"
                    : "white",
            color: state.isSelected ? "white" : "#333",
            cursor: "pointer",
            padding: "10px",
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#ccc", // placeholder color
            fontSize: "14px",
            fontFamily: 'Inter'
        }),

        menu: (provided) => ({
            ...provided,
            borderRadius: "8px",
            border: "1px solid #ccc",
            overflow: "hidden",
        })
    };


    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).map((file) => file.name);
        setFiles((prev) => [...prev, ...selected]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const dummyresponseData = [
        {
            id: 1,
            type: "Receivables",
            total: 12000,
            month: "Jan"
        },
        {
            id: 2,
            type: "Payables",
            total: 8000,
            month: "Jan"
        },
        {
            id: 3,
            type: "Profitability",
            total: 4000,
            month: "Jan"
        }
    ];


    const handleAnalyse = () => {
        setTlcClientProfitabilityLoading(true);

        setTimeout(() => {
            setResponseData(dummyresponseData);
            setTlcClientProfitabilityLoading(false);
        }, 2000);
    };

    const regionOptions = [
        { value: "north", label: "North" },
        { value: "south", label: "South" },
        { value: "east", label: "East" },
        { value: "west", label: "West" }
    ];

    const departmentOptions = [
        { value: "IT", label: "IT" },
        { value: "HR", label: "HR" },
        { value: "Sales", label: "Sales" },
        { value: "Finance", label: "Finance" }
    ];

    const accountOptions = [
        { value: "ac1", label: "Account 1" },
        { value: "ac2", label: "Account 2" }
    ];

    const accountCodeOptions = [
        { value: "001", label: "001" },
        { value: "002", label: "002" }
    ];


    return (
        <div className="page-containersss">
            <div className="left-headerss">
                <img src={TlcLogo} alt="Logo" className="tlclogo" />
            </div>
            {!responseData ?
                <div>
                    <div className="date-section" style={{ gap: '8%' }}>
                        {/* Report Start Date */}
                        <div className="date-picker" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", fontFamily: "Inter", }}>
                                Select Start Month
                            </label>
                            <div className="date-inputs">
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
                        <div className="date-picker" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <label style={{ fontSize: "14px", fontWeight: "500", fontFamily: "Inter" }}>
                                Select End Month
                            </label>
                            <div className="date-inputs">
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                        <div style={{ marginBottom: "16px", width: '40%' }}>
                            <div style={{ textAlign: "left", fontSize: "14px", fontFamily: "Inter", fontWeight: 500, marginBottom: '6px', textAlign: 'center' }}>
                                Upload Receivables, Payables and Profitables Data
                            </div>

                            <div
                                className="upload-boxes"
                                style={{ cursor: "pointer", padding: '40px 14px' }}
                                onClick={() => document.getElementById("payroll-file-input").click()}
                            >
                                <input
                                    id="payroll-file-input"
                                    type="file"
                                    multiple
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />

                                <div className="uploadss-iconss">
                                    <img src={UploadTlcIcon} alt="uploadIcon" style={{ height: "48px", width: "48px" }} />
                                </div>

                                <p style={{ fontSize: "14px", color: "#444", fontFamily: "Inter" }}>
                                    {files.length === 0 ? (
                                        <>
                                            Click to upload <span style={{ color: "#6C4CDC" }}>Receivables, Payables and Profitables Data</span>
                                            <br />
                                            <small>.XLSX, .XLS</small>
                                        </>
                                    ) : (
                                        "Uploaded files:"
                                    )}
                                </p>

                                {files.length > 0 && (
                                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                        {files.map((fileName, idx) => (
                                            <div
                                                key={idx}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#DADADA", padding: "4px 8px", borderRadius: "6px", fontSize: "14px", fontFamily: "Inter" }}
                                            >
                                                <span title={fileName}>
                                                    {fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName}
                                                </span>

                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    style={{ cursor: "pointer", color: "#6C4CDC", fontWeight: "bold" }}
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        className="analyse-btn"
                        disabled={isTlcClientProfitabilityLoading}
                        style={{ backgroundColor: '#000', marginTop: '20px' }}
                        onClick={handleAnalyse}
                    >
                        {isTlcClientProfitabilityLoading
                            ? `Analysing...`
                            : <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>Analyse<img src={star} alt='img' style={{ width: '20px', height: '20px' }} /></div>}
                    </button>
                </div>
                :
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', marginTop: '20px', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '600', fontFamily: 'Inter', marginBottom: '10px' }}>
                                Participant Profitability Overview
                            </div>
                            <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: '500', color: '#928F8F' }}>
                                Scorecards and charts at the top, detailed per-participant table with filters at the bottom.
                            </div>
                        </div>
                        <button style={{ border: 'none', borderRadius: '30px', fontFamily: 'Inter', padding: '14px 32px', fontSize: '16px', fontWeight: '500', color: 'white', outline: 'none', cursor: 'pointer', backgroundColor: '#6c4cdc' }}>
                            AI Analyse
                        </button>
                    </div>
                    <div className="tlcClient-dashboard-summary">
                        <div className="tlcClient-dashboard-card">
                            <p>Total Revenue</p>
                            <h3>$13,957,815.41</h3>
                            <p>All months, All Participants</p>
                        </div>
                        <div className="tlcClient-dashboard-card">
                            <p>Total Expense</p>
                            <h3>$598,484.88</h3>
                            <p>Allocated expenses</p>
                        </div>
                        <div className="tlcClient-dashboard-card">
                            <p>Total Profit</p>
                            <h3>$13,359,330.53</h3>
                            <p>Revenue minus allocated expense</p>
                        </div>
                        <div className="tlcClient-dashboard-card">
                            <p>Overall Margin</p>
                            <h3>95.7%</h3>
                            <p>Profit / Revenue</p>
                        </div>
                    </div>
                    <div className="client-profitability-graph">
                        <div className="client-profitabilty-graph-each">
                            <div style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Inter', marginBottom: '16px',textAlign:'left' }}>Detailed Per-Participant Table</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '18% 18% 18% 18% 20%', columnGap: '2%' }}
                            >
                                <Select
                                    options={regionOptions}
                                    placeholder="Region"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={departmentOptions}
                                    placeholder="Department"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={accountOptions}
                                    placeholder="Account"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={accountCodeOptions}
                                    placeholder="Account Code"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <input
                                    type="text"
                                    placeholder="Search Participant..."
                                    className="filter-search-input"
                                />
                            </div>
                            <div style={{marginTop:'50px',marginBottom:'50px'}}>
                                Display table here.....
                            </div>
                        </div>
                        <div className="client-profitabilty-graph-each">
                            <div style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Inter', marginBottom: '16px',textAlign:'left'}}>Detailed Per-Participant Table</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '18% 18% 18% 18% 20%', columnGap: '2%' }}
                            >
                                <Select
                                    options={regionOptions}
                                    placeholder="Region"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={departmentOptions}
                                    placeholder="Department"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={accountOptions}
                                    placeholder="Account"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <Select
                                    options={accountCodeOptions}
                                    placeholder="Account Code"
                                    className="filter-dropdown"
                                    styles={customStyles}
                                />

                                <input
                                    type="text"
                                    placeholder="Search Participant..."
                                    className="filter-search-input"
                                />
                            </div>
                            <div style={{marginTop:'50px',marginBottom:'50px'}}>
                                Display table here.....
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default TlcClientProfitability;