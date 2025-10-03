import React, { useState } from "react";
import "../../../Styles/AdminCourseCreation.css";

const AdminCourseCreation = () => {
  const [modules, setModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [newModuleName, setNewModuleName] = useState("");

  // derive activeModule & activeLesson from IDs
  const activeModule = modules.find((m) => m.id === activeModuleId) || null;
  const activeLesson =
    activeModule?.lessons.find((l) => l.id === activeLessonId) || null;

  const addModule = () => {
    if (!newModuleName.trim()) return;
    const newModule = {
      id: Date.now(),
      title: newModuleName,
      lessons: [],
    };
    setModules([...modules, newModule]);
    setNewModuleName("");
  };

  const addLesson = (moduleId) => {
    const updatedModules = modules.map((m) => {
      if (m.id === moduleId) {
        const newLesson = {
          id: Date.now(),
          title: "",
          type: "video",
          file: null,
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });
    setModules(updatedModules);
  };

  const updateLesson = (moduleId, lessonId, updatedLesson) => {
    const updatedModules = modules.map((m) => {
      if (m.id === moduleId) {
        const lessons = m.lessons.map((l) =>
          l.id === lessonId ? { ...l, ...updatedLesson } : l
        );
        return { ...m, lessons };
      }
      return m;
    });
    setModules(updatedModules);
  };

  return (
    <div className="course-builder">
      {/* Sidebar */}
      <div className="course-sidebar">
        <div className="courses-title">Course Builder</div>
        <div className="module-input">
        <div className="module-list">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`module-item ${
                activeModuleId === m.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveModuleId(m.id);
                setActiveLessonId(null);
              }}
            >
              {m.title}
            </div>
          ))}
        </div>
          <input
            type="text"
            placeholder="Enter module name..."
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
          />
          <button onClick={addModule} className="add-module-btn">
            + Add Module
          </button>
        </div>
      </div>

      {/* Middle Panel */}
      <div className="course-lessons">
        {activeModule ? (
          <>
            <div className="courses-title">{activeModule.title}</div>
            <div className="lesson-list">
              {activeModule.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${
                    activeLessonId === lesson.id ? "active" : ""
                  }`}
                  onClick={() => setActiveLessonId(lesson.id)}
                >
                  <span className="lesson-icon">
                    {lesson.type === "video" ? "🎬" : "📄"}
                  </span>
                  {lesson.title || "Untitled Lesson"}
                </div>
              ))}

              <div
                className="add-lesson-card"
                onClick={() => addLesson(activeModule.id)}
              >
                + Add Lesson
              </div>
            </div>
          </>
        ) : (
          <p className="empty-message">Module Title</p>
        )}
      </div>

      {/* Right Panel */}
      <div className="course-edit-panel">
        {activeLesson ? (
          <>
            <div className="courses-title">Edit Lesson</div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={activeLesson.title}
                onChange={(e) =>
                  updateLesson(activeModule.id, activeLesson.id, {
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  className={activeLesson.type === "video" ? "active" : ""}
                  onClick={() =>
                    updateLesson(activeModule.id, activeLesson.id, {
                      type: "video",
                    })
                  }
                >
                  Video
                </button>
                <button
                  className={activeLesson.type === "document" ? "active" : ""}
                  onClick={() =>
                    updateLesson(activeModule.id, activeLesson.id, {
                      type: "document",
                    })
                  }
                >
                  Document
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Upload</label>
              <input
                type="file"
                onChange={(e) =>
                  updateLesson(activeModule.id, activeLesson.id, {
                    file: e.target.files[0],
                  })
                }
              />
              {activeLesson.file && (
                <p className="file-name">{activeLesson.file.name}</p>
              )}
            </div>

            <button className="save-btn">Save and Preview</button>
          </>
        ) : (
          <p className="empty-message">Edit Lesson</p>
        )}
      </div>
    </div>
  );
};

export default AdminCourseCreation;
