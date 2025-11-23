import React, { useState, useRef, useMemo, useEffect } from "react";
import '../../../Styles/RosterHistory.css';
import { FiUser, FiMapPin, FiPhone } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { AiFillClockCircle } from "react-icons/ai";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


const RosterHistory = (props) => {
    const [selected, setSelected] = useState(null);
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [openPanel, setOpenPanel] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [open, setOpen] = useState(false);
    const messageEndRef = useRef(null);

    const scrollRef = useRef(null);

    const dummyClients = [
        { id: 1, name: "Fiona Lamond", address: "Building B Apartment, Solent, NSW, 2153", phone: "+61 407 272 103" },
        { id: 2, name: "Noah Williams", address: "88 George St, Brisbane, QLD, 4000", phone: "+61 422 678 900" },
        { id: 3, name: "Amelia Johnson", address: "19 Riverway, Melbourne, VIC, 3000", phone: "+61 499 784 112" },
        { id: 4, name: "Lucas Brown", address: "3 Beach Ave, Gold Coast, QLD, 4217", phone: "+61 433 980 556" },
        // { id: 5, name: "Charlotte Davis", address: "55 Market Rd, Perth, WA, 6000", phone: "+61 478 331 244" },
        // { id: 6, name: "Henry Miller", address: "22 Oakwood Dr, Adelaide, SA, 5000", phone: "+61 466 772 911" },
        // { id: 7, name: "Sophia Wilson", address: "10 Queen Way, Hobart, TAS, 7000", phone: "+61 457 993 221" },
        // { id: 8, name: "Jack Anderson", address: "2 Mountain Rd, Canberra, ACT, 2600", phone: "+61 413 884 002" },
        // { id: 9, name: "Mia Taylor", address: "45 Hillcrest, Darwin, NT, 0800", phone: "+61 499 661 770" },
        // { id: 10, name: "William Thompson", address: "98 Sunset Blvd, Adelaide, SA, 5000", phone: "+61 433 583 721" },
    ];

    const assignmentsData = [
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Oluchi ",
            time: "8:00AM - 10:00AM",
            status: "waiting"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Natalie john",
            time: "8:00AM - 10:00AM",
            status: "accepted"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Alex",
            time: "10:00AM - 1:00PM",
            status: "rejected"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Alex Johnson",
            time: "1:00PM - 3:00PM",
            status: "waiting"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Jacob Marks",
            time: "3:00PM - 5:00PM",
            status: "accepted"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Emily Roberts",
            time: "5:00PM - 7:00PM",
            status: "accepted"
        },
        {
            clientId: 1,
            date: "2025-11-26",
            carer: "Chris Evans",
            time: "6:00PM - 8:00PM",
            status: "rejected"
        },

        {
            clientId: 2,
            date: "2025-11-20",
            carer: "John Smith 2",
            time: "7:00AM - 9:00AM",
            status: "accepted"
        }
    ];
    const staffInfoList = [
        { label: "Score", value: 98 },
        { label: "Gender", value: "Male" },
        { label: "Email", value: "ounchk@gmail.com" },
        { label: "Languages", value: "English, Spanish, Hindi" },
        { label: "Experience", value: "12+" },
        { label: "Award", value: "Social, Community" },
        { label: "Location", value: "Kiwong Street, Yowie Bay, NSW, 2228" },
        {
            label: "Why",
            value: {
                title: "Why this staff?",
                description:
                    "Top skills match with client preferred skills, strong skill set including Aspiration Management, Complex Bowel Care, Enteral Feeding, Seizure Management, Urinary Catheter Changing, Ventilator Management, Hoist transfers, Client Specific Training, Maintenance of Skin Integrity, and proximity likely within 10km (Yowie Bay, NSW). Preferred worker."
            }
        }
    ];

    const messages = [
        { id: 1, text: "Hello", time: "9:30 AM", sender: "other" },
        { id: 2, text: "Are you coming?", time: "9:32 AM", sender: "me" },
        { id: 3, text: "I will be there in 10 mins.", time: "9:33 AM", sender: "other" },
        { id: 4, text: "Okay, waiting!", time: "9:34 AM", sender: "me" },
        { id: 5, text: "Traffic is heavy today.", time: "9:36 AM", sender: "other" },
        { id: 6, text: "No problem", time: "9:37 AM", sender: "me" },
        { id: 7, text: "Almost reached", time: "9:40 AM", sender: "other" },
        { id: 8, text: "Traffic is heavy today.", time: "9:36 AM", sender: "other" },
        { id: 9, text: "No problem", time: "9:37 AM", sender: "me" },
        { id: 10, text: "Almost reached", time: "9:40 AM", sender: "other" },
        { id: 11, text: "Traffic is heavy today.", time: "9:36 AM", sender: "other" },
        { id: 12, text: "No problem", time: "9:37 AM", sender: "me" },
        { id: 13, text: "Almost reached", time: "9:40 AM", sender: "other" }
    ];



    const days = useMemo(() => {
        const daysInMonth = new Date(year, month, 0).getDate();

        return Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const assignments = assignmentsData.filter(
                (a) => a.clientId === selected?.id && a.date === dateStr
            );

            return {
                dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                    new Date(year, month - 1, day).getDay()
                ],
                date: day,
                assignments
            };
        });
    }, [selected, month, year]);

    // 👉 Auto scroll to today's date by default
    useEffect(() => {
        const today = new Date();
        const todayIndex = days.findIndex(
            d =>
                d.date === today.getDate() &&
                month === today.getMonth() + 1 &&
                year === today.getFullYear()
        );

        if (todayIndex !== -1 && scrollRef.current) {
            const scrollAmount = todayIndex * 130; // approx column width
            scrollRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    }, [days]);



    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });

    const handleMonthChange = (e) => {
        const [y, m] = e.target.value.split("-");
        setYear(Number(y));
        setMonth(Number(m));
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedAssignment]);

    return (
        <div className="rostering-history-container">

            <div className="roster-back-btn" onClick={() => props.setScreen(1)} style={{ left: '30px', top: '-45px' }}>
                <GoArrowLeft size={22} color="#6C4CDC" />
                <span>Back</span>
            </div>

            <div className="rostering-history-sidebar">
                <div style={{ borderBottom: '1px solid #E2E8F1', padding: '18px' }}>
                    <div className="rostering-history-title">Client History</div>
                    <div className="rostering-history-subtitle">{dummyClients.length} Active Clients</div>
                </div>

                <div className="rostering-client-list">
                    {dummyClients.map((c) => (
                        <div
                            key={c.id}
                            className={`rostering-client-card ${selected?.id === c.id ? "rostering-active-client" : ""}`}
                            onClick={() => setSelected(c)}
                        >
                            <div style={{ backgroundColor: '#F7FAFF', height: '34px', width: '34px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FiUser size={22} color='#6c4cdc' />
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", gap: '8px', marginTop: '6px' }}>
                                <div className="rostering-client-name">{c.name}</div>
                                <div className="rostering-client-info"><FiMapPin /> {c.address}</div>
                                <div className="rostering-client-info"><FiPhone /> {c.phone}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rostering-history-details-panel">
                {!selected ? (
                    <div className="rostering-empty-details">
                        <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#E2E8F1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-140px', marginBottom: '20px' }}>
                            <FiUser size={110} color="#90A2B9" />
                        </div>
                        <p>Select a client to view staff details</p>
                    </div>
                ) : (
                    <div className="roster-calendar-container">

                        <div className="roster-calendar-header">
                            <h2 className="rostering-detail-title" >{selected.name}</h2>

                            <div style={{ display: "flex", alignItems: "center", gap: "15px", justifyContent: 'space-between' }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "15px", }}>
                                    <FaAngleLeft color="#6c4cdc" onClick={() => (scrollRef.current.scrollLeft -= 350)} style={{ cursor: 'pointer' }} />
                                    <span style={{ fontWeight: 600 }}>{monthName} {year}</span>
                                    <FaAngleRight color="#6c4cdc" onClick={() => (scrollRef.current.scrollLeft += 350)} style={{ cursor: 'pointer' }} />
                                </div>
                                <input
                                    type="month"
                                    value={`${year}-${String(month).padStart(2, "0")}`}
                                    onChange={handleMonthChange}
                                />
                            </div>
                        </div>

                        <div ref={scrollRef} className="roster-days-scroll">
                            {days.map((d, idx) => {
                                const isToday =
                                    d.date === new Date().getDate() &&
                                    month === new Date().getMonth() + 1 &&
                                    year === new Date().getFullYear();

                                return (
                                    <div
                                        key={idx}
                                        className="roster-day-column"
                                        style={{ backgroundColor: isToday ? "#F8FAFB" : "transparent", borderRadius: "8px" }}
                                    >
                                        <div style={{ backgroundColor: "#F8FAFB", padding: "20px 10px", textAlign: "center", }}>
                                            <div style={{ fontWeight: 500, fontSize: 10, color: isToday ? "#6c4cdc" : "#62748E", marginBottom: 2 }}>
                                                {d.dayName}
                                            </div>

                                            <div style={{ fontSize: 16, marginBottom: 10, color: isToday ? "#6c4cdc" : "inherit" }}>
                                                {d.date}
                                            </div>

                                            <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 2, marginTop: 6, color: isToday ? "#6c4cdc" : "#62748E" }}>
                                                {d.assignments.length} Staff
                                            </div>
                                        </div>

                                        <div style={{ padding: "10px", paddingTop: '0px', height: '70vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                                            {d.assignments.length === 0 ? (
                                                <div style={{ fontSize: 12, marginTop: 30, color: "#9CA3AF" }}>No Assignments</div>
                                            ) : (
                                                d.assignments.map((a, i) => (
                                                    <div key={i} className={`roster-status-card status-${a.status}`}
                                                        onClick={() => {
                                                            setSelectedAssignment({
                                                                ...a,
                                                                dayName: d.dayName,
                                                                day: d.date,
                                                                monthName: monthName,
                                                            });
                                                            setOpenPanel(true);
                                                        }}>
                                                        <div style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Inter', marginBottom: '8px', textAlign: 'left' }}>{a.carer}</div>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                                                            <AiFillClockCircle color="white" />
                                                            <div style={{ fontSize: '14px', textAlign: 'left' }}>{a.time}</div>
                                                        </div>
                                                        <div style={{ fontSize: '12px', marginTop: '10px', borderRadius: '70px', padding: '4px 10px', }} className={`text-${a.status}`}>{a.status}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                        {openPanel && selectedAssignment && (
                            <div className="side-panel-overlay" onClick={() => setOpenPanel(false)}>
                                <div className="side-panel" onClick={(e) => e.stopPropagation()}>

                                    {/* ===== Header ===== */}
                                    <div className={`side-header status-${selectedAssignment.status}`}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                                                <LuBriefcaseBusiness size={22} color="white" />
                                                <div style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>Staff Details</div>
                                            </div>
                                            <button className="close-x" onClick={() => setOpenPanel(false)}>✕</button>
                                        </div>
                                        <div className="panel-top-block">
                                            <h3 className="panel-staff-name">{selectedAssignment.carer}</h3>

                                            <div className={`status-chip chip-${selectedAssignment.status}`}>
                                                {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment.status.slice(1)}
                                            </div>
                                            <div style={{ textAlign: 'left', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', color: 'white', marginTop: '6px', marginBottom: '8px' }}>
                                                {selectedAssignment.dayName}, {selectedAssignment.day} {selectedAssignment.monthName}
                                            </div>
                                            <div className="panel-date-time">
                                                <AiFillClockCircle size={12} />
                                                <span>
                                                    {selectedAssignment.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ===== Staff Basic Info ===== */}

                                    {/* Divider */}
                                    <div style={{ borderBottom: '1px solid #ede8f1', padding: '16px 12px', backgroundColor: '#F8FAFB', }}>
                                        {selectedAssignment.status === "waiting" ? (
                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                                <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', cursor: 'pointer', background: '#E63946', color: '#fff' }}>Reject</button>
                                                <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', cursor: 'pointer', background: '#4CAF50', color: '#fff' }}>Accept</button>
                                            </div>
                                        ) : selectedAssignment.status === "accepted" ? (
                                            <span style={{ color: '#4CAF50', fontWeight: 600, textAlign: 'center' }}>Staff accepted for this assignment</span>
                                        ) : (
                                            <span style={{ color: '#E63946', fontWeight: 600, textAlign: 'center' }}>Staff rejected for this assignment</span>
                                        )}
                                    </div>


                                    {/* ===== WHY STAFF BLOCK ===== */}
                                    <div style={{ padding: '14px' }}>
                                        <div
                                            style={{ fontSize: '16px', fontWeight: '500', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', cursor: 'pointer' }}
                                            onClick={() => setOpen(!open)}
                                        >
                                            Staff Information
                                            {open
                                                ? <FaChevronUp color="#6c4cdc" size={14} />
                                                : <FaChevronDown color="#6c4cdc" size={14} />
                                            }
                                        </div>

                                        {open && staffInfoList.map((item, i) => (
                                            item.label === "Why" ? (
                                                <div key={i} style={{ marginTop: 14, background: "#F5F3FF", padding: "12px 14px", borderRadius: 8 }}>
                                                    <h4 style={{ color: "#5A33FF", fontWeight: 700, marginBottom: 6, textAlign: 'left' }}>{item.value.title}</h4>
                                                    <p style={{ fontSize: 13, lineHeight: "20px", color: "#333", textAlign: 'justify' }}>{item.value.description}</p>
                                                </div>
                                            ) : (
                                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '50% 50%', marginBottom: '8px' }}>
                                                    <span style={{ fontWeight: '600', color: "#45556C", fontSize: '14px', fontFamily: 'Inter', textAlign: 'left' }}>{item.label}</span>
                                                    <span style={{ fontWeight: '500', fontSize: '14px', fontFamily: 'Inter', textAlign: 'left' }}>{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>


                                    {/* ===== CHAT SECTION ===== */}
                                    <div style={{ fontSize: '16px', fontWeight: '500', fontFamily: 'Inter', textAlign: 'left', margin: '8px 14px' }}>Messages</div>
                                    <div className="messages-section">
                                        {messages.map((m) => (
                                            <div key={m.id} className={`msg ${m.sender === "me" ? "you" : ""}`}>
                                                <div className={`msg-bubble ${m.sender === "me" ? "right" : "left"}`}>
                                                    {m.text}
                                                </div>
                                                <div className={`msg-time ${m.sender === "me" ? "rightss" : "leftss"}`}>
                                                    {m.time}
                                                </div>
                                            </div>
                                        ))}

                                        <div ref={messageEndRef}></div>
                                    </div>


                                    {/* input */}
                                    {selectedAssignment.status !== "rejected" &&
                                        <div className="msg-input-container">
                                            <input placeholder="Message..." className="msg-input" />
                                            <button className="send-btn">➤</button>
                                        </div>
                                    }

                                    {/* If rejected show footer message */}
                                    {selectedAssignment.status === "rejected" && (
                                        <div className="closed-footer">Conversation marked closed</div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default RosterHistory;
