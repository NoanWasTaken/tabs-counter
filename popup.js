let tabThreshold = 10;
let oldTabTimeHours = 24;

function updatePopup() {
  browser.tabs.query({}).then((tabs) => {
    const count = tabs.length;
    document.getElementById("count").textContent = count;
    applyTabCountColor(count);
  });

  let oldTabs = 0;
  const oldTabTime = oldTabTimeHours * 60 * 60 * 1000;
  const now = Date.now();
  browser.tabs.query({}).then((tabs) => {
    for (let tab of tabs) {
      if (tab.lastAccessed && now - tab.lastAccessed > oldTabTime) {
        oldTabs++;
      }
    }
    document.getElementById("old-count").textContent = "(" + oldTabs + ")";
  });
}

function applyTabCountColor(count) {
  const countElement = document.getElementById("count");
  const orangeThreshold = Math.floor(tabThreshold * 0.75);

  countElement.classList.remove("orange", "red");

  if (count >= tabThreshold) {
    countElement.classList.add("red");
  } else if (count >= orangeThreshold) {
    countElement.classList.add("orange");
  }
}

document.getElementById("close-old").addEventListener("click", () => {
  const oldTabTime = oldTabTimeHours * 60 * 60 * 1000;
  const now = Date.now();
  browser.tabs.query({}).then((tabs) => {
    const tabsToClose = tabs.filter(
      (tab) => tab.lastAccessed && now - tab.lastAccessed > oldTabTime
    );

    if (tabsToClose.length > 0) {
      const tabIds = tabsToClose.map((tab) => tab.id);
      browser.tabs.remove(tabIds).then(() => {
        setTimeout(() => {
          updatePopup();
          browser.runtime.sendMessage({ action: "updateBadge" });
        }, 200);
      });
    }
  });
});

loadSettings();

const body = document.body;
const toggleButton = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const settingsIcon = document.getElementById("settings-icon");
const backIcon = document.getElementById("back-icon");

const mainSection = document.getElementById("main-section");
const settingsSection = document.getElementById("settings-section");
const settingsButton = document.getElementById("settings-button");
const backButton = document.getElementById("back-button");

settingsButton.addEventListener("click", () => {
  mainSection.style.display = "none";
  settingsSection.style.display = "block";
});

backButton.addEventListener("click", () => {
  settingsSection.style.display = "none";
  mainSection.style.display = "block";
});
browser.storage.local.get("theme").then((result) => {
  const theme = result.theme || "light";
  applyTheme(theme);
});

toggleButton.addEventListener("click", () => {
  const newTheme = body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  browser.storage.local.set({ theme: newTheme });
});

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    icon.src = "images/moon-sat.svg";
    settingsIcon.src = "images/settings-white.svg";
    backIcon.src = "images/xmark-white.svg";
  } else {
    body.classList.remove("dark");
    icon.src = "images/sun-light.svg";
    settingsIcon.src = "images/settings.svg";
    backIcon.src = "images/xmark.svg";
  }
}

function loadSettings() {
  browser.storage.local
    .get(["tabThreshold", "oldTabTimeHours"])
    .then((result) => {
      if (result.tabThreshold) {
        tabThreshold = result.tabThreshold;
        document.getElementById("tab-threshold").value = tabThreshold;
      }
      if (result.oldTabTimeHours) {
        oldTabTimeHours = result.oldTabTimeHours;
        document.getElementById("old-tab-time").value = oldTabTimeHours;
      }
      updatePopup();
    });
}

function saveSettings() {
  const newTabThreshold = parseInt(
    document.getElementById("tab-threshold").value
  );
  const newOldTabTime = parseFloat(
    document.getElementById("old-tab-time").value
  );

  if (newTabThreshold > 0) {
    tabThreshold = newTabThreshold;
  }
  if (newOldTabTime > 0) {
    oldTabTimeHours = newOldTabTime;
  }

  browser.storage.local
    .set({
      tabThreshold: tabThreshold,
      oldTabTimeHours: oldTabTimeHours,
    })
    .then(() => {
      settingsSection.style.display = "none";
      mainSection.style.display = "block";
      updatePopup();
      browser.runtime.sendMessage({ action: "updateBadge" });
    });
}

document
  .getElementById("save-settings")
  .addEventListener("click", saveSettings);
