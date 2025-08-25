import React, { useState } from "react";
import "../../../Styles/SoftwareConnect.css";
import AlayaCare from "../../../Images/Alayacare.png";
import Xero from "../../../Images/Xero.png";
import EmployementHero from "../../../Images/EmploymentHero.png";
import VisualCare from "../../../Images/VisualCare.png";
import QuickBooks from "../../../Images/IntuitQuickBooks.png";
import Myp from "../../../Images/MypTech.png";
import MyOB from "../../../Images/MyOb.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SoftwareConnect = (props) => {
  const [clientId, setClientId] = useState("");
  const [secretId, setSecretId] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedSoftware, setConnectedSoftware] = useState("");

  const softwareList = [
    { name: "AlayaCare", logo: AlayaCare },
    { name: "EmploymentHero", logo: EmployementHero },
    { name: "MYP Technologies", logo: Myp },
    { name: "Xero", logo: Xero },
    { name: "QuickBooks", logo: QuickBooks },
    { name: "MYOB", logo: MyOB },
    { name: "VisualCare", logo: VisualCare },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedSoftware) {
      toast.warn("⚠️ Please select a software");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        software: "myp",
        // userEmail: "testuser@example.com", // <-- hardcoded for now
        userEmail:props.user.email,
        client_id: clientId,
        secret_id: secretId,
        status:
          connectedSoftware === selectedSoftware ? "deregister" : "register",
      };

      console.log("Sending Payload:", payload);

      const res = await axios.post(
        "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/integrationCredsCheck",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Success:", res.data);

      if (connectedSoftware === selectedSoftware) {
        setConnectedSoftware(null);
        toast.success(`${selectedSoftware} disconnected successfully!`);
      } else {
        setConnectedSoftware(selectedSoftware);
        toast.success(`${selectedSoftware} connected successfully!`);
      }
    } catch (err) {
      console.error("❌ Error in handleRegister:", err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
          `Failed to ${connectedSoftware === selectedSoftware ? "disconnect" : "connect"} ${selectedSoftware}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="software-connect-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="software-grid">
        {softwareList.map((software, index) => (
          <div
            key={index}
            className={`software-card ${
              selectedSoftware === software.name ? "active" : ""
            }`}
            onClick={() => setSelectedSoftware(software.name)}
          >
            <img
              src={software.logo}
              alt={software.name}
              className={`software-logo ${
                software.name === "EmploymentHero"
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinners"></div>
          </div>
        ) : (
          <button
            className={`connect-system-btn ${
              connectedSoftware === selectedSoftware ? "disconnect-btn" : ""
            }`}
            disabled={isLoading}
            onClick={handleRegister}
          >
            {connectedSoftware === selectedSoftware ? "Disconnect" : "Register"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SoftwareConnect;
