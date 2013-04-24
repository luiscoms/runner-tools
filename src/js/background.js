function getWhatIsNew() {
	chrome.storage.sync.get('currentVersion', function(r) {
		var version  = chrome.runtime.getManifest().version;
		if (!r['currentVersion'] || r['currentVersion'] != version) {
			chrome.browserAction.setBadgeText({'text': 'new'});
			chrome.storage.sync.set({'currentVersion':version},function(){});
		} else {
			chrome.browserAction.setBadgeText({'text': ''});
		}
	});
}
getWhatIsNew();