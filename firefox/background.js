browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ 'switchState': false })
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (!tab.url.includes('youtube.com/watch')) {
      browser.browserAction.setPopup({ tabId, popup: 'not-youtube.html' });
    } else {
      browser.browserAction.setPopup({ tabId, popup: 'main.html' });
    }
  }
})
