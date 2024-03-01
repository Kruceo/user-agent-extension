// popup.js
var pageIndex = 0

console.log(chrome.webRequest)
const ruleList =  document.querySelector(".rule-list")
const updateListEl = ()=>{
  chrome.storage.local.get(['rules'], (res) => {
    const rules = res.rules
    ruleList.innerHTML = ''
    rules.forEach((each)=>{
      var el = document.createElement('div')
      var delButton = document.createElement('button')
      delButton.onclick = ()=> {
        removeRule(each.id)
        updateListEl()
        setTimeout(()=>{
          updateRulesInBackground()
        },500)
        
      }
      var textEl = document.createElement("p")
      delButton.innerText = 'Delete'
      el.appendChild(textEl)
      el.appendChild(delButton)
      el.className = 'rule'
      textEl.innerText = each.host
      ruleList.appendChild(el)
    })
  })
}

const addRule = (host,userAgent)=>{
  chrome.storage.local.get(['rules'], (res) => {
    var rules = res.rules
    rules.push({
      id:rules.length,
      host: host,
      userAgent: userAgent
    })

    chrome.storage.local.set({rules},()=>{
      updateListEl()
    })
  })
}

const removeRule = (id)=>{
  chrome.storage.local.get(['rules'], (res) => {
    var rules = res.rules
    
    rules = rules.filter(each=>{
      if(each.id != id)return each
    })

    chrome.storage.local.set({rules},()=>{
      updateListEl()
    })
  })
}
chrome.storage.local.get(['rules'], (res) => {
  const rules = res.rules
  if (!rules) chrome.storage.local.set({ rules: [] })

  updateListEl()
})

const updateRulesInBackground = ()=> chrome.runtime.sendMessage({ action: 'updateRules' })

updateRulesInBackground()

const mainListEl = document.querySelector("main.list-panel")
const mainAddEl = document.querySelector("main.add-panel")

const updatePage = ()=>{
  if(pageIndex == 0){
    mainListEl.style.display = "flex"
    mainAddEl.style.display = 'none'
  }
  if(pageIndex == 1){
    mainListEl.style.display = "none"
    mainAddEl.style.display = 'flex'
  }
}

updatePage()

const hostInput = document.querySelector(".host")
const userAgentInput = document.querySelector(".user-agent")

const changeToAddButton = document.querySelector('button.change-to-add')
const saveButton = document.querySelector('button.save')
const cancelButton = document.querySelector("button.cancel")
const tvButton = document.querySelector("button.tv")

changeToAddButton.onclick = ()=> {
  pageIndex = 1
  updatePage()
}



tvButton.addEventListener('click',()=> {
  userAgentInput.value = 'Mozilla/5.0 (PlayStation; PlayStation 5/3.21) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
})

saveButton.addEventListener('click', () => {

  const userAgentText = userAgentInput.value
  const hostText = hostInput.value

  if(userAgentText == "" || !userAgentText) return hostInput.classList.add('error')
  if(hostText == "" || !hostText) return hostInput.classList.add('error')

  addRule(hostText,userAgentText)
  setTimeout(()=>{
    updateRulesInBackground()
  },500)

  pageIndex = 0 
  updatePage()
  
})
cancelButton.addEventListener('click',()=>{
  pageIndex = 0
  updatePage()
})


