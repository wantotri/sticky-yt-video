let stickySwitch = document.getElementById('stickySwitch')

chrome.storage.local.get(["switchState"], (result) => {
  stickySwitch.checked = result.switchState
})

stickySwitch.addEventListener("click", async () => {
  if (stickySwitch.checked) {
    chrome.storage.local.set({ "switchState": true })
  } else {
    chrome.storage.local.set({ "switchState": false })
  }
});
