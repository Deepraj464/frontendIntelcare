const COUNT_API_BASE = "https://curki-test-prod-auhyhehcbvdmh3ef.canadacentral-01.azurewebsites.net";

const incrementAnalysisCount = async (userEmail,buttonType,AiAnalysisCost) => {
  try {
    if (!userEmail) return;
    const payload = { userEmail,buttonType,AiAnalysisCost };

    const res = await fetch(`${COUNT_API_BASE}/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Increment API failed");

    console.log("✅ Count incremented successfully:", data);
  } catch (error) {
    console.error("❌ Error incrementing count:", error.message);
  }
};
export default incrementAnalysisCount
