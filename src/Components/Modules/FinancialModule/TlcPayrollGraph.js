import React, { useEffect, useRef, useState } from "react";

/**
 * ⚡ Optimized Plotly HTML Renderer (safe + native scale)
 */
const PlotlyChart = React.memo(({ chartHTML, id }) => {
  const containerRef = useRef(null);
  const renderedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !chartHTML || renderedRef.current) return;

    // Create a safe inner wrapper
    const innerWrapper = document.createElement("div");
    innerWrapper.className = "chart-inner";
    container.replaceChildren(innerWrapper); // safe reset

    const renderChart = async () => {
      const virtualDOM = document.createElement("div");
      virtualDOM.innerHTML = chartHTML.trim();

      const scripts = Array.from(virtualDOM.querySelectorAll("script"));
      scripts.forEach((s) => s.remove());

      // Inject static content inside the inner wrapper only
      innerWrapper.innerHTML = virtualDOM.innerHTML;

      // Execute inline & external scripts safely
      for (const script of scripts) {
        await new Promise((resolve) => {
          const newScript = document.createElement("script");
          newScript.async = true;

          if (script.src) {
            newScript.src = script.src;
            newScript.onload = resolve;
            newScript.onerror = resolve;
            document.body.appendChild(newScript);
          } else {
            setTimeout(() => {
              try {
                new Function(script.textContent || "")();
              } catch (e) {
                console.warn("⚠️ Inline Plotly script error:", e);
              }
              resolve();
            }, 0);
          }
        });
      }

      // Apply visual scaling (no distortion)
      requestAnimationFrame(() => {
        const plots = innerWrapper.querySelectorAll(".plotly-graph-div");
        plots.forEach((div) => {
          div.style.scale = "0.6"; // ✅ natural flattening
          div.style.transformOrigin = "top center";
          div.style.transition = "scale 0.4s ease, opacity 0.6s ease";
          div.style.opacity = "1";
          div.style.width = "100%";
          div.style.height = "260px";
          div.parentElement.style.overflow = "hidden";
        });
      });

      renderedRef.current = true;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !renderedRef.current) {
          setIsVisible(true);
          observer.disconnect();
          renderChart();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      // ✅ Clear only inner wrapper safely (no removeChild conflicts)
      if (container.contains(innerWrapper)) {
        container.replaceChildren();
      }
      renderedRef.current = false;
    };
  }, [chartHTML]);

  return (
    <div
      ref={containerRef}
      id={id}
      className="chart-box fade-in"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height: "280px",
        width: "100%",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        position: "relative",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {!renderedRef.current && (
        <div
          style={{
            fontSize: "14px",
            color: "#999",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Rendering chart...
        </div>
      )}
    </div>
  );
});

export default PlotlyChart;
