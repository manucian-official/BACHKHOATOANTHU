import json
import os

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, "..", "data")


files = {
    "nhanvat": "nhanvat.json",
    "canhgioi": "canhgioi.json",
    "vatpham": "vatpham.json",
    "theluc": "theluc.json",
    "congphap": "congphap.json",
    "linhthu": "linhthu.json",
    "bando": "bando.json"
}


data = {}


def load(file):

    path = os.path.join(DATA, file)

    if not os.path.exists(path):
        return {}

    try:
        with open(path, encoding="utf-8") as f:
            txt = f.read().strip()
            if txt == "":
                return {}
            return json.loads(txt)

    except:
        return {}


def save(name):

    file = files[name]
    path = os.path.join(DATA, file)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data[name], f, indent=4, ensure_ascii=False)


# load all
for k in files:
    data[k] = load(files[k])


def show_all(name):

    for k in data[name]:
        print("-", k)


def search(name, key):

    if key in data[name]:

        for k, v in data[name][key].items():
            print(k, ":", v)

    else:
        print("Không có")


def add(name):

    key = input("Tên: ")

    data[name][key] = {}

    while True:

        k = input("thuoc tinh (0 thoat): ")

        if k == "0":
            break

        v = input("gia tri: ")

        data[name][key][k] = v

    save(name)


def edit(name):

    key = input("Tên: ")

    if key not in data[name]:
        print("Không có")
        return

    k = input("thuoc tinh: ")

    v = input("gia tri moi: ")

    data[name][key][k] = v

    save(name)


def menu():

    while True:

        print("\n===== BACH KHOA PRO =====")
        print("1 nhanvat")
        print("2 canhgioi")
        print("3 vatpham")
        print("4 theluc")
        print("5 congphap")
        print("6 linhthu")
        print("7 bando")
        print("8 them")
        print("9 sua")
        print("0 thoat")

        c = input("> ")

        if c == "0":
            break

        names = list(files.keys())

        if c in "1234567":

            name = names[int(c) - 1]

            print("1 xem")
            print("2 tim")

            t = input("> ")

            if t == "1":
                show_all(name)

            if t == "2":
                k = input("ten: ")
                search(name, k)

        if c == "8":

            name = input("loai: ")
            add(name)

        if c == "9":

            name = input("loai: ")
            edit(name)


menu()