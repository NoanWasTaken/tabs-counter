function updatePopup() {
    browser.tabs.query({}).then((tabs) => {
        document.getElementById("count").textContent = tabs.length;
    });
    let oldTabs = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();
    browser.tabs.query({}).then(tabs => {
        for (let tab of tabs) {
            if (tab.lastAccessed && (now - tab.lastAccessed) > oneDay) {
                oldTabs++;
            }
        }
        document.getElementById("old-count").innerHTML = "(" + oldTabs + ")";
    });
}

document.getElementById("close-old").addEventListener("click", () => {
  const oneDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  browser.tabs.query({}).then(tabs => {
    for (let tab of tabs) {
      if (tab.lastAccessed && (now - tab.lastAccessed) > oneDay) {
        browser.tabs.remove(tab.id);
      }
    }
    updatePopup();
  });
});

// Initialisation
updatePopup();