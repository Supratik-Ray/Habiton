"use client";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Heatmap() {
  return (
    <div className="w-full">
      <CalendarHeatmap
        startDate={new Date("2025-01-01")}
        endDate={new Date("2025-12-30")}
        values={[
          { date: "2025-01-01", count: 12 },
          { date: "2025-01-22", count: 122 },
          { date: "2025-01-30", count: 38 },
          // ...and so on
        ]}
      />
    </div>
  );
}
