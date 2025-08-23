import React, { useState } from "react";
import "../../../Styles/SoftwareConnect.css";
import AlayaCare from '../../../Images/Alayacare.png';
import Xero from '../../../Images/Xero.png';
import EmployementHero from '../../../Images/EmploymentHero.png';
import VisualCare from '../../../Images/VisualCare.png';
import QuickBooks from '../../../Images/IntuitQuickBooks.png';
import Myp from '../../../Images/MypTech.png';
import MyOB from '../../../Images/MyOb.png';

const SoftwareConnect = () => {
    const [clientId, setClientId] = useState("");
    const [secretId, setSecretId] = useState("");
    const [selectedSoftware, setSelectedSoftware] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [connectedSoftware, setConnectedSoftware] = useState("");

    const softwareList = [
        { name: "AlayaCare", logo: AlayaCare },
        { name: "Xero", logo: Xero },
        { name: "EmploymentHero", logo: EmployementHero },
        { name: "VisualCare", logo: VisualCare },
        { name: "QuickBooks", logo: QuickBooks },
        { name: "MYP Technologies", logo: Myp },
        { name: "MYOB", logo: MyOB },
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!selectedSoftware) {
            alert("Please select a software");
            return;
        }

        // Disconnect logic
        if (connectedSoftware === selectedSoftware) {
            setConnectedSoftware(null);
            setClientId("");
            setSecretId("");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setConnectedSoftware(selectedSoftware);
        }, 2000);
    };

    return (
        <div className="software-connect-container">
            <div className="software-grid">
                {softwareList.map((software, index) => (
                    <div
                        key={index}
                        className={`software-card ${selectedSoftware === software.name ? "active" : ""
                            }`}
                        onClick={() => setSelectedSoftware(software.name)}
                    >
                        <img
                            src={software.logo}
                            alt={software.name}
                            className={`software-logo ${software.name === "EmploymentHero"
                                ? "employment-hero-logo"
                                : software.name === "QuickBooks"
                                    ? "quickbooks-logo"
                                    : software.name === "Xero"
                                        ? "xero-logo"
                                        : software.name === "MYOB"
                                            ? "myob-logo"
                                            : ""
                                }`}
                        />
                        {connectedSoftware === software.name && (
                            <div className="connected-badge">Connected</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="software-form" onSubmit={handleRegister}>
                <div className="forms-group">
                    <label className="connect-label">Client ID</label>
                    <input
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="Enter Client ID"
                        className="connect-input"
                    />
                </div>
                <div className="forms-group">
                    <label className="connect-label">Secret ID</label>
                    <input
                        type="text"
                        value={secretId}
                        onChange={(e) => setSecretId(e.target.value)}
                        placeholder="Enter Secret ID"
                        className="connect-input"
                    />
                </div>
                {isLoading ? (
                    <div style={{display:'flex',justifyContent:'center'}}>
                    <div className="spinners"></div>
                    </div>
                ) :
                    <button className={`connect-system-btn ${connectedSoftware === selectedSoftware ? "disconnect-btn" : ""}`} disabled={isLoading} onClick={handleRegister}>
                        {connectedSoftware === selectedSoftware ? (
                            "Disconnect"
                        ) : (
                            "Register"
                        )}
                    </button>
                }
            </div>
        </div>
    );
};

export default SoftwareConnect;
