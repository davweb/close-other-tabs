const ICONS = {
    enabled: {
        path: {
            "16": "images/close16.png",
            "24": "images/close24.png",
            "32": "images/close32.png"
        }
    },
    disabled: {
        path: {
            "16": "images/disabled16.png",
            "24": "images/disabled24.png",
            "32": "images/disabled32.png"
        }
    }
};

function closeOtherTabs(tabToKeep) {
    chrome.tabs.getAllInWindow(tabToKeep.windowId, function(tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id).filter(tabId => tabId !== tabToKeep.id));
    });
}

const menuItemId = chrome.contextMenus.create({
    title: chrome.i18n.getMessage("contextMenuItemLabel"),
    contexts: ['page'],
    onclick: (info, tab) => closeOtherTabs(tab)
});

chrome.browserAction.onClicked.addListener(closeOtherTabs);

function countTabs(windowId) {
    chrome.tabs.getAllInWindow(windowId, function(tabs) {
        const enabled = tabs.length > 1;
        chrome.contextMenus.update(menuItemId, {
            enabled: enabled
        })
        const icons = ICONS[enabled ? "enabled" : "disabled"];
        chrome.browserAction.setIcon(icons);
    });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    countTabs(activeInfo.windowId);
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (!removeInfo.isWindowClosing) {
        countTabs(removeInfo.windowId);
    }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId !== -1) {
        countTabs(windowId);
    }
});
