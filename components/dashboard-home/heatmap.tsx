"use client";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Heatmap({
  data,
  startDate,
  endDate,
}: {
  data: Array<{ date: string; count: number }>;
  startDate: Date;
  endDate: Date;
}) {
  return (
    <div className="w-full">
      <CalendarHeatmap startDate={startDate} endDate={endDate} values={data} />
    </div>
  );
}
