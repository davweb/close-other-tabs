function closeOtherTabs(info, tabToKeep) {
    chrome.tabs.getAllInWindow(tabToKeep.windowId, function(tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id).filter(tabId => tabId !== tabToKeep.id));
    });
}

const menuItemId = chrome.contextMenus.create({
    title: chrome.i18n.getMessage("contextMenuItemLabel"),
    contexts: ['page'],
    onclick: closeOtherTabs
});

function countTabs(windowId) {
    chrome.tabs.getAllInWindow(windowId, function(tabs) {
        const enabled = tabs.length > 1;
        chrome.contextMenus.update(menuItemId, {
            enabled: enabled
        })
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
