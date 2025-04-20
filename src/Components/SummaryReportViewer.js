import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";

const SummaryReport = ({ summaryText,handleDownloadAnalyedReportCSV}) => {
    const parseSummary = (text) => {
        const lines = text.split("\n");

        return lines.map((line, index) => {
            if (!line.trim()) return <br key={index} />;

            // Headings
            if (line.startsWith("## ")) {
                return <div key={index} style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{line.replace(/^##\s*/, "")}</div>;
            } else if (line.startsWith("# ")) {
                return <div key={index} style={{ fontSize: '24px', fontWeight: 'bold',marginBottom:'-4px' }}>{line.replace(/^#\s*/, "")}</div>;
            }

            // Bold markdown ( **text** -> <strong>text</strong> )
            const boldParsedLine = line.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<strong>${boldText}</strong>`);

            return (
                <p
                    key={index}
                    className="text-base leading-relaxed mt-1"
                    dangerouslySetInnerHTML={{ __html: boldParsedLine }}
                />
            );
        });
    };

    return (
        <>
            <div className="p-2 rounded-md bg-white shadow-sm">
                <div style={{ display: 'flex', justifyContent: 'space-between',alignItems:'center',marginBottom:'6px'}}>
                    <div style={{fontSize:'30px',fontWeight:'bolder'}}>AI SUMMARY</div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                        <button className="download-btn" style={{ padding: '14px', paddingLeft:'20px',paddingRight:'20px', backgroundColor: 'black', color: 'white', border: 'none', outline: 'none', borderRadius: '24px', fontSize: '16px', cursor: 'pointer',display:'flex',alignItems:'center' }} onClick={handleDownloadAnalyedReportCSV}>
                            Download Completed Template <MdOutlineFileDownload color="white" style={{marginLeft:'4px'}} size={24}/>
                        </button>
                    </div>
                </div>
                {parseSummary(summaryText)}
            </div>
        </>
    );
};

export default SummaryReport;
