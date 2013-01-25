
/*
chrome.browserAction.setBadgeText({'text': 'asdf'});
//chrome.browserAction.setTitle({'title': 'asdf'});
chrome.browserAction.setPopup({
	// 'tabId ': 0,
	'popup': '/index.htm'
});

chrome.browserAction.onClicked.addListener(function(tab) {
	alert('clicked!')
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

*/