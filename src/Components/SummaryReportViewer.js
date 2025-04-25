import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { marked } from "marked"; // Import the marked library for markdown parsing
import '../Styles/SummaryReportViwer.css'; // Import your CSS file

const SummaryReport = ({ summaryText, handleDownloadAnalyedReportCSV }) => {
    const parsedResponse = summaryText && typeof summaryText === "string" ? JSON.parse(summaryText) : summaryText;

    const { review_response, compliance_level } = parsedResponse;

    const sections = review_response.split(/\n\n\d+\.\s/).filter(Boolean);

    // Function to properly format sections with lists and content
    const formatSection = (text, index) => {
        const lines = text.split("\n").filter(Boolean);
        const title = lines[0].replace(/^\d+\.\s/, "").trim();

        // Parse the markdown title and content into HTML
        const markdownTitle = marked(title); // Convert markdown to HTML (e.g., **text** becomes <strong>text</strong>)
        const titleClass = title === '**Strengths:**' ? 'green' :
        (title === '**Areas of Concern or Non-Compliance:**' || title === '**Summary of Overall Compliance Level:**' || title==='**Summary of the Overall Compliance Level:**' || title==='**Concerns or Non-Compliance:**')? 'red' : 'black';
        // console.log(title);


        const markdownContent = lines.slice(1).map((line, i) => {
            if (line.startsWith(" - ")) {
                // If the line starts with a hyphen, it's a list item
                return <li key={i} className="bullet-item">{line.replace(/^ - /, "")}</li>;
            } else {
                // Regular text content
                const markdownText = marked(line); // Parse markdown for regular content as well
                return <p key={i} className="text-item" dangerouslySetInnerHTML={{ __html: markdownText }} />;
            }
        });

        return (
            <div key={index} className="section-container">
                <h3 className={`section-title ${titleClass}`} dangerouslySetInnerHTML={{ __html: markdownTitle }} />
                <ul className="list-disc section-content">{markdownContent}</ul>
            </div>
        );
    };

    const levelTextColors = {
        High: "compliance-high",
        Moderate: "compliance-moderate",
        Low: "compliance-low",
    };

    const levelTextClass = levelTextColors[compliance_level] || "compliance-normal";

    return (
        <>
            <div className="summary-report-container">
                <div className="header-container">
                    <div className="title">AI SUMMARY</div>
                    <div className="download-button-container">
                        <button className="download-btn" onClick={handleDownloadAnalyedReportCSV}>
                            Download Completed Template <MdOutlineFileDownload color="white" style={{ marginLeft: '4px' }} size={24} />
                        </button>
                    </div>
                </div>
                {sections.map(formatSection)}
                <div className="compliance-level-container">
                    <strong className={`${levelTextClass} compliance-level-text`} >Overall Compliance Level:</strong>{" "}
                    <span className={`${levelTextClass} compliance-level-text`}>
                        {compliance_level}
                    </span>
                </div>
            </div>
        </>
    );
};

export default SummaryReport;
