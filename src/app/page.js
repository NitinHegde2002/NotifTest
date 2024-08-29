"use client";
import React, { useEffect, useCallback } from "react";

export default function Home() {
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

  const showChromeNotification = async (windowTitle, header, details) => {
    const playSound = () => {
      const audio = new Audio("/sounds/happy-bells.wav");
      audio.loop = true; // Loop the audio
      audio.play().catch((error) => {
        console.error("Sound playback was blocked:", error);
      });

      return audio; // Return the audio object to control it later
    };

    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      const audio = playSound(); // Start playing sound and get the audio object

      const notification = new Notification(`${windowTitle} : ${header}`, {
        body: details,
        icon: "/images/notiflogo.ico",
        requireInteraction: true, // Keeps the notification on screen until user interacts
      });

      // Stop audio when notification is clicked
      notification.onclick = () => {
        audio.pause();
        audio.currentTime = 0; // Reset the audio
        notification.close(); // Close the notification
      };

      // Stop audio when notification is closed manually
      notification.onclose = () => {
        audio.pause();
        audio.currentTime = 0; // Reset the audio
      };
    } else if (permission === "denied") {
      alert("***Notification permissions have been denied...!!***");
    } else {
      alert("Notification permissions have not been granted.");
    }
  };

  useEffect(() => {
    // Request notification permission when the component mounts
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return (
    <div>
      <button
        onClick={() =>
          showChromeNotification(
            "MobiGuest",
            "Dining Order",
            "There is an order from room 314 and ordered 6578"
          )
        }
      >
        Notify me!
      </button>
    </div>
  );
}
