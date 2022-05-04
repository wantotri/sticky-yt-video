# Sticky Youtube Video Extension

Make the youtube video player "sticky" to the top, so we can watch the video while scrolling through the comment section 😎

## Chrome

> Tested on Chrome Version 100.0.4896.127 (Official Build) (64-bit)

The directory holding the manifest file can be added as an extension in developer mode in its current state. To load an unpacked extension in developer mode, follow these steps:

1. Open the Extension Management page by navigating to **chrome://extensions**.
    * Alternatively, open this page by clicking on the **Extensions** menu button and selecting **Manage Extensions** at the bottom of the menu.
    * Alternatively, open this page by clicking on the Chrome menu, hovering over **More Tools** then selecting **Extensions**
2. **Enable Developer Mode** by clicking the toggle switch next to Developer mode.
3. Click the **Load unpacked** button and select the extension directory.

## Firefox

### Install Temporarily

> Tested in Firefox 100.0 (64-bit)

In Firefox: Open the **about:debugging** page, click the **This Firefox** option, click the **Load Temporary Add-on** button, then select any file in your extension's directory.
The extension now installs, and remains installed until you restart Firefox.
Alternatively, you can run the extension from the command line using the web-ext tool.

### Install Permanently

> So, beginning with Firefox 44 all future releases and versions of Firefox will not allow unsigned extensions to be installed, with no override.

Because this extension is unsigned, so to install "permanently" you need to follow these steps:

1. Download and install [Firefox Browser Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
2. Open Firefox Developer Edition
1. Go to **about:config**, change **xpinstall.signatures.required** to **false**.
2. Go to **about:addons**, and choose the **Install Add-on from file** option, choose the zip file.
3. Go to **about:config**, change **xpinstall.signatures.required** to **true**.
