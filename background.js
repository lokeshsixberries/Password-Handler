chrome.runtime.onInstalled.addListener(() => {
    console.log('Password Manager extension installed');
});


chrome.commands.onCommand.addListener(function (command) {
    if (command === "openExtension") {
        chrome.windows.create({
            url: "popup.html",
            type: "popup",
            width: 500,
            height: 500
        });
    }
});