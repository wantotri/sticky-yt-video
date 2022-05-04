let stickySwitch = document.getElementById('stickySwitch')

browser.storage.local.get(["switchState"])
  .then((result) => stickySwitch.checked = result.switchState)

stickySwitch.addEventListener("click", async () => {
  if (stickySwitch.checked) {
    browser.storage.local.set({ "switchState": true })
  } else {
    browser.storage.local.set({ "switchState": false })
  }
})
