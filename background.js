chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: "options.html"});
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "injectScript") {
      chrome.tabs.executeScript({
        file: "inject.js"
      });
    }
  });
