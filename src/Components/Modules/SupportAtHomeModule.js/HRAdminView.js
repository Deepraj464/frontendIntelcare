import React, { useState } from "react";
import "../../../Styles/ResumeScreening.css";
import StaffOnboarding from "./StaffOnboarding";
import StaffComplianceDashboard from "./StaffComplianceDashboard";
import UploadFiles from "../../UploadFiles";
import ScreeningTestCreation from "./ScreeningTestCreation";
import AdminDocumentVerification from "./AdminDocumentVerification";

const HRAdminView = ({
  handleClick,
  setShowFeedbackPopup,
  role,
  selectedRole
}) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("Resume Screening");
  const [showResults, setShowResults] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());

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
          className={`nav-tab ${activeTab === "Resume Screening" ? "active" : ""
            }`}
          onClick={() => handleTabClick("Resume Screening")}
        >
          Resume Screening
        </button>
        <button
          className={`nav-tab ${activeTab === "Screening Test Creation" ? "active" : ""
            }`}
          onClick={() => handleTabClick("Screening Test Creation")}
        >
          Screening Test Creation
        </button>
        <button
          className={`nav-tab ${activeTab === "Document Verfication" ? "active" : ""
            }`}
          onClick={() => handleTabClick("Document Verfication")}
        >
          Document Verfication
        </button>
        <button
          className={`nav-tab ${activeTab === "Staff Onboarding" ? "active" : ""
            }`}
          onClick={() => handleTabClick("Staff Onboarding")}
        >
          Staff Onboarding
        </button>
        <button
          className={`nav-tab ${activeTab === "Staff Compliance Check" ? "active" : ""
            }`}
          onClick={() => handleTabClick("Staff Compliance Check")}
        >
          Staff Compliance Check
        </button>
      </div>

      <div className="content-area">
        {activeTab === "Resume Screening" && !showResults && (
          <div className="upload-section-container">
            {/* <h1 className="page-title">Resume Screening</h1> */}
            <p className="page-subtitle">
              Upload your Zip folder with multiple staff resumes
            </p>

            <div className="uploader-grid"
              style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '75%' }}>
                <UploadFiles
                  files={selectedFile}
                  setFiles={setSelectedFile}
                  title='Resume Screening'
                  subtitle='Upload multiple .zip, .rar file'
                  fileformat=".zip, .rar"
                  removeFile={(index) => {
                    setSelectedFile(prev => prev.filter((_, i) => i !== index));
                  }}
                  multiple={true}
                  isProcessing={isAnalyzing}
                />
              </div>
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
                "Analyse"
              )}
            </button>
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
                  className={`candidate-card ${selectedCandidates.has(candidate.id) ? "selected" : ""
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
                            className={`star ${i < Math.floor(candidate.score / 2)
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

        {activeTab === "Screening Test Creation" && <ScreeningTestCreation/>}
        {activeTab === "Staff Onboarding" && <StaffOnboarding role={role}/>}
        {activeTab === "Staff Compliance Check" && <StaffComplianceDashboard />}
        {activeTab === "Document Verfication" && <AdminDocumentVerification/>}
      </div>
    </div>
  );
};

export default HRAdminView;
