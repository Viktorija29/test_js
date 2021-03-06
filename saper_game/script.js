// Получаем ссылку на элемент, перед которым мы хотим вставить таблицу
var sp2 = document.getElementById("next_elem");
var parentDiv = sp2.parentNode;
let A = [];
let Size = 0;

function helpOpen() {
    if (document.getElementById("field")) {
        if (!document.getElementById("check_fl").checked) {
            let fl = true;
            for (var i = 0; i < Size; i++) {
                if (fl) {
                    for (var j = 0; j < Size; j++) {
                        if (A[i][j].val != "*" && A[i][j].val != "" && !A[i][j].viewed) {
                            fl = false;
                            showContent(document.getElementById(`${i} ${j}`));
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
        } else {
            alert("Снимите флажок!")
        }
    }
}

function makeCell(v) {
    return {
        //0-8 и * (0 - пустая клетка и мин вокруг нет, 1-8 - количество мин вокруг, * - в этой клетке мина!)
        val: v,
        //открыто ли значение
        viewed: false
    };
}

function isBomb(obj) {
    if (obj.val == "*") {
        return 1;
    } else {
        return 0;
    }
}

function createArray(size) {
    let arr = new Array(Size);
    for (var i = 0; i < Size; i++) {
        arr[i] = new Array(Size);
    }
    for (var i = 0; i < Size; i++) {
        for (var j = 0; j < Size; j++) {
            if (Math.random() > 0.8) {
                arr[i][j] = makeCell("*");
            } else {
                arr[i][j] = makeCell(0);
            }
            //alert(arr[i][j].val);
        }
    }
    let last = Size - 1;
    for (var i = 0; i < Size; i++) {
        for (var j = 0; j < Size; j++) {
            if (arr[i][j].val != "*") {
                let count_bomb = 0;
                //углы
                if (i == 0 && j == 0) {
                    count_bomb += isBomb(arr[0][1]) + isBomb(arr[1][0]) + isBomb(arr[1][1]);
                } else if (i == 0 && j == last) {
                    count_bomb += isBomb(arr[0][j - 1]) + isBomb(arr[1][j - 1]) + isBomb(arr[1][j]);
                } else if (i == last && j == 0) {
                    count_bomb += isBomb(arr[i - 1][0]) + isBomb(arr[i - 1][1]) + isBomb(arr[i][1]);
                } else if (i == last && j == last) {
                    count_bomb += isBomb(arr[i][j - 1]) + isBomb(arr[i - 1][j - 1]) + isBomb(arr[i - 1][j]);
                }
                //края
                else if (j == 0) {
                    count_bomb += isBomb(arr[i - 1][0]) + isBomb(arr[i - 1][1]) + isBomb(arr[i][1]) + isBomb(arr[i + 1][1]) + isBomb(arr[i + 1][0]);
                } else if (i == 0) {
                    count_bomb += isBomb(arr[0][j - 1]) + isBomb(arr[1][j - 1]) + isBomb(arr[1][j]) + isBomb(arr[1][j + 1]) + isBomb(arr[0][j + 1]);
                } else if (j == last) {
                    count_bomb += isBomb(arr[i - 1][j]) + isBomb(arr[i - 1][j - 1]) + isBomb(arr[i][j - 1]) + isBomb(arr[i + 1][j - 1]) + isBomb(arr[i + 1][j]);
                } else if (i == last) {
                    count_bomb += isBomb(arr[i][j - 1]) + isBomb(arr[i - 1][j - 1]) + isBomb(arr[i - 1][j]) + isBomb(arr[i - 1][j + 1]) + isBomb(arr[i][j + 1]);
                }
                //центр
                else {
                    count_bomb += isBomb(arr[i - 1][j - 1]) + isBomb(arr[i - 1][j]) + isBomb(arr[i - 1][j + 1]) + isBomb(arr[i + 1][j - 1]) + isBomb(arr[i + 1][j]) + isBomb(arr[i + 1][j + 1]) + isBomb(arr[i][j - 1]) + isBomb(arr[i][j + 1])
                }
                arr[i][j].val = count_bomb == 0 ? "" : count_bomb;
            }
        }
    }
    return arr;
}

function addTableIntoPage() {
    var tbl = document.createElement('table');
    tbl.id = "field";
    tbl.style.width = '400px';
    tbl.style.height = '400px';
    tbl.style.border = '1px solid black';
    Size = Number(document.getElementById("slide").value);
    let w = 400 / Size;
    A = createArray(Size);
    for (var i = 0; i < Size; i++) {
        var tr = tbl.insertRow();
        tr.style.height = `${w}px`;
        for (var j = 0; j < Size; j++) {
            var td = tr.insertCell();
            // заполнение из массива
            {
                td.appendChild(document.createTextNode(A[i][j].val));
            }
            td.style.width = `${w}px`;
            td.style.border = '1px solid black';
            td.style.fontSize = "0px";
            td.style.backgroundColor = "gainsboro";
            td.id = `${i} ${j}`;
        }
    }
    tbl.classList.add("new_table");
    parentDiv.insertBefore(tbl, sp2);
}

function showContent(elem) {
    let pos_i = Number(elem.id[0]);
    let pos_j = Number(elem.id[2]);
    let last = Size - 1;
    if (document.getElementById("win").textContent == "Вы проиграли!" || document.getElementById("win").textContent == "Вы победили!") {
        return;
    }
    if (document.getElementById("check_fl").checked) {
        if (!A[pos_i][pos_j].viewed) {
            elem.textContent = "?";
            elem.style.fontSize = "30px";
        }
        return;
    } else {
        elem.style.fontSize = "30px";
        elem.style.backgroundColor = "silver";
        if (elem.textContent == "?") {
            elem.textContent = "";
            elem.style.backgroundColor = "gainsboro";
            return;
        }
    }
    A[pos_i][pos_j].viewed = true;
    if (A[pos_i][pos_j].val == "*") {
        document.getElementById("win").textContent = "Вы проиграли!";
        document.getElementById("win").style.color = "red";
        document.getElementById(`${pos_i} ${pos_j}`).style.backgroundColor = "tomato";
        for (var i = 0; i < Size; i++) {
            for (var j = 0; j < Size; j++) {
                let temp = document.getElementById(`${i} ${j}`);
                if (temp.textContent == "?") {
                    temp.textContent = A[i][j].val;
                }
                temp.style.fontSize = "30px";
            }
        }
    }
    //открытие всех пустых ячеек если ткнули на пустую
    else if (A[pos_i][pos_j].val == "") {
        //углы
        if (pos_i == 0 && pos_j == 0) {
            if (!A[0][1].viewed) showContent(document.getElementById("0 1"));
            if (!A[1][0].viewed) showContent(document.getElementById("1 0"));
            if (!A[1][1].viewed) showContent(document.getElementById("1 1"));
        } else if (pos_i == 0 && pos_j == last) {
            if (!A[0][pos_j - 1].viewed) showContent(document.getElementById(`0 ${pos_j - 1}`));
            if (!A[1][pos_j - 1].viewed) showContent(document.getElementById(`1 ${pos_j - 1}`));
            if (!A[1][pos_j].viewed) showContent(document.getElementById(`1 ${pos_j}`));
        } else if (pos_i == last && pos_j == 0) {
            if (!A[pos_i - 1][0].viewed) showContent(document.getElementById(`${pos_i - 1} 0`));
            if (!A[pos_i - 1][1].viewed) showContent(document.getElementById(`${pos_i - 1} 1`));
            if (!A[pos_i][1].viewed) showContent(document.getElementById(`${pos_i} 1`));
        } else if (pos_i == last && pos_j == last) {
            if (!A[pos_i][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j - 1}`));
            if (!A[pos_i - 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j - 1}`));
            if (!A[pos_i - 1][pos_j].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j}`));
        }
        //края
        else if (pos_j == 0) {
            if (!A[pos_i - 1][0].viewed) showContent(document.getElementById(`${pos_i - 1} 0`));
            if (!A[pos_i - 1][1].viewed) showContent(document.getElementById(`${pos_i - 1} 1`));
            if (!A[pos_i][1].viewed) showContent(document.getElementById(`${pos_i} 1`));
            if (!A[pos_i + 1][1].viewed) showContent(document.getElementById(`${pos_i + 1} 1`));
            if (!A[pos_i + 1][0].viewed) showContent(document.getElementById(`${pos_i + 1} 0`));
        } else if (pos_i == 0) {
            if (!A[0][pos_j - 1].viewed) showContent(document.getElementById(`0 ${pos_j - 1}`));
            if (!A[1][pos_j - 1].viewed) showContent(document.getElementById(`1 ${pos_j - 1}`));
            if (!A[1][pos_j].viewed) showContent(document.getElementById(`1 ${pos_j}`));
            if (!A[1][pos_j + 1].viewed) showContent(document.getElementById(`1 ${pos_j + 1}`));
            if (!A[0][pos_j + 1].viewed) showContent(document.getElementById(`0 ${pos_j + 1}`));
        } else if (pos_j == last) {
            if (!A[pos_i - 1][pos_j].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j}`));
            if (!A[pos_i - 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j - 1}`));
            if (!A[pos_i][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j - 1}`));
            if (!A[pos_i + 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i + 1} ${pos_j - 1}`));
            if (!A[pos_i + 1][pos_j].viewed) showContent(document.getElementById(`${pos_i + 1} ${pos_j}`));
        } else if (pos_i == last) {
            if (!A[pos_i][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j - 1}`));
            if (!A[pos_i - 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j - 1}`));
            if (!A[pos_i - 1][pos_j].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j}`));
            if (!A[pos_i - 1][pos_j + 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j + 1}`));
            if (!A[pos_i][pos_j + 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j + 1}`));
        }
        //центр
        else {
            if (!A[pos_i - 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j - 1}`));
            if (!A[pos_i - 1][pos_j].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j}`));
            if (!A[pos_i - 1][pos_j + 1].viewed) showContent(document.getElementById(`${pos_i - 1} ${pos_j + 1}`));
            if (!A[pos_i + 1][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i + 1} ${pos_j - 1}`));
            if (!A[pos_i + 1][pos_j].viewed) showContent(document.getElementById(`${pos_i + 1} ${pos_j}`));
            if (!A[pos_i + 1][pos_j + 1].viewed) showContent(document.getElementById(`${pos_i + 1} ${pos_j + 1}`));
            if (!A[pos_i][pos_j - 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j - 1}`));
            if (!A[pos_i][pos_j + 1].viewed) showContent(document.getElementById(`${pos_i} ${pos_j + 1}`));
        }
    }
    let fl_end = true;
    for (var i = 0; i < Size; i++) {
        for (var j = 0; j < Size; j++) {
            if (A[i][j].val != "*" && A[i][j].val != "" && A[i][j].viewed == false) {
                fl_end = false;
            }
        }
    }
    if (fl_end) {
        document.getElementById("win").textContent = "Вы победили!";
        document.getElementById("win").style.color = "lime";
        for (var i = 0; i < Size; i++) {
            for (var j = 0; j < Size; j++) {
                let temp = document.getElementById(`${i} ${j}`);
                if (temp.textContent == "?") {
                    temp.textContent = A[i][j].val;
                }
                temp.style.fontSize = "30px";
                //temp.style.backgroundColor = "silver";
            }
        }
    }
}

function updateActions() {
    for (var i = 0; i < Size; i++) {
        for (var j = 0; j < Size; j++) {
            let temp = document.getElementById(`${i} ${j}`);
            temp.setAttribute("onclick", "showContent(this)");
        }
    }
}

function del_field() {
    parentDiv.removeChild(document.getElementById("field"));
}

function tableCreate() {
    if (document.getElementById("field")) {
        //alert("найден");
        del_field();
    }
    //alert("не найден");
    addTableIntoPage();
    updateActions();
    document.getElementById("win").textContent = "";
}

let p = document.getElementById("val")
let range = document.getElementById("slide")
let changeVal = () => {
    p.textContent = range.value
}
changeVal()
range.oninput = changeVal
