import React from "react";
import insight1 from "../../../Images/Graph.png";
import insight2 from "../../../Images/Graph.png";
import insight3 from "../../../Images/Graph.png";
import insight4 from "../../../Images/Graph.png";
import "../../../Styles/StaffComplianceDashboard.css";

const StaffInsights = () => {
  return (
    <div className="dashboard">
      {/* Top image grid */}
      <div className="image-grid">
        <img src={insight1} alt="Insight 1" />
        <img src={insight2} alt="Insight 2" />
        <img src={insight3} alt="Insight 3" />
        <img src={insight4} alt="Insight 4" />
      </div>

      {/* Compliance summary card */}
      <div className="report-card">
        <h2>📄 Weekly Staff Compliance & Performance Summary</h2>
        <p className="report-subtext">
          Reporting Period: 21 July – 27 July 2025 · Prepared for:
          Curifi Care Services Analyst · NDIS & Aged Care Data Team
        </p>

        <h3>📊 Compliance Overview</h3>
        <p>
          This week, all 49 active staff members underwent compliance checks.
          First Aid, Police, and NDIS clearances were maintained for over
          95% of staff. Two manual handling certifications were flagged
          for expiry within the next 30 days.
        </p>
        <ul>
          <li>✔ Overall Compliance Rate: <strong>96.8%</strong></li>
          <li>✔ Expired Certifications: <strong>0</strong></li>
          <li>⚠ Expiring Within 30 Days: <strong>2</strong></li>
        </ul>

        <h3>🚨 Non-Compliance Alerts</h3>
        <p>
          A total of 3 non-compliance alerts were recorded:
        </p>
        <ul>
          <li>• Incomplete documentation: 1 instance</li>
          <li>• Late policy acknowledgement: 1 instance</li>
          <li>• Expired Manual Handling certification: 1 instance</li>
        </ul>

        <h3>🛠 Recommendations</h3>
        <ul>
          <li>• Send renewal reminders for Manual Handling certifications.</li>
          <li>• Follow up on outstanding documentation.</li>
          <li>• Review policy acknowledgement process to avoid delays.</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffInsights;
