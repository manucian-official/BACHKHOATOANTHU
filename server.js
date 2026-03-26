const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// 🧠 fake database login
const ADMIN = {
  username: "admin",
  password: "123456"
}

// 🧠 session tạm (local)
let loggedIn = false

function load(file) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "data", file))
  )
}

function save(file, data) {
  fs.writeFileSync(
    path.join(__dirname, "..", "data", file),
    JSON.stringify(data, null, 2)
  )
}

// 🔐 LOGIN
app.post("/login", (req, res) => {
  let { username, password } = req.body

  if (username === ADMIN.username && password === ADMIN.password) {
    loggedIn = true
    return res.json({ success: true })
  }

  res.json({ success: false })
})

// 🔓 CHECK LOGIN
app.get("/check", (req, res) => {
  res.json({ loggedIn })
})

// 📖 GET DATA
app.get("/api/:type", (req, res) => {
  let type = req.params.type + ".json"

  try {
    let data = load(type)
    res.json(data)
  } catch {
    res.json({})
  }
})

// 💾 SAVE DATA (ADMIN ONLY)
app.post("/save/:type", (req, res) => {

  if (!loggedIn) {
    return res.json({ error: "Chưa đăng nhập" })
  }

  let type = req.params.type + ".json"

  save(type, req.body)

  res.json({ success: true })
})

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000")
})

app.use((req, res, next) => {
  let ip = req.ip

  if (req.path.startsWith("/save") && ip !== "::1") {
    return res.json({ error: "IP không hợp lệ" })
  }

  next()
})