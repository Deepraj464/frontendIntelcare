import React, { useState } from "react";
import "../../../Styles/ResumeScreening.css";
import ScreeningTest from "./ScreeningTest";
import StaffOnboarding from "./StaffOnboarding";
import StaffComplianceDashboard from "./StaffComplianceDashboard";
import DocumentVerification from "./DocumentVerification";

const ResumeScreening = ({
  selectedRole,
  handleClick,
  setShowFeedbackPopup,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("Resume Screening");
  const [showResults, setShowResults] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".zip") || file.name.endsWith(".rar"))) {
      setSelectedFile(file);
    } else {
      alert("Please upload only .zip or .rar files");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".zip") || file.name.endsWith(".rar"))) {
      setSelectedFile(file);
    } else {
      alert("Please drop only .zip or .rar files");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setIsAnalyzing(true);

    try {
      if (handleClick) {
        await handleClick();
      }

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setShowResults(true);
      setIsAnalyzing(false);

      if (setShowFeedbackPopup) {
        setShowFeedbackPopup(true);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
      alert("Analysis failed. Please try again.");
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setShowResults(false);
    setSelectedCandidates(new Set());
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(candidateId)) {
        newSelected.delete(candidateId);
      } else {
        newSelected.add(candidateId);
      }
      return newSelected;
    });
  };

  const handleSendScreeningTest = () => {
    if (selectedCandidates.size === 0) {
      alert("Please select at least one candidate to send screening test.");
      return;
    }
    alert(
      `Screening test link sent to ${selectedCandidates.size} selected candidate(s)!`
    );
    setSelectedCandidates(new Set());
  };

  const candidates = [
    {
      id: 1,
      name: "Robert Drowski",
      score: 8,
      experience: "2 years",
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      score: 9,
      experience: "3 years",
      skills: ["Vue.js", "Express", "PostgreSQL"],
    },
    {
      id: 3,
      name: "Michael Chen",
      score: 7,
      experience: "1.5 years",
      skills: ["Angular", "Python", "Docker"],
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      score: 8,
      experience: "4 years",
      skills: ["TypeScript", "AWS", "GraphQL"],
    },
    {
      id: 5,
      name: "David Thompson",
      score: 9,
      experience: "5 years",
      skills: ["JavaScript", "Kubernetes", "Redis"],
    },
  ];

  return (
    <div className="hr-analysis-container">
      <div className="top-nav">
        <button
          className={`nav-tab ${
            activeTab === "Resume Screening" ? "active" : ""
          }`}
          onClick={() => handleTabClick("Resume Screening")}
        >
          Resume Screening
        </button>
        <button
          className={`nav-tab ${
            activeTab === "Screening Test" ? "active" : ""
          }`}
          onClick={() => handleTabClick("Screening Test")}
        >
          Screening Test
        </button>
        <button
          className={`nav-tab ${
            activeTab === "Document Verfication" ? "active" : ""
          }`}
          onClick={() => handleTabClick("Document Verfication")}
        >
          Document Verfication
        </button>
        <button
          className={`nav-tab ${
            activeTab === "Staff Onboarding" ? "active" : ""
          }`}
          onClick={() => handleTabClick("Staff Onboarding")}
        >
          Staff Onboarding
        </button>
        <button
          className={`nav-tab ${
            activeTab === "Staff Compliance Check" ? "active" : ""
          }`}
          onClick={() => handleTabClick("Staff Compliance Check")}
        >
          Staff Compliance Check
        </button>
      </div>

      <div className="content-area">
        {activeTab === "Resume Screening" && !showResults && (
          <div className="upload-section-container">
            <h1 className="page-title">Resume Screening</h1>
            <p className="page-subtitle">
              Upload your Zip folder with multiple staff resumes
            </p>

            <div className="upload-section">
              <div className="upload-label">
                Monthly Financial Health
                <div className="info-icon">i</div>
              </div>

              <div
                className={`upload-area ${selectedFile ? "file-selected" : ""}`}
                onClick={() => document.getElementById("hrFileInput").click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  {selectedFile ? selectedFile.name : "Drop file or browse"}
                </div>
                <div className="upload-subtext">
                  {selectedFile
                    ? "File selected successfully"
                    : "Format: .zip .rar only"}
                </div>
                <input
                  type="file"
                  id="hrFileInput"
                  style={{ display: "none" }}
                  accept=".zip,.rar"
                  onChange={handleFileSelect}
                />
              </div>

              <button
                className={`analyze-btn ${isAnalyzing ? "analyzing" : ""}`}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyse ⚙️"
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "Resume Screening" && showResults && (
          <div className="results-container">
            <h1 className="page-title">Resume Screening Results</h1>
            <p className="page-subtitle">
              Analysis complete - Review candidate profiles
            </p>

            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`candidate-card ${
                    selectedCandidates.has(candidate.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleCandidateSelection(candidate.id)}
                >
                  <div className="candidate-info">
                    <div className="candidate-header">
                      <h3 className="candidate-name">{candidate.name}</h3>
                      <div className="candidate-score">
                        <span className="score-label">Score:</span>
                        <span className="score-value">
                          {candidate.score}/10
                        </span>
                      </div>
                    </div>

                    <div className="candidate-details">
                      <p className="experience">
                        Experience: {candidate.experience}
                      </p>
                      <div className="star-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`star ${
                              i < Math.floor(candidate.score / 2)
                                ? "filled"
                                : ""
                            }`}
                          >
                            {i < Math.floor(candidate.score / 2) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="skills-container">
                      {candidate.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              {selectedCandidates.size > 0 && (
                <button
                  className="sent-test-btn"
                  onClick={handleSendScreeningTest}
                >
                  Send Screening Test to {selectedCandidates.size} Candidate(s)
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "Screening Test" && <ScreeningTest />}
        {activeTab === "Staff Onboarding" && <StaffOnboarding />}
        {activeTab === "Staff Compliance Check" && <StaffComplianceDashboard />}
        {activeTab === "Document Verfication" && <DocumentVerification />}
      </div>
    </div>
  );
};

export default ResumeScreening;
