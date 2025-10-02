function updateCount() {
  browser.tabs.query({}).then((tabs) => {
    const count = tabs.length;
    browser.browserAction.setBadgeText({ text: count.toString() });

    browser.storage.local.get(["tabThreshold"]).then((result) => {
      const tabThreshold = result.tabThreshold || 10;
      const orangeThreshold = Math.floor(tabThreshold * 0.75);
      let color = "#4CAF50";

      if (count >= tabThreshold) {
        color = "#f44336";
      } else if (count >= orangeThreshold) {
        color = "#ff9800";
      }

      browser.browserAction.setBadgeBackgroundColor({ color: color });
    });
  });
}

let updateTimeout = null;

function scheduleUpdate() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(updateCount, 150);
}

browser.tabs.onCreated.addListener(updateCount);
browser.tabs.onRemoved.addListener(scheduleUpdate);
browser.tabs.onUpdated.addListener(scheduleUpdate);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateBadge") {
    updateCount();
  }
});

updateCount();
