chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'switchState': false })
})

function observePlayerInner() {
  const ctr = document.getElementById('player-container-inner')
  const config = { childList: true, subtree: false }
  const observer = new MutationObserver(mutationList => {
    mutationList.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        chrome.storage.local.set({ "switchState": false })
      }
    })
  })
  observer.observe(ctr, config)
}

function setYtdPlayerSticky() {
  const ctr = document.getElementById('player-theater-container')
  const col = document.getElementById('columns')
  const btn = document.querySelector('[aria-label="Theater mode (t)"]')

  chrome.storage.local.get(["switchState"], (result) => {
    if (result.switchState) {
      ctr.style.position = 'fixed'
      ctr.style.zIndex = 1000
      col.style.marginTop = '56.25vw'
      // force video player in theater mode
      !ctr.hasChildNodes() && btn.click()
    } else {
      ctr.style.position = 'relative'
      ctr.style.zIndex = 1
      col.style.marginTop = ''
    }
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (!tab.url.includes('youtube.com/watch')) {
      chrome.action.setPopup({
        popup: 'not-youtube.html',
        tabId: tabId
      })
    } else {
      chrome.action.setPopup({
        popup: 'main.html',
        tabId: tabId
      })
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: observePlayerInner
      })
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: setYtdPlayerSticky
      })
    }
  }
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (newValue !== oldValue) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setYtdPlayerSticky
      });
    }
  }
});
