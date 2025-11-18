import React, { useState, useMemo } from "react";
import Select from "react-select";

const JsonTableCard = (props) => {
    const { title, data, isSummaryDetailMode, availableRegions = [], availableDepartments = [] } = props;

    const [filters, setFilters] = useState({
        region: "",
        department: "",
        participant: "",
        search: "",
    });

    const [openGroups, setOpenGroups] = useState({});

    const hasValidData = data && Array.isArray(data.columns) && Array.isArray(data.rows);
    const columns = hasValidData ? data.columns : [];
    const rows = hasValidData ? data.rows : [];

    // Find columns with better matching
    const findCol = (keywords) => {
        if (!columns || !Array.isArray(columns)) return null;
        return columns.find((c) => {
            if (!c) return false;
            const colName = c.toString().toLowerCase();
            return keywords.some((kw) => colName.includes(kw.toLowerCase()));
        });
    };

    const regionCol = findCol(["region"]);
    const departmentCol = findCol(["department", "dept"]);
    const participantCol = findCol(["participant"]);
    const ndisCol = findCol(["ndis", "nois", "reference"]);

    const hasRegion = !!regionCol;
    const hasDepartment = !!departmentCol;
    const hasParticipant = !!participantCol;
    const hasNdis = !!ndisCol;

    const compactSelect = {
        control: (base) => ({
            ...base,
            minHeight: "32px",
            height: "32px",
            fontSize: "13px",
            borderRadius: "6px",
        }),
        menu: (base) => ({ ...base, zIndex: 9999 }),
        option: (base) => ({ ...base, fontSize: "13px" }),
        singleValue: (base) => ({ ...base, fontSize: "13px" }),
    };

    // Build options function for both modes
    const buildOptions = (exists, col) => {
        if (!exists || !col) return [];
        const unique = new Set();

        if (isSummaryDetailMode) {
            // For summary-detail mode (Direct Services)
            rows.forEach((row) => {
                if (row.parent && row.parent[columns.indexOf(col)] !== undefined) {
                    unique.add(String(row.parent[columns.indexOf(col)] || ""));
                }
            });
        } else {
            // For normal mode (Plan Managed)
            rows.forEach((row) => {
                if (row[col] !== undefined) {
                    unique.add(String(row[col] || ""));
                }
            });
        }

        return [
            { label: "All", value: "" },
            ...[...unique].filter(v => v).map((v) => ({ label: v, value: v })),
        ];
    };

    // Use available regions and departments if provided, otherwise build from data
    const regionOptions = useMemo(() => {
        if (availableRegions && availableRegions.length > 0) {
            return [
                { label: "All", value: "" },
                ...availableRegions.map(region => ({ label: region, value: region }))
            ];
        }
        return buildOptions(hasRegion, regionCol);
    }, [availableRegions, hasRegion, regionCol, rows, columns, isSummaryDetailMode]);

    const departmentOptions = useMemo(() => {
        if (availableDepartments && availableDepartments.length > 0) {
            return [
                { label: "All", value: "" },
                ...availableDepartments.map(dept => ({ label: dept, value: dept }))
            ];
        }
        return buildOptions(hasDepartment, departmentCol);
    }, [availableDepartments, hasDepartment, departmentCol, rows, columns, isSummaryDetailMode]);

    const participantOptions = useMemo(() => buildOptions(hasParticipant, participantCol), [rows, columns, isSummaryDetailMode]);

    // Filter rows based on selections - FIXED LOGIC
    const filteredRows = useMemo(() => {
        if (isSummaryDetailMode) {
            // For Direct Services (summary-detail mode) - FIXED
            return rows.filter((row) => {
                if (!row.parent) return false;

                const parentRow = row.parent;
                const children = row.children || [];

                let matchesRegion = true;
                let matchesDepartment = true;

                // Region filter - check if ANY child matches the region filter
                if (filters.region) {
                    matchesRegion = children.some(child => {
                        // Find region column index in detail columns
                        const regionColIndex = data.detailCols?.findIndex(col =>
                            col.toString().toLowerCase().includes('region')
                        );
                        return regionColIndex >= 0 && String(child[regionColIndex] || "") === filters.region;
                    });
                }

                // Department filter - check if ANY child matches the department filter  
                if (filters.department) {
                    matchesDepartment = children.some(child => {
                        // Find department column index in detail columns
                        const deptColIndex = data.detailCols?.findIndex(col =>
                            col.toString().toLowerCase().includes('department')
                        );
                        return deptColIndex >= 0 && String(child[deptColIndex] || "") === filters.department;
                    });
                }

                // Participant filter
                if (hasParticipant && filters.participant) {
                    const participantColIndex = columns.findIndex(col =>
                        col.toString().toLowerCase().includes('participant')
                    );
                    if (participantColIndex >= 0 && String(parentRow[participantColIndex] || "") !== filters.participant) {
                        return false;
                    }
                }

                // Search filter
                if (filters.search) {
                    const searchText = filters.search.toLowerCase();
                    const rowText = parentRow.join(" ").toLowerCase();
                    if (!rowText.includes(searchText)) return false;
                }


                return matchesRegion && matchesDepartment;
            });
        } else {
            // For Plan Managed (normal mode) - SAME AS BEFORE
            return rows.filter((row) => {
                if (hasRegion && filters.region && String(row[regionCol] || "") !== filters.region)
                    return false;
                if (hasDepartment && filters.department && String(row[departmentCol] || "") !== filters.department)
                    return false;
                if (hasParticipant && filters.participant && String(row[participantCol] || "") !== filters.participant)
                    return false;

                if (filters.search) {
                    const searchText = filters.search.toLowerCase();
                    const rowText = JSON.stringify(row).toLowerCase();
                    if (!rowText.includes(searchText)) return false;
                }

                return true;
            });
        }
    }, [rows, filters, isSummaryDetailMode, columns, regionCol, departmentCol, participantCol, hasRegion, hasDepartment, hasParticipant, data]);

    // Render cell for normal mode
    const renderCell = (row, col) => {
        const v = row[col];
        if (v == null) return "";
        return typeof v === "object" ? JSON.stringify(v) : String(v);
    };

    if (!hasValidData)
        return (
            <div className="client-profitabilty-graph-each">
                <h3>{title}</h3>
                <p>No data available</p>
            </div>
        );

    return (
        <div className="client-profitabilty-graph-each">
            <h3 style={{ marginBottom: 16 }}>{title}</h3>

            {/* FILTERS */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
                {/* REGION FILTER */}
                {(hasRegion || availableRegions.length > 0) && (
                    <div style={{ minWidth: "150px" }}>
                        <Select
                            options={regionOptions}
                            styles={compactSelect}
                            placeholder="Region"
                            value={regionOptions.find((o) => o.value === filters.region)}
                            onChange={(v) => setFilters((p) => ({ ...p, region: v?.value || "" }))}
                            isClearable
                        />
                    </div>
                )}

                {/* DEPARTMENT FILTER */}
                {(hasDepartment || availableDepartments.length > 0) && (
                    <div style={{ minWidth: "150px" }}>
                        <Select
                            options={departmentOptions}
                            styles={compactSelect}
                            placeholder="Department"
                            value={departmentOptions.find((o) => o.value === filters.department)}
                            onChange={(v) => setFilters((p) => ({ ...p, department: v?.value || "" }))}
                            isClearable
                        />
                    </div>
                )}

                {hasParticipant && (
                    <div style={{ minWidth: "150px" }}>
                        <Select
                            options={participantOptions}
                            styles={compactSelect}
                            placeholder="Participant"
                            value={participantOptions.find((o) => o.value === filters.participant)}
                            onChange={(v) => setFilters((p) => ({ ...p, participant: v?.value || "" }))}
                            isClearable
                        />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search NDIS Reference..."
                    style={{
                        height: 32,
                        padding: "0 10px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        minWidth: "200px"
                    }}
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                />
            </div>

            {/* Debug info */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                Active Filters: Region: "{filters.region}", Department: "{filters.department}", Showing {filteredRows.length} rows
            </div>

            {/* TABLE */}
            <div style={{ maxHeight: 600, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                <table className="json-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 10 }}>
                        <tr>
                            {isSummaryDetailMode && (
                                <th style={{ width: "50px", padding: "12px", borderBottom: "2px solid #e5e7eb" }}></th>
                            )}
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    style={{
                                        padding: "12px",
                                        borderBottom: "2px solid #e5e7eb",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        backgroundColor: "#f8fafc"
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* DIRECT SERVICES - EXPANDABLE MODE */}
                        {isSummaryDetailMode && filteredRows.map((group, idx) => {
                            const parent = group.parent || [];
                            const children = group.children || [];
                            const expanded = openGroups[idx];
                            const hasMultipleChildren = children.length > 1;

                            const hasSingleChild = children.length === 1;
                            const showAsExpandable = hasMultipleChildren;

                            return (
                                <React.Fragment key={idx}>
                                    {/* PARENT ROW */}
                                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        <td style={{ padding: "12px", textAlign: "center" }}>
                                            {showAsExpandable && (
                                                <button
                                                    onClick={() =>
                                                        setOpenGroups((prev) => ({
                                                            ...prev,
                                                            [idx]: !prev[idx]
                                                        }))
                                                    }
                                                    style={{
                                                        border: "none",
                                                        background: "transparent",
                                                        fontSize: "16px",
                                                        cursor: "pointer",
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: expanded ? "#6c4cdc" : "#f1f5f9",
                                                        color: expanded ? "white" : "#64748b"
                                                    }}
                                                >
                                                    {expanded ? "−" : "+"}
                                                </button>
                                            )}
                                            {hasSingleChild && <div style={{ width: "24px", height: "24px" }}></div>}
                                        </td>
                                        {columns.map((col, cidx) => (
                                            <td
                                                key={cidx}
                                                style={{
                                                    padding: "12px",
                                                    fontWeight: (hasMultipleChildren || hasSingleChild) ? 600 : 400,
                                                    backgroundColor: (hasMultipleChildren || hasSingleChild) ? "#f8fafc" : "transparent",
                                                    borderBottom: (expanded || hasSingleChild) ? "none" : "1px solid #e5e7eb"
                                                }}
                                            >
                                                {parent[cidx]}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* CHILD ROWS - Multiple children (expandable) */}
                                    {/* CHILD ROWS - MULTIPLE CHILDREN */}
                                    {showAsExpandable && expanded && children.map((child, cidx) => {
                                        return (
                                            <tr key={cidx} style={{ backgroundColor: "#fafafa" }}>
                                                <td style={{ padding: "12px" }}></td>

                                                {columns.map((colName, colIndex) => {
                                                    const matchIndex = data.detailCols.findIndex(
                                                        d => d.toString().toLowerCase() === colName.toLowerCase()
                                                    );

                                                    const value = matchIndex >= 0 ? child[matchIndex] : "";

                                                    return (
                                                        <td key={colIndex}
                                                            style={{
                                                                padding: "12px",
                                                                borderBottom: cidx === children.length - 1
                                                                    ? "1px solid #e5e7eb"
                                                                    : "1px solid #f1f5f9"
                                                            }}
                                                        >
                                                            {value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}

                                    {/* CHILD ROWS - SINGLE CHILD */}
                                    {hasSingleChild && children.map((child, cidx) => {
                                        return (
                                            <tr key={cidx} style={{ backgroundColor: "#fafafa" }}>
                                                <td style={{ padding: "12px" }}></td>

                                                {columns.map((colName, colIndex) => {
                                                    const matchIndex = data.detailCols.findIndex(
                                                        d => d.toString().toLowerCase() === colName.toLowerCase()
                                                    );

                                                    const value = matchIndex >= 0 ? child[matchIndex] : "";

                                                    return (
                                                        <td key={colIndex}
                                                            style={{
                                                                padding: "12px",
                                                                borderBottom: "1px solid #f1f5f9"
                                                            }}
                                                        >
                                                            {value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}


                                    {/* SINGLE CHILD - Directly show without expand/collapse */}
                                    {/* {hasSingleChild && children.map((child, cidx) => (
                                        <tr key={cidx} style={{ backgroundColor: "#fafafa" }}>
                                            <td style={{ padding: "12px" }}></td>
                                            {data.detailCols.map((col, didx) => (
                                                <td
                                                    key={didx}
                                                    style={{
                                                        padding: "12px",
                                                        borderBottom: "1px solid #f1f5f9"
                                                    }}
                                                >
                                                    {child[didx]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))} */}
                                </React.Fragment>
                            );
                        })}

                        {/* PLAN MANAGED - NORMAL TABLE MODE */}
                        {!isSummaryDetailMode && filteredRows.map((row, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                {columns.map((col, index) => (
                                    <td
                                        key={index}
                                        style={{
                                            padding: "12px",
                                            backgroundColor: i % 2 === 0 ? "transparent" : "#fafafa"
                                        }}
                                    >
                                        {renderCell(row, col)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRows.length === 0 && (
                    <div style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#64748b",
                        fontStyle: "italic"
                    }}>
                        No data found matching your filters
                    </div>
                )}
            </div>
        </div>
    );
};

export default JsonTableCard;