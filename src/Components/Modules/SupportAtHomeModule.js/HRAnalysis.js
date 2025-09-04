import React, { useState } from "react";
import HRAdminView from "./HRAdminView";
import HRStaffView from "./HRStaffView";

const HRAnalysis = () => {
    const [role, setRole] = useState("Admin");

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <p style={{ margin: 0, fontWeight: "500" }}>Who are you ?</p>
                    <div style={{ display: "flex", border: "1px solid #6c4cdc", borderRadius: "6px", overflow: "hidden" }}>
                        <button
                            onClick={() => setRole("Admin")}
                            style={{
                                padding: "6px 16px",
                                background: role === "Admin" ? "#6c4cdc" : "transparent",
                                color: role === "Admin" ? "#fff" : "#6c4cdc",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "0.2s"
                            }}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole("Staff")}
                            style={{
                                padding: "6px 16px",
                                background: role === "Staff" ? "#6c4cdc" : "transparent",
                                color: role === "Staff" ? "#fff" : "#6c4cdc",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "0.2s"
                            }}
                        >
                            Staff
                        </button>
                    </div>
                </div>
            </div>

            <div>
                {role === "Admin" ? <HRAdminView role={role}/> : <HRStaffView role={role}/>}
            </div>
        </div>
    );
};

export default HRAnalysis;
