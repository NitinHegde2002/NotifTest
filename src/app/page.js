"use client";
import React from "react";
import NotificationComponent from "./NotificationComponent";

export default function Page() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Notification & Badge Demo with PWA</h1>
      <p style={{ fontSize: "xs", fontWeight: 200 }}>
        Click the button below to trigger a notification with a badge on the PWA
        icon.
      </p>
      {/* NotificationComponent handles notification and badge logic */}
      <NotificationComponent />
    </div>
  );
}
