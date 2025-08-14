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

  const [selectedLecture, setSelectedLecture] = useState(2);
  const [lectureCompletionStatus, setLectureCompletionStatus] = useState({});

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleLectureClick = (lectureId) => {
    setSelectedLecture(lectureId);
  };

  const toggleLectureCompletion = (lectureId, e) => {
    e.stopPropagation();
    setLectureCompletionStatus(prev => ({
      ...prev,
      [lectureId]: !prev[lectureId]
    }));
  };

  const isLectureCompleted = (lectureId) => {
    return lectureCompletionStatus[lectureId] || false;
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
        },
        {
          id: 2,
          title: "Consumer-directed care principles",
          duration: "07:31",
        },
        {
          id: 3,
          title: "Rights & responsibilities under the Aged Care Quality Standards",
          duration: "07:31",
        },
        {
          id: 4,
          title: "Cultural safety & diversity in service delivery",
          duration: "07:31",
        },
      ],
    },
    {
      name: "Person-Centred & Dignity-Focused Care",
      lectures: 52,
      duration: "5h 49m",
      progress: "0% finish (0/52)",
      items: [
        {
          id: 5,
          title: "Understanding person-centred care principles",
          duration: "08:15",
        },
        {
          id: 6,
          title: "Respecting individual choices and preferences",
          duration: "06:42",
        },
        {
          id: 7,
          title: "Maintaining dignity in care delivery",
          duration: "09:30",
        },
        {
          id: 8,
          title: "Supporting independence and autonomy",
          duration: "07:18",
        },
      ],
    },
    {
      name: "Safe Work Practices & Manual Handling",
      lectures: 43,
      duration: "51m",
      progress: "0% finish (0/43)",
      items: [
        {
          id: 9,
          title: "Workplace health and safety fundamentals",
          duration: "12:30",
        },
        {
          id: 10,
          title: "Manual handling techniques and equipment",
          duration: "15:45",
        },
        {
          id: 11,
          title: "Risk assessment and hazard identification",
          duration: "10:20",
        },
      ],
    },
    {
      name: "Communication & Professional Boundaries",
      lectures: 137,
      duration: "10h 6m",
      progress: "0% finish (0/137)",
      items: [
        {
          id: 12,
          title: "Effective communication techniques",
          duration: "11:15",
        },
        {
          id: 13,
          title: "Professional boundaries and relationships",
          duration: "09:40",
        },
        {
          id: 14,
          title: "Conflict resolution strategies",
          duration: "13:25",
        },
      ],
    },
    {
      name: "Medication Assistance & Health Monitoring",
      lectures: 21,
      duration: "38m",
      progress: "0% finish (0/21)",
      items: [
        {
          id: 15,
          title: "Medication administration guidelines",
          duration: "14:20",
        },
        {
          id: 16,
          title: "Health monitoring and vital signs",
          duration: "12:10",
        },
        {
          id: 17,
          title: "Emergency response procedures",
          duration: "11:30",
        },
      ],
    },
    {
      name: "Recognising & Responding to Abuse, Neglect & Deterioration",
      lectures: 39,
      duration: "1h 31m",
      progress: "0% finish (0/39)",
      items: [
        {
          id: 18,
          title: "Identifying signs of abuse and neglect",
          duration: "16:45",
        },
        {
          id: 19,
          title: "Reporting procedures and documentation",
          duration: "13:20",
        },
        {
          id: 20,
          title: "Supporting clients through difficult situations",
          duration: "18:15",
        },
      ],
    },
    {
      name: "Documentation, Reporting & Compliance",
      lectures: 7,
      duration: "1h 17m",
      progress: "0% finish (0/7)",
      items: [
        {
          id: 21,
          title: "Documentation standards and requirements",
          duration: "19:30",
        },
        {
          id: 22,
          title: "Incident reporting procedures",
          duration: "15:25",
        },
        {
          id: 23,
          title: "Compliance monitoring and audits",
          duration: "22:15",
        },
      ],
    },
  ];

  const getSelectedLectureTitle = () => {
    for (const section of sections) {
      const lecture = section.items.find(item => item.id === selectedLecture);
      if (lecture) {
        return `${selectedLecture}. ${lecture.title}`;
      }
    }
    return "2. Consumer-directed care principles";
  };

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
            <strong>{getSelectedLectureTitle()}</strong>
          </p>
        </div>

        {/* RIGHT: Course Contents */}
        <div className="course-contents">
          <div className="course-header">
            <h3>Course Contents</h3>
            <span className="progress-text">15% Completed</span>
          </div>

          {sections.map((section, index) => {
            const isExpanded = expandedSections[section.name];
            return (
              <div
                key={index}
                className={`course-section ${isExpanded ? "expanded" : ""}`}
              >
                <div
                  className="section-title"
                  onClick={() => toggleSection(section.name)}
                >
                  <div className="section-name">
                    <span className={`expand-icon ${isExpanded ? "rotated" : ""}`}>
                      ▶
                    </span>
                    <span>{section.name}</span>
                  </div>
                  <span className="section-progress">
                    {section.lectures} lectures · {section.duration}
                    {section.progress && ` · ${section.progress}`}
                  </span>
                </div>

                {isExpanded && section.items.length > 0 && (
                  <div className="lectures-list">
                    {section.items.map((item, itemIndex) => {
                      const isActive = selectedLecture === item.id;
                      const isCompleted = isLectureCompleted(item.id);
                      const isLastItem = itemIndex === section.items.length - 1;
                      
                      return (
                        <div
                          key={item.id}
                          className={`lecture ${isActive ? "active" : ""} ${isLastItem ? "last-item" : ""}`}
                          onClick={() => handleLectureClick(item.id)}
                        >
                          <div className="lecture-content">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={(e) => toggleLectureCompletion(item.id, e)}
                              className="lecture-checkbox"
                            />
                            <span className={`lecture-title ${isCompleted ? "completed" : ""}`}>
                              {item.id}. {item.title}
                            </span>
                          </div>
                          <span className="time">{item.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StaffOnboarding;
