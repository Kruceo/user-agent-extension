var rules = []

const updateBackgroundRules = ()=>{
    chrome.storage.local.get(["rules"], (res) => {
        rules = res.rules
    })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('mensagem')
    if (request.action && request.action == 'updateRules') {
      
        updateBackgroundRules()
        console.log("rules updated")
    }
})

updateBackgroundRules()

const handler = (details) => {
    console.log(rules)
    rules.forEach(each => {
        const regex = new RegExp(each.host)
        if (regex.test(details.url)) {
            console.log('ok')
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    // Modify the User-Agent header
                    details.requestHeaders[i].value = each.userAgent
                    break;
                }
            }

        }
    })


    return { requestHeaders: details.requestHeaders };
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    handler,
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
);
