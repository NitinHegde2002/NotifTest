"use client";
import React, { useEffect, useCallback, useState } from "react";

export default function NotificationComponent() {
  const [notificationCount, setNotificationCount] = useState(0);

  const requestNotificationPermission = useCallback(() => {
    return new Promise((resolve) => {
      if (Notification.permission === "granted") {
        resolve("granted");
      } else if (Notification.permission === "denied") {
        resolve("denied");
      } else {
        Notification.requestPermission().then((permission) => {
          resolve(permission);
        });
      }
    });
  }, []);

  const playSound = () => {
    const audio = new Audio("/sounds/happy-bells.wav");
    audio.loop = true;

    audio.play().catch((error) => {
      console.error("Sound playback was blocked:", error);
    });

    return audio;
  };

  const showChromeNotification = async (windowTitle, header, details) => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      setNotificationCount((prevCount) => prevCount + 1); // Increment count

      const audio = playSound();
      const notificationOptions = {
        body: details,
        icon: "/images/notiflogo.ico",
        requireInteraction: true, // Keeps notification active until interaction
      };

      const notification = new Notification(
        `${windowTitle} : ${header}`,
        notificationOptions
      );

      notification.onclick = () => {
        audio.pause();
        audio.currentTime = 0;
        notification.close();
      };

      notification.onclose = () => {
        setNotificationCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrease count, but don't go below 0
        audio.pause();
        audio.currentTime = 0;
      };
    } else if (permission === "denied") {
      alert("***Notification permissions have been denied...!!***");
    } else {
      alert("Notification permissions have not been granted.");
    }
  };

  // UseEffect to handle the badge update based on notificationCount
  useEffect(() => {
    if (notificationCount > 0) {
      if ("setAppBadge" in navigator) {
        navigator.setAppBadge(notificationCount).catch((error) => {
          console.error("Failed to set badge:", error);
        });
      }
    } else {
      if ("clearAppBadge" in navigator) {
        navigator.clearAppBadge().catch((error) => {
          console.error("Failed to clear badge:", error);
        });
      }
    }
  }, [notificationCount]);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return (
    <div>
      <button
        onClick={() =>
          showChromeNotification(
            "MobiGuest",
            "Dining Order",
            "There is an order from room 314 and ordered 6578."
          )
        }
      >
        Notify me!
      </button>
    </div>
  );
}
