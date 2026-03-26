let currentData = {}
let currentType = ""

function getLevelPercent(level) {
  if (!level) return 10
  if (level.includes("Luyện")) return 20
  if (level.includes("Kim")) return 40
  if (level.includes("Nguyên")) return 60
  if (level.includes("Tiên")) return 80
  if (level.includes("Đế")) return 95
  if (level.includes("Vô")) return 100
  return 10
}

function loadData(type) {

  startLoading("Tiên Đế") // hoặc lấy từ data sau này

  fetch("/api/" + type)
    .then(res => res.json())
    .then(data => {

      currentData = data
      renderList(data)

    })
}

function renderList(data) {
  let list = document.getElementById("list")
  list.innerHTML = ""

  for (let k in data) {
    let div = document.createElement("div")
    div.innerText = k
    div.onclick = () => showDetail(k)
    list.appendChild(div)
  }
}

function showDetail(name) {
  let d = currentData[name]

  let html = `<div class="card">`
  html += `<h2>${name}</h2>`

  // 🖼️ avatar
  if (d.avatar) {
    html += `<img class="avatar" src="${d.avatar}">`
  }

  // 🎮 level bar
  if (d.canh_gioi) {
    let p = getLevelPercent(d.canh_gioi)
    html += `<p>⚡ ${d.canh_gioi}</p>
      <div class="bar">
        <div class="bar-inner" style="width:${p}%"></div>
      </div>`
  }

  // ⚔️ thế lực
  if (d.the_luc) {
    html += `<p>⚔️ ${d.the_luc}</p>`
  }

  // 📜 info
  for (let k in d) {
    if (k != "avatar" && k != "canh_gioi" && k != "the_luc") {
      html += `<p><b>${k}</b>: ${d[k]}</p>`
    }
  }

  // 💾 edit
  html += `
    <button onclick="editData('${name}')">✏️ Sửa</button>
  `

  html += `</div>`

  document.getElementById("detail").innerHTML = html
}

function editData(name) {
  let d = currentData[name]

  let newName = prompt("Tên:", name)
  let newLevel = prompt("Cảnh giới:", d.canh_gioi)

  currentData[newName] = {
    ...d,
    canh_gioi: newLevel
  }

  delete currentData[name]

  renderList(currentData)
}

let isAdmin = false

// 🔐 login
function login() {
  let username = document.getElementById("user").value
  let password = document.getElementById("pass").value

  fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {
      isAdmin = true
      document.getElementById("loginBox").style.display = "none"
      document.getElementById("app").style.display = "block"
    } else {
      alert("Sai tài khoản!")
    }

  })
}

// 💾 save
function saveData() {

  fetch("/save/" + currentType, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(currentData)
  })
  .then(res => res.json())
  .then(data => {
    alert("Đã lưu!")
  })
}

let loadingInterval

const lores = [
  "Thiên đạo vô tình, vạn vật tranh đoạt...",
  "Một niệm thành tiên, một niệm thành ma...",
  "Linh khí hội tụ, chuẩn bị đột phá...",
  "Đạo tâm kiên định, phá vỡ gông xiềng...",
  "Thiên kiếp sắp giáng lâm..."
]

function randomLore() {
  return lores[Math.floor(Math.random() * lores.length)]
}

function startLoading(level = "") {

  document.getElementById("loading").style.display = "block"

  let percent = 0

  document.getElementById("lore").innerText = randomLore()

  document.getElementById("loading-text").innerText =
    level ? `Đột phá ${level}...` : "Đang tụ khí..."

  // 🟣 đổi màu aura theo cảnh giới
  let aura = document.querySelector(".aura")

  if (level.includes("Luyện")) aura.style.background = "radial-gradient(circle, green, transparent)"
  else if (level.includes("Kim")) aura.style.background = "radial-gradient(circle, gold, transparent)"
  else if (level.includes("Nguyên")) aura.style.background = "radial-gradient(circle, cyan, transparent)"
  else if (level.includes("Tiên")) aura.style.background = "radial-gradient(circle, purple, transparent)"
  else if (level.includes("Đế")) aura.style.background = "radial-gradient(circle, red, transparent)"
  else if (level.includes("Vô")) aura.style.background = "radial-gradient(circle, white, transparent)"

  loadingInterval = setInterval(() => {

    percent += Math.random() * 15

    if (percent >= 100) {
      percent = 100
      clearInterval(loadingInterval)
      setTimeout(stopLoading, 500)
    }

    document.getElementById("bar").style.width = percent + "%"
    document.getElementById("percent").innerText = Math.floor(percent) + "%"

  }, 200)
}

function stopLoading() {
  document.getElementById("loading").style.display = "none"
}

if (data.success) {
  isAdmin = true
  document.getElementById("loginBox").style.display = "none"
  document.getElementById("app").style.display = "block"

  // 🔥 hiện console
  document.getElementById("consoleBox").style.display = "block"
}

function log(msg) {
  document.getElementById("log").innerHTML += "<br>" + msg
}

function runCmd() {

  let cmd = document.getElementById("cmd").value

  // 🧠 lệnh 1: xem dữ liệu
  if (cmd === "show data") {
    log(JSON.stringify(currentData, null, 2))
  }

  // ⚡ lệnh 2: reload data
  else if (cmd === "reload") {
    loadData(currentType)
    log("Đã reload")
  }

  // 🗑️ lệnh 3: xóa tất cả
  else if (cmd === "clear data") {
    currentData = {}
    renderList({})
    log("Đã xóa dữ liệu")
  }

  // 👤 lệnh 4: thêm nhân vật
  else if (cmd.startsWith("add ")) {
    let name = cmd.replace("add ", "")
    currentData[name] = {
      canh_gioi: "Luyện Khí",
      the_luc: "Tán tu"
    }
    renderList(currentData)
    log("Đã thêm " + name)
  }

  // 💾 lệnh 5: save
  else if (cmd === "save") {
    saveData()
    log("Đã lưu dữ liệu")
  }

  else {
    log("❌ Lệnh không hợp lệ")
  }
}