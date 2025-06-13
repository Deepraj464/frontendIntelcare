import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import '../Styles/SummaryReportViwer.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const SummaryReport = ({summaryText,handleDownloadAnalyedReportUploadedCSV,handleDownloadAnalyedStandardReportCSV,selectedRole}) => {
  const parsedResponse =summaryText && typeof summaryText === "string"? JSON.parse(summaryText): summaryText;

  const compliance_level = parsedResponse?.compliance_level || '';
  const review_response = parsedResponse?.review_response || '';

  const levelTextColors = {
    High: "compliance-high",
    Moderate: "compliance-moderate",
    Low: "compliance-low"
  };

  const levelTextClass = levelTextColors[compliance_level] || "compliance-normal";

  return (
    <div className="summary-report-container">
      {selectedRole === 'Financial Health' ? (
        <>
          <div className="title" style={{ textAlign: 'center' }}>AI SUMMARY</div>

          <div className="download-report-div">
            <div style={{ fontSize: '18px', fontWeight: '500', textAlign: 'center', marginBottom: '20px', marginTop: '12px' }}>
              Download Reports
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div style={{ width: '60%', display: 'flex', justifyContent: 'space-between' }}>
                <button className="download-report-btn" onClick={handleDownloadAnalyedStandardReportCSV}>
                  Approved Standard Format <MdOutlineFileDownload color="white" style={{ marginLeft: '4px' }} size={24} />
                </button>
                <button className="download-report-btn" onClick={handleDownloadAnalyedReportUploadedCSV}>
                  Your Uploaded Format <MdOutlineFileDownload color="white" style={{ marginLeft: '4px' }} size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Render Markdown for review_response */}
          <div className="financial-health-markdown">
            <ReactMarkdown
              children={review_response}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
          </div>

          {/* Compliance Level Display */}
          <div className="compliance-level-container">
            <strong className={`${levelTextClass} compliance-level-text`}>
              Overall Compliance Level:
            </strong>{" "}
            <span className={`${levelTextClass} compliance-level-text`}>
              {compliance_level}
            </span>
          </div>
        </>
      ) : selectedRole === 'SIRS Analysis' ? (
        <>
          <div className="sirs-markdown">
            <ReactMarkdown
              children={parsedResponse?.incident}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
            <ReactMarkdown
              children={parsedResponse?.risk}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
            <ReactMarkdown
              children={parsedResponse?.recommendation}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            />
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          No report format available for this role.
        </div>
      )}
    </div>
  );
};

export default SummaryReport;
