function updateCount() {
  browser.tabs.query({}).then(tabs => {
    const count = tabs.length;
    browser.browserAction.setBadgeText({ text: count.toString() });
    browser.browserAction.setBadgeBackgroundColor({ color: "#4CAF50" });
  });
}

browser.tabs.onCreated.addListener(updateCount);
browser.tabs.onRemoved.addListener(() => {
  setTimeout(updateCount, 100);
});

// Initialisation
updateCount();
