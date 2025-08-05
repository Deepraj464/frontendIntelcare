// WeeklyReport.js
import React from "react";
import graphImage1 from "../../../Images/rostering_insight_image1.png";
import graphImage2 from "../../../Images/rostering_insight_image2.png";
import graphImage3 from "../../../Images/rostering_insight_image3.png";
import graphImage4 from "../../../Images/rostering_insight_image4.png";

const Report = () => {
  return (
    <div className="dashboard">
      <div className="image-grid">
        <img src={graphImage1} alt="Image 1" />
        <img src={graphImage2} alt="Image 2" />
        <img src={graphImage3} alt="Image 3" />
        <img src={graphImage4} alt="Image 4" />
      </div>

      <div className="report-card">
        <h2>📄 Weekly Staff Roster and Compliance Summary</h2>
        <p className="report-subtext">
          Reporting Period: 21 July – 27 July 2025 · Prepared for:
          Curifi Care Services Analyst · NDIS & Aged Care Data Team
        </p>

        <h3>🌼 Staff Rostering Overview</h3>
        <p>
          Across the reporting period, 192 rosters with active schedules
          for direct support and care staff. The roster included 49
          active staff members, with an average shift length of 6.1
          hours. Coverage remained consistent across weekdays, with
          reduced coverage seen on weekends, primarily due to lower
          client bookings.
        </p>
        <ul>
          <li>✔ Shift Coverage Rate: <strong>94.5%</strong></li>
          <li>✔ Preferred Staff Utilisation: <strong>82%</strong></li>
          <li>✔ Matching Staff Ratio: <strong>88%</strong></li>
        </ul>

        <h3>🚨 Missed Roster Alerts</h3>
        <p>
          A total of 7 missed roster tags were recorded (0.5% of scheduled shifts). Causes:
        </p>
        <ul>
          <li>• No-show without notice: 2 instances</li>
          <li>• Late cancellations (under 24h): 3 instances</li>
          <li>• Roster not acknowledged (system delay): 2 instances</li>
        </ul>

        <p>
          All missed events were flagged and notified to the care coordinator. The 85th minute window was fully met.
        </p>

        <h3>🛠 System & Operational Notes</h3>
        <ul>
          <li>• Auto-scheduling rules covered 83% of shifts.</li>
          <li>• Compliance checks met for First Aid, Police, and NDIS.</li>
          <li>• 2 flags: expired Manual Handling + long shift without break.</li>
        </ul>
      </div>
    </div>
  );
};

export default Report;
