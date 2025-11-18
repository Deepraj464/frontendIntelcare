import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { PiPlusCircleFill, PiMinusCircleFill } from "react-icons/pi";

export default function ClientProfitabilityAIAnalysisReportViewer({ reportText, loading }) {
    const [isOpen, setIsOpen] = useState(true);

    if (loading) {
        return (
            <div>
                Generating AI insights...
            </div>
        );
    }


    if (!reportText) {
        return (
            <div className="text-gray-500 text-center py-6 font-inter">
                Click “AI Analysis” to generate the report.
            </div>
        );
    }

    return (
        <div
            className="rounded-2xl shadow-md"
            style={{
                background: "#f4f1ff",
                padding: "22px 26px",
                marginBottom: "30px",
                border: "1px solid #d7cffc",
                transition: "0.3s ease",
            }}
        >
            {/* Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    marginBottom: "12px",
                }}
            >
                <h2
                    style={{
                        fontFamily: "Inter",
                        fontWeight: "700",
                        fontSize: "22px",
                        color: "#6c4cdc",
                        margin: "auto",
                    }}
                >
                    AI Analysis Report
                </h2>
                {isOpen ? (
                    <PiMinusCircleFill size={24} color="#6c4cdc" />
                ) : (
                    <PiPlusCircleFill size={24} color="#6c4cdc" />
                )}
            </div>

            {/* Markdown Section */}
            {isOpen && (
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        color: "#1f1f1f",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        lineHeight: "1.8",
                        boxShadow: "inset 0 0 0 1px #eee",
                        textAlign: "justify"
                    }}
                    className="ai-markdown-body"
                >
                    <ReactMarkdown
                        children={reportText.replace(/```(?:markdown)?|```/g, "")}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                        components={{
                            h2: ({ node, ...props }) => (
                                <h2
                                    style={{
                                        color: "#6c4cdc",
                                        fontSize: "19px",
                                        fontWeight: 700,
                                        marginTop: "28px",
                                        marginBottom: "10px",
                                        borderBottom: "2px solid #dcd3ff",
                                        paddingBottom: "4px",
                                        textTransform: "capitalize",
                                    }}
                                    {...props}
                                />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3
                                    style={{
                                        color: "#5b47d9",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        marginTop: "18px",
                                        marginBottom: "8px",
                                    }}
                                    {...props}
                                />
                            ),
                            p: ({ node, ...props }) => (
                                <p
                                    style={{
                                        marginBottom: "10px",
                                        color: "#2d2d2d",
                                        fontWeight: "400",
                                    }}
                                    {...props}
                                />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong
                                    style={{
                                        color: "#1f1660",
                                        fontWeight: 600,
                                    }}
                                    {...props}
                                />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul
                                    style={{
                                        paddingLeft: "20px",
                                        marginBottom: "10px",
                                        listStyleType: "disc",
                                    }}
                                    {...props}
                                />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol
                                    style={{
                                        paddingLeft: "22px",
                                        marginBottom: "12px",
                                        listStyleType: "decimal",
                                    }}
                                    {...props}
                                />
                            ),
                            li: ({ node, ...props }) => (
                                <li
                                    style={{
                                        marginBottom: "5px",
                                        paddingLeft: "4px",
                                    }}
                                    {...props}
                                />
                            ),
                            table: ({ node, ...props }) => (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginTop: "12px",
                                        marginBottom: "18px",
                                        fontSize: "14px",
                                    }}
                                    {...props}
                                />
                            ),
                            th: ({ node, ...props }) => (
                                <th
                                    style={{
                                        background: "#ece9ff",
                                        border: "1px solid #d7cffc",
                                        padding: "8px",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#3a2fc2",
                                    }}
                                    {...props}
                                />
                            ),
                            td: ({ node, ...props }) => (
                                <td
                                    style={{
                                        border: "1px solid #e5defc",
                                        padding: "8px",
                                        color: "#333",
                                    }}
                                    {...props}
                                />
                            ),
                        }}
                    />
                </div>
            )}
        </div>
    );
}
