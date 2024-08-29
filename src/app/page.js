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

  const isMobileBrowser = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const playSound = () => {
    const audio = new Audio("/sounds/happy-bells.wav");

    if (isMobileBrowser()) {
      let playCount = 0;
      const maxPlays = 2;

      audio.addEventListener("ended", () => {
        playCount += 1;
        if (playCount < maxPlays) {
          audio.currentTime = 0; // Reset the audio
          audio.play(); // Play the sound again
        }
      });
    } else {
      audio.loop = true;
    }

    audio.play().catch((error) => {
      console.error("Sound playback was blocked:", error);
    });

    return audio; // Return the audio object to control it later
  };

  const showChromeNotification = async (windowTitle, header, details) => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      const audio = playSound(); // Start playing sound and get the audio object

      const notificationOptions = {
        body: details,
        icon: "/images/notiflogo.ico",
      };

      // Modify notification for desktop browsers
      if (!isMobileBrowser()) {
        notificationOptions.requireInteraction = true; // Keeps the notification on screen until user interacts
      }

      const notification = new Notification(
        `${windowTitle} : ${header}`,
        notificationOptions
      );

      if (!isMobileBrowser()) {
        // Stop audio when notification is clicked (only on desktop)
        notification.onclick = () => {
          audio.pause();
          audio.currentTime = 0; // Reset the audio
          notification.close(); // Close the notification
        };

        // Stop audio when notification is closed manually (only on desktop)
        notification.onclose = () => {
          audio.pause();
          audio.currentTime = 0; // Reset the audio
        };
      }
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
      <p>with changes for mobile.. testing-1</p>
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
