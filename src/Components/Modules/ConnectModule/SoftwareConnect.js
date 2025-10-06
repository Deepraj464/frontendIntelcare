import React, { useState, useEffect } from "react";
import "../../../Styles/SoftwareConnect.css";
import AlayaCare from "../../../Images/Alayacare.png";
import Xero from "../../../Images/Xero.png";
import EmployementHero from "../../../Images/EmploymentHero.png";
import VisualCare from "../../../Images/VisualCare.png";
import QuickBooks from "../../../Images/IntuitQuickBooks.png";
import Myp from "../../../Images/MypTech.png";
import MyOB from "../../../Images/MyOb.png";
import CareVision from '../../../Images/CareVision.png';
import GoogledriveIcon from '../../../Images/GoogleDriveIcon.png';
import SharePointIcon from '../../../Images/SharePointIcon.png';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SoftwareConnect = (props) => {
  const softwareList = [
    { name: "AlayaCare", logo: AlayaCare },
    { name: "VisualCare", logo: VisualCare },
    { name: "MYP Technologies", logo: Myp },
    { name: 'CareVision', logo: CareVision },
    { name: "Xero", logo: Xero },
    { name: "QuickBooks", logo: QuickBooks },
    { name: "MYOB", logo: MyOB },
    { name: "EmploymentHero", logo: EmployementHero },
  ];

  const [clientId, setClientId] = useState("");
  const [secretId, setSecretId] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState(softwareList[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState([]);

  const [googleDriveURL, setGoogleDriveURL] = useState("");
  const [sharePointURL, setSharePointURL] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [shareConnected, setShareConnected] = useState(false);

  // ✅ Fetch already connected softwares + creds 
  useEffect(() => {
    const fetchConnected = async () => {
      if (!props.user?.email) return;

      try {
        console.log("Making GET request for user:", props.user.email);

        // Use the correct endpoint from your router: /getSoftwares
        const response = await fetch(
          `https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/getSoftwares?userEmail=${encodeURIComponent(props.user.email)}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json"
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success response:", data);

        const integrations = data.integrations || data || [];
        setIntegrations(integrations);

        // ✅ if first software is already connected, preload its creds
        const current = integrations.find((i) => i.software === selectedSoftware);
        if (current) {
          setClientId(current.client_id || "");
          setSecretId(current.secret_id || "");
        } else {
          setClientId("");
          setSecretId("");
        }
      } catch (err) {
        console.error("Error fetching connected softwares:", err.message);
        setIntegrations([]);
      }
    };

    fetchConnected();
  }, [props.user.email, selectedSoftware]);

  // ✅ When user clicks on another software card, preload creds if available
  const handleSelectSoftware = (software) => {
    setSelectedSoftware(software);

    const current = integrations.find((i) => i.software === software);
    if (current) {
      setClientId(current.client_id || "");
      setSecretId(current.secret_id || "");
    } else {
      setClientId("");
      setSecretId("");
    }
  };

  const handleRegister = async () => {
    if (!selectedSoftware) {
      toast.warn("⚠️ Please select a software");
      return;
    }

    if (!clientId.trim() || !secretId.trim()) {
      toast.warn("⚠️ Please enter both Client ID and Secret ID");
      return;
    }

    setIsLoading(true);

    try {
      const isConnected = integrations.some((i) => i.software === selectedSoftware);
      const payload = {
        software: selectedSoftware,
        userEmail: props.user.email,
        client_id: clientId,
        secret_id: secretId,
        status: isConnected ? "deregister" : "register",
      };

      const response = await fetch(
        "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net/integrationCredsCheck",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (isConnected) {
        // remove from state
        setIntegrations((prev) => prev.filter((i) => i.software !== selectedSoftware));
        setClientId("");
        setSecretId("");
        toast.success(`${selectedSoftware} disconnected successfully!`);
      } else {
        // add to state
        setIntegrations((prev) => [
          ...prev,
          { software: selectedSoftware, client_id: clientId, secret_id: secretId },
        ]);
        toast.success(`${selectedSoftware} connected successfully!`);
      }
    } catch (err) {
      console.error("❌ Error in handleRegister:", err.message);
      toast.error(
        err.message ||
        `Failed to ${integrations.some((i) => i.software === selectedSoftware)
          ? "disconnect"
          : "connect"
        } ${selectedSoftware}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = integrations.some((i) => i.software === selectedSoftware);

  return (
    <div className="software-connect-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Software Grid */}
      <div className="software-grid">
        {softwareList.map((software, index) => (
          <div
            key={index}
            className={`software-card ${selectedSoftware === software.name ? "active" : ""}`}
            onClick={() => handleSelectSoftware(software.name)}
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
            {integrations.some((i) => i.software === software.name) && (
              <div className="connected-badge">Connected</div>
            )}
          </div>
        ))}
      </div>

      {/* Input Fields and Button (No Form Wrapper) */}
      <div className="software-form">
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
            className={`connect-system-btn ${isConnected ? "disconnect-btn" : ""}`}
            disabled={isLoading}
            onClick={handleRegister}
          >
            {isConnected ? "Disconnect" : "Register"}
          </button>
        )}
      </div>
      <div className="integration-row">
        <img src={GoogledriveIcon} alt="Google Drive" className="integration-icon" />
        <input
          type="text"
          value={googleDriveURL}
          onChange={(e) => setGoogleDriveURL(e.target.value)}
          placeholder="Enter Google Drive URL"
          className="integration-input"
        />
        <button
          className={`connect-url-btn ${googleConnected ? "disconnect-btn" : ""}`}
        >
          Connect
        </button>
      </div>

      {/* ✅ SharePoint Row */}
      <div className="integration-row">
        <img src={SharePointIcon} alt="SharePoint" className="integration-icon" />
        <input
          type="text"
          value={sharePointURL}
          onChange={(e) => setSharePointURL(e.target.value)}
          placeholder="Enter SharePoint URL"
          className="integration-input"
        />
        <button
          className={`connect-url-btn ${shareConnected ? "disconnect-btn" : ""}`}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default SoftwareConnect;
