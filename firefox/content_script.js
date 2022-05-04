function waitElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }
    const observer = new MutationObserver(mutation => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

// wait for player-container-inner then create new MutationObserver
async function playerInnerObserver() {
  const playerInner = await waitElm('#player-container-inner')
  const playerInnerObserver = new MutationObserver((mutationList) => {
    mutationList.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        browser.storage.local.set({ "switchState": false })
      }
    })
  })
  playerInnerObserver.observe(playerInner, { childList: true, subtree: false })
}

// function to make the player-theater-container "sticky"
async function stickPlayer(result) {
  const playerTheaterCtr = await waitElm('#player-theater-container')
  const columns = await waitElm('#columns')
  const theaterBtn = await waitElm('[aria-label="Theater mode (t)"]')

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
}

// when the page reload check the switchState
// if it is true, then make it sticky
browser.storage.local.get(["switchState"])
  .then(result => {
    playerInnerObserver()
    stickPlayer(result)
  })

browser.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (oldValue !== newValue) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      )
      browser.storage.local.get(["switchState"])
        .then(stickPlayer)
    }
  }
});