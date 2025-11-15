"use client";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-15 h-15">
      <CircularProgressbar value={value} text={`${value}%`} />
    </div>
  );
}
