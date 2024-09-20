"use client";
import React, { useState } from "react";
import { Badge, Button } from "antd";

export default function BadgeNotification() {
  const [notificationCount, setNotificationCount] = useState(0);

  const updateBadge = (count) => {
    if ("setAppBadge" in navigator) {
      navigator.setAppBadge(count).catch((error) => {
        console.error("Error setting badge:", error);
      });
    }
  };

  const clearBadge = () => {
    if ("clearAppBadge" in navigator) {
      navigator.clearAppBadge().catch((error) => {
        console.error("Error clearing badge:", error);
      });
    }
  };

  const incrementNotificationCount = () => {
    const newCount = notificationCount + 1;
    setNotificationCount(newCount);
    updateBadge(newCount);
  };

  const resetNotificationCount = () => {
    setNotificationCount(0);
    clearBadge();
  };

  return (
    <div>
      <Badge count={notificationCount} style={{ backgroundColor: "#52c41a" }}>
        <Button onClick={incrementNotificationCount}>Increase Badge</Button>
      </Badge>
      <Button onClick={resetNotificationCount} style={{ marginLeft: "10px" }}>
        Clear Badge
      </Button>
    </div>
  );
}
