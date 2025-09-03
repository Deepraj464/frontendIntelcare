import React, { useState } from "react";
import "../../../Styles/StaffOnboarding.css";
import { FaRegEdit } from "react-icons/fa";
import { ReactSortable } from "react-sortablejs"; // ✅ new package
import { FaPencilAlt } from "react-icons/fa";
const StaffOnboarding = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedLecture, setSelectedLecture] = useState("2");
  const [lectureCompletionStatus, setLectureCompletionStatus] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [sections, setSections] = useState([
    {
      id: "s1",
      name: "Understanding the Australian Aged Care & Disability Sector",
      lectures: 4,
      duration: "51m",
      progress: "25% finish (1/4)",
      items: [
        { id: "1", title: "Overview of the aged care system, NDIS, and My Aged Care", duration: "07:31" },
        { id: "2", title: "Consumer-directed care principles", duration: "07:31" },
        { id: "3", title: "Rights & responsibilities under the Aged Care Quality Standards", duration: "07:31" },
        { id: "4", title: "Cultural safety & diversity in service delivery", duration: "07:31" },
      ],
    },
    {
      id: "s2",
      name: "Person-Centred & Dignity-Focused Care",
      lectures: 52,
      duration: "5h 49m",
      progress: "0% finish (0/52)",
      items: [
        { id: "5", title: "Understanding person-centred care principles", duration: "08:15" },
        { id: "6", title: "Respecting individual choices and preferences", duration: "06:42" },
        { id: "7", title: "Maintaining dignity in care delivery", duration: "09:30" },
        { id: "8", title: "Supporting independence and autonomy", duration: "07:18" },
      ],
    },
    {
      id: "s3",
      name: "Safe Work Practices & Manual Handling",
      lectures: 43,
      duration: "51m",
      progress: "0% finish (0/43)",
      items: [
        { id: "9", title: "Workplace health and safety fundamentals", duration: "12:30" },
        { id: "10", title: "Manual handling techniques and equipment", duration: "15:45" },
        { id: "11", title: "Risk assessment and hazard identification", duration: "10:20" },
      ],
    },
    {
      id: "s4",
      name: "Communication & Professional Boundaries",
      lectures: 137,
      duration: "10h 6m",
      progress: "0% finish (0/137)",
      items: [
        { id: "12", title: "Effective communication techniques", duration: "11:15" },
        { id: "13", title: "Professional boundaries and relationships", duration: "09:40" },
        { id: "14", title: "Conflict resolution strategies", duration: "13:25" },
      ],
    },
    {
      id: "s5",
      name: "Medication Assistance & Health Monitoring",
      lectures: 21,
      duration: "38m",
      progress: "0% finish (0/21)",
      items: [
        { id: "15", title: "Medication administration guidelines", duration: "14:20" },
        { id: "16", title: "Health monitoring and vital signs", duration: "12:10" },
        { id: "17", title: "Emergency response procedures", duration: "11:30" },
      ],
    },
    {
      id: "s6",
      name: "Recognising & Responding to Abuse, Neglect & Deterioration",
      lectures: 39,
      duration: "1h 31m",
      progress: "0% finish (0/39)",
      items: [
        { id: "18", title: "Identifying signs of abuse and neglect", duration: "16:45" },
        { id: "19", title: "Reporting procedures and documentation", duration: "13:20" },
        { id: "20", title: "Supporting clients through difficult situations", duration: "18:15" },
      ],
    },
    {
      id: "s7",
      name: "Documentation, Reporting & Compliance",
      lectures: 7,
      duration: "1h 17m",
      progress: "0% finish (0/7)",
      items: [
        { id: "21", title: "Documentation standards and requirements", duration: "19:30" },
        { id: "22", title: "Incident reporting procedures", duration: "15:25" },
        { id: "23", title: "Compliance monitoring and audits", duration: "22:15" },
      ],
    },
  ]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleLectureClick = (lectureId) => setSelectedLecture(lectureId);

  const toggleLectureCompletion = (lectureId, e) => {
    e.stopPropagation();
    setLectureCompletionStatus((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const isLectureCompleted = (lectureId) => lectureCompletionStatus[lectureId] || false;

  const getSelectedLectureTitle = () => {
    for (const section of sections) {
      const lecture = section.items.find((item) => item.id === selectedLecture);
      if (lecture) {
        return `${selectedLecture}. ${lecture.title}`;
      }
    }
    return "";
  };

  const handleSectionEdit = (index, newName) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index].name = newName;
      return updated;
    });
    setEditingSection(null);
  };

  const handleLectureEdit = (sectionIndex, itemIndex, newTitle) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[sectionIndex].items[itemIndex].title = newTitle;
      return updated;
    });
    setEditingLecture(null);
  };

  return (
    <div className="staff-onboarding-page">
      <div className="staff-onboarding-container">
        {/* LEFT: Video Section */}
        <div className="video-section">
          <div className="video-player">
            <video className="video-thumbnail" controls width="100%" height="auto">
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="progress-text">15% Completed</span>
              <span
                className="edit-icon"
                style={{ cursor: "pointer" }}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <FaRegEdit size={18} />
              </span>
            </div>
          </div>

          {/* ✅ Section Reordering */}
          <ReactSortable
            list={sections}
            setList={setSections}
            ghostClass="no-ghost"
            chosenClass="sortable-chosen"
            animation={200}
            disabled={!isEditMode}
             scroll={true}              // ✅ enable auto-scroll
  scrollSensitivity={80}     // ✅ how close to edge before scroll (px)
  scrollSpeed={15}   
          >
            {sections.map((section, index) => {
              const isExpanded = expandedSections[section.id];
              return (
                <div key={section.id} className={`course-section ${isExpanded ? "expanded" : ""}`}>
                  {/* Section title */}
                  <div
                    className="section-title"
                    onClick={() => !isEditMode && toggleSection(section.id)}
                  >
                    <div className="section-name">
                      <span className={`expand-icon ${isExpanded ? "rotated" : ""}`}>
                        ▶
                      </span>
                      {editingSection === index ? (
                        <input
                          type="text"
                          defaultValue={section.name}
                          autoFocus
                          onBlur={(e) => handleSectionEdit(index, e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSectionEdit(index, e.target.value)
                          }
                        />
                      ) : (
                        <>
                          <span>{section.name}</span>
                          <span
                            className="edit-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSection(index);
                            }}
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                          >
                             <FaPencilAlt size={16} color="#6c4cdc" />
                          </span>
                        </>
                      )}
                    </div>
                    <span className="section-progress">
                      {section.lectures} lectures · {section.duration}
                      {section.progress && ` · ${section.progress}`}
                    </span>
                  </div>

                  {/* ✅ Lecture Reordering */}
                  {isExpanded && (
                    <ReactSortable
                      list={section.items}
                      ghostClass="no-ghost"
                      chosenClass="sortable-chosen"
                      setList={(newList) =>
                        setSections((prev) =>
                          prev.map((s, i) =>
                            i === index ? { ...s, items: newList } : s
                          )
                        )
                      }
                      animation={200}
                      disabled={!isEditMode}
                       scroll={true}              // ✅ enable auto-scroll
  scrollSensitivity={80}     // ✅ how close to edge before scroll (px)
  scrollSpeed={15}   
                    >
                      {section.items.map((item, itemIndex) => {
                        const isActive = selectedLecture === item.id;
                        const isCompleted = isLectureCompleted(item.id);
                        const isLastItem = itemIndex === section.items.length - 1;

                        return (
                          <div
                            key={item.id}
                            className={`lecture ${isActive ? "active" : ""} ${isLastItem ? "last-item" : ""
                              }`}
                            onClick={() => handleLectureClick(item.id)}
                          >
                            <div className="lecture-content">
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={(e) => toggleLectureCompletion(item.id, e)}
                                className="lecture-checkbox"
                              />
                              {editingLecture?.id === item.id ? (
                                <input
                                  type="text"
                                  defaultValue={item.title}
                                  autoFocus
                                  onBlur={(e) =>
                                    handleLectureEdit(index, itemIndex, e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleLectureEdit(index, itemIndex, e.target.value)
                                  }
                                />
                              ) : (
                                <span
                                  className={`lecture-title ${isCompleted ? "completed" : ""
                                    }`}
                                >
                                  {item.id}. {item.title}
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column-reverse",
                                alignItems: "flex-end",
                                gap: "4px",
                              }}
                            >
                              <span className="time">{item.duration}</span>
                              {editingLecture?.id !== item.id && (
                                <span
                                  className="edit-icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLecture({ id: item.id });
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                   <FaPencilAlt size={16} color="#6c4cdc" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </ReactSortable>
                  )}
                </div>
              );
            })}
          </ReactSortable>
        </div>
      </div>
    </div>
  );
};

export default StaffOnboarding;
