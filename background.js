// Cross-browser compatibility with webextension-polyfill
// For Chromium: polyfill loaded via importScripts in service worker
// For Firefox: polyfill loaded via background.scripts in manifest
if (typeof importScripts !== "undefined") {
  importScripts("browser-polyfill.min.js");
}

// Ensure browser API is available (fallback to chrome for Chromium)
if (typeof browser === "undefined") {
  globalThis.browser = chrome;
}

function updateCount() {
  browser.tabs
    .query({})
    .then((tabs) => {
      const count = tabs.length;
      browser.action.setBadgeText({ text: count.toString() });

      browser.storage.local.get(["tabThreshold"]).then((result) => {
        const tabThreshold = result.tabThreshold || 10;
        const orangeThreshold = Math.floor(tabThreshold * 0.75);
        let color = "#4CAF50";

        if (count >= tabThreshold) {
          color = "#f44336";
        } else if (count >= orangeThreshold) {
          color = "#ff9800";
        }

        browser.action.setBadgeBackgroundColor({ color: color });
      });
    })
    .catch((error) => {
      console.error("Error updating count:", error);
    });
}

let updateTimeout = null;

function scheduleUpdate() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(updateCount, 150);
}

browser.runtime.onStartup.addListener(() => {
  updateCount();
});

browser.runtime.onInstalled.addListener(() => {
  updateCount();
});

browser.tabs.onCreated.addListener(updateCount);
browser.tabs.onRemoved.addListener(scheduleUpdate);
browser.tabs.onUpdated.addListener(scheduleUpdate);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateBadge") {
    updateCount();
  }
});

updateCount();
