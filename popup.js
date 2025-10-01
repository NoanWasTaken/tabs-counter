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




const body = document.body;
const toggleButton = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

browser.storage.local.get("theme").then(result => {
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
  } else {
    body.classList.remove("dark");
    icon.src = "images/sun-light.svg";
  }
}