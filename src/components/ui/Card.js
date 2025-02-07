import React from "react";

export function Card({ children, className }) {
  return <div className={`p-4 border rounded-lg shadow-md ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}