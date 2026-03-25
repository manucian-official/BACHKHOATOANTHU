const fs = require("fs")

let data = JSON.parse(
  fs.readFileSync("../data/nhanvat.json")
)

const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("Nhap ten: ", (name) => {

  if (data[name]) {
    console.log(data[name])
  } else {
    console.log("Khong tim thay")
  }

  rl.close()
})