"use client";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar({
  value,
  text,
}: {
  value: number;
  text: string;
}) {
  return (
    <div className="w-15 h-15">
      <CircularProgressbar value={value} text={text} />
    </div>
  );
}
