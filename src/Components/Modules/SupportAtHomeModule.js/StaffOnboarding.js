import React, { useState } from "react";
import "../../../Styles/StaffOnboarding.css";

const StaffOnboarding = () => {
  const [expandedSections, setExpandedSections] = useState({
    "Understanding the Australian Aged Care & Disability Sector": true,
    "Person-Centred & Dignity-Focused Care": false,
    "Safe Work Practices & Manual Handling": false,
    "Communication & Professional Boundaries": false,
    "Medication Assistance & Health Monitoring": false,
    "Recognising & Responding to Abuse, Neglect & Deterioration": false,
    "Documentation, Reporting & Compliance": false,
  });

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const sections = [
    {
      name: "Understanding the Australian Aged Care & Disability Sector",
      lectures: 4,
      duration: "51m",
      progress: "25% finish (1/4)",
      items: [
        {
          id: 1,
          title: "Overview of the aged care system, NDIS, and My Aged Care",
          duration: "07:31",
          completed: true,
          active: false,
        },
        {
          id: 2,
          title: "Consumer-directed care principles",
          duration: "07:31",
          completed: false,
          active: true,
        },
        {
          id: 3,
          title: "Rights & responsibilities under the Aged Care Quality Standards",
          duration: "07:31",
          completed: false,
          active: false,
        },
        {
          id: 4,
          title: "Cultural safety & diversity in service delivery",
          duration: "07:31",
          completed: false,
          active: false,
        },
      ],
    },
    {
      name: "Person-Centred & Dignity-Focused Care",
      lectures: 52,
      duration: "5h 49m",
      progress: "",
      items: [],
    },
    {
      name: "Safe Work Practices & Manual Handling",
      lectures: 43,
      duration: "51m",
      progress: "",
      items: [],
    },
    {
      name: "Communication & Professional Boundaries",
      lectures: 137,
      duration: "10h 6m",
      progress: "",
      items: [],
    },
    {
      name: "Medication Assistance & Health Monitoring",
      lectures: 21,
      duration: "38m",
      progress: "",
      items: [],
    },
    {
      name: "Recognising & Responding to Abuse, Neglect & Deterioration",
      lectures: 39,
      duration: "1h 31m",
      progress: "",
      items: [],
    },
    {
      name: "Documentation, Reporting & Compliance",
      lectures: 7,
      duration: "1h 17m",
      progress: "",
      items: [],
    },
  ];

  return (
    <div className="staff-onboarding-page">
      <div className="staff-onboarding-container">
        {/* LEFT: Video Section */}
        <div className="video-section">
          <div className="video-player">
            <video
              className="video-thumbnail"
              controls
              width="100%"
              height="auto"
            >
              <source
                src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="video-title">
            <strong>2.</strong> Consumer-directed care principles
          </p>
        </div>

        {/* RIGHT: Course Contents */}
        <div className="course-contents">
          <div className="course-header">
            <h3>Course Contents</h3>
            <span className="progress-text">15% Completed</span>
          </div>

          {sections.map((section, index) => (
            <div
              key={index}
              className={`course-section ${
                expandedSections[section.name] ? "expanded" : ""
              }`}
            >
              <div
                className="section-title"
                onClick={() => toggleSection(section.name)}
              >
                <span className="section-name">{section.name}</span>
                <span className="section-progress">
                  {section.lectures} lectures · {section.duration}
                  {section.progress && ` · ${section.progress}`}
                </span>
              </div>

              {expandedSections[section.name] &&
                section.items.length > 0 && (
                  <div className="lectures-list">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`lecture ${
                          item.completed ? "completed" : ""
                        } ${item.active ? "active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          readOnly
                          className="lecture-checkbox"
                        />
                        <span className="lecture-title">
                          {item.id}. {item.title}
                        </span>
                        <span className="time">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffOnboarding;
