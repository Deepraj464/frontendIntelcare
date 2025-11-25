import React, { useState } from "react";

const JsonTableCard = ({ title, summaryTable, detailsTable }) => {
  const [openGroups, setOpenGroups] = useState({});

  // Proper summary formatting by column order
  const summary = summaryTable?.columns && summaryTable?.rows
    ? [
        summaryTable.columns,
        ...summaryTable.rows.map(row =>
          summaryTable.columns.map(col => row[col])
        )
      ]
    : summaryTable;

  // Details table
  const details = detailsTable?.columns && detailsTable?.rows
    ? {
        headers: detailsTable.columns,
        rows: detailsTable.rows
      }
    : { headers: [], rows: [] };

  if (!summary?.length) {
    return (
      <div className="client-profitabilty-graph-each">
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="client-profitabilty-graph-each">
      <h3 style={{ marginBottom: 16 }}>{title}</h3>

      <div style={{ maxHeight: 600, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 8,width:"100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>

          {/* HEADER */}
          <thead style={{ position: "sticky", top: 0, background: "#f8fafc", zIndex: 10 ,width:"100%"}}>
            <tr>
              <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb" }}></th>
              {summary[0].map((col, idx) => (
                <th key={idx} style={{ padding: 12, borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {summary.slice(1).map((parentRow, idx) => {
              const expanded = openGroups[idx];

              // Reference column matching
              const refIndex = summary[0].indexOf("NDIS Reference");
              const parentRef = parentRow[refIndex];

              const childRows = details.rows.filter(
                (child) => child["NDIS Reference"]?.toString() === parentRef?.toString()
              );

              const hasChildren = childRows.length > 0;

              return (
                <React.Fragment key={idx}>
                  {/* Parent */}
                  <tr style={{ borderBottom: "1px solid #e5e7eb",width:"100%" }}>
                    <td style={{ textAlign: "left", padding: "12px" }}>
                      {hasChildren && (
                        <button
                          onClick={() => setOpenGroups((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                          style={{ border: "none", background: "transparent", fontSize: 16, cursor: "pointer" }}
                        >
                          {expanded ? "−" : "+"}
                        </button>
                      )}
                    </td>
                    {parentRow.map((cell, cidx) => (
                      <td key={cidx} style={{textAlign:"left", padding: "12px" }}>{cell}</td>
                    ))}
                  </tr>

                  {/* Children */}
                  {expanded && hasChildren && (
                    <>
                      <tr style={{ backgroundColor: "#edf2f7" }}>
                        <td></td>
                        {details.headers.map((head, hidx) => (
                          <td key={hidx} style={{ textAlign:"left", padding: 12, fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>
                            {head}
                          </td>
                        ))}
                      </tr>

                      {childRows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ textAlign:"left", backgroundColor: "#fafafa" }}>
                          <td></td>
                          {details.headers.map((colName, colIdx) => (
                            <td key={colIdx} style={{ padding: 12 }}>
                              {row[colName] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JsonTableCard;