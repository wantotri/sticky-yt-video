chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'switchState': false })
})

function observePlayerInner() {
  const playerInnerObserver = new MutationObserver((mutationList, observer)  => {
    mutationList.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        chrome.storage.local.set({ "switchState": false })
      }
    })
  })
  let playerInnerCtr = document.getElementById('player-container-inner')
  playerInnerObserver.observe(playerInnerCtr, { childList: true })
}

function setYtdPlayerSticky() {
  let playerTheaterCtr = document.getElementById('player-theater-container')
  let columns = document.getElementById('columns')
  let theaterBtn = document.querySelector('[aria-label="Theater mode (t)"]')

  chrome.storage.local.get(["switchState"], (result) => {
    if (result.switchState) {
      playerTheaterCtr.style.position = 'fixed'
      playerTheaterCtr.style.zIndex = 1000
      columns.style.marginTop = '56.25vw'
      // force video player in theater mode
      !playerTheaterCtr.hasChildNodes() && theaterBtn.click()
    } else {
      playerTheaterCtr.style.position = 'relative'
      playerTheaterCtr.style.zIndex = 1
      columns.style.marginTop = ''
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
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setYtdPlayerSticky
    });
  }
});
