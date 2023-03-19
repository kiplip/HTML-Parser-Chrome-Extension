chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSource") {
      sendResponse({ source: document.documentElement.outerHTML });
    }
  });
  