// dataTable語言包
const dataTableTrans = "./dataTable_zh-TW.json"
// ------------------------------------- //
const search_list = document.getElementById("search_list");
const btn_search = document.getElementById("btn_search");
const btn_reset = document.getElementById("btn_reset");
const btn_add = document.getElementById("btn_add");
const dataTable = document.getElementById("dataTable");
// ------------------------------------- //
// 搜尋欄位設定
const search_text = langTrans.search_text;
const search_key = ["案類", "編號", "發生時段", "_id", "發生(現)日期", "發生(現)地點"];
const search_type = ["twin_input", "twin_date", "date", "twin_date", "text_date", "select"]
// ------------------------------------- //
// table header 長度
let table_len = search_key.length;
let addField_sum = 2;
// ------------------------------------- //
// 增加搜尋欄位
function append_Field(type, tag_id, id_num) {
    let field_content = {
        text: `<input id="input_Field${id_num}" class="form-control mx-1" type="text" placeholder="請輸入"></input>`,
        date: `<input id="input_Field${id_num}" class="form-control mx-1" type="date" placeholder="請輸入"></input>`,
        select: `<select id = "input_Field${id_num}" class="form-control mx-1">
        <option selected disabled>${langTrans.selplz}</option>
        <option>${langTrans.enable_text}</option>
        <option>${langTrans.unable_text}</option>
        </select>`,
        text_date: `<input id="input_Field${id_num}" name="text_date" class="form-control mx-1" type="text" placeholder="輸入格式:yyyyMMdd:yyyyMMdd"></input>`,
        twin_date: `<div id="input_Field${id_num}" name="twin_field" class="d-flex">
                  <input id="input_FieldA${id_num}" class="form-control mx-1" type="date" placeholder="請輸入"></input>
                  <input id="input_FieldB${id_num}" class="form-control mx-1" type="date" placeholder="請輸入"></input>
                </div>`,
        twin_input: `<div id="input_Field${id_num}" name="twin_field" class="d-flex">
                  <input id="input_FieldA${id_num}" class="form-control mx-1" type="text" placeholder="請輸入"></input>
                  <input id="input_FieldB${id_num}" class="form-control mx-1" type="text" placeholder="請輸入"></input>
                </div>`
    }
    tag_id.insertAdjacentHTML("afterend", field_content[type]);
}
function searchField_set(id_num) {
    let add_html = `    
        <select id="select_Field${id_num}" class="form-control mx-1">
            <option selected>選擇欄位</option>
        </select>
        <input id="null_Field${id_num}" disabled class="form-control mx-1" type="text" placeholder="請輸入"></input>

        <button id="btn_minus${id_num}" type="button" class="btn btn-dark rounded-circle">
            <i id="i_minus${id_num}" class="fa fa-minus"></i>
        </button>`;
    return add_html;
}
// ------------------------------------- //
let optionArr = [];
let keyWordList = [];
// 
let newOptionObj = {};
let newKeyWordObj = {};
// ------------------------------------- //
// 拆解id數字
// id_No_Num:沒有號碼的部分
// val:id文字
function splitId_to_Num(id_No_Num, val) {
    return val.substring(id_No_Num.length, val.length)
}
// 宣告監聽事件
function addEvent(ele, type, selector, func, capture) {
    // 若只有3個參數，交換selector & func
    // if (func == null) {
    //     func = selector;
    //     selector = null
    // }
    if (capture == null) {
        capture = func;
        func = selector;
        selector = null;
    }
    ele.addEventListener(type, function (e) {
        let target;
        if (selector) {
            //  代理
            target = e.target;
            if (target.matches(selector)) {
                func.call(target, e)
            }
        } else {
            func.call(ele, e)
        }
    }, capture);
}
// btn_search
addEvent(btn_search, "click", function (e) {
    let sendData = "";
    for (let i = 0; i < keyWordList.length; i++) {
        sendData += "&" + keyWordList[i].optionType + "?" + keyWordList[i].keyWord;
    }
    document.getElementById("result").innerHTML = sendData;
}, false);
// btn_reset
addEvent(btn_reset, "click", function (e) {
    window.location.reload()
}, false);

function createOption(data, searchText, searchKey) {
    console.log("tableHeader", data)
    // table header content
    let result = [];
    let dataKey;
    if (searchText.length > 0 && searchKey.length > 0) {
        for (let i = 0; i < searchKey.length; i++) {
            optionArr.push({
                value: searchKey[i],
                content_text: searchText[i],
                use_status: false,
                used: "",
                classList: "",
                keyWord: ""
            });
        }
    } else {
        document.querySelectorAll("table th").forEach((item) => {
            result.push(item.innerHTML);
        });
        dataKey = Object.keys(data.result.results[0])
        for (let i = 0; i < dataKey.length; i++) {
            optionArr.push({
                value: dataKey[i],
                content_text: result[i],
                use_status: false,
                used: "",
                classList: "",
                keyWord: ""
            });
        }
    }
    keyWordList.push({
        index: 1,
        optionType: "",
        keyWord: ""
    });
    let sel_tag = document.getElementById("select_Field1");
    // let input_tag = document.getElementById("input_Field1");
    // input_tag.disabled = true;
    // sel_tag.querySelectorAll("option").forEach((item) => { if (item.text != "選擇欄位") { item.remove() } })
    if (optionArr) {
        for (let i = 0; i < optionArr.length; i++) {
            let appendOption = new Option(optionArr[i].content_text, optionArr[i].value);
            sel_tag.options.add(appendOption);
        }
    }
    console.log("test", dataKey, optionArr);
}


// 下拉選單
addEvent(search_list, "click", "select", function (e) {
    let slectIdName = this.id.slice(0, -1);
    if (slectIdName.indexOf("select_Field") > -1) {
        let sel_tag = document.getElementById(this.id);
        let sel_val = sel_tag.options[sel_tag.selectedIndex].value;
        let keyWordIndex = Number(splitId_to_Num("select_Field", this.id));
        for (let i = 1; i < sel_tag.options.length; i++) {
            console.log("sel_tag.options", optionArr[i - 1].used, this.id, sel_tag.selectedIndex)
            if (optionArr[i - 1].used === keyWordIndex && i !== sel_tag.selectedIndex) {
                optionArr[i - 1].used = "";
                // optionArr[i - 1].classList = "";
                sel_tag.options[i].disabled = optionArr[i - 1].use_status = false;
                console.log("sel_tag.options")
            } else {
                sel_tag.options[i].disabled = optionArr[i - 1].use_status;
                // sel_tag.options[i].classList = optionArr[i - 1].classList;
            }
        }
        console.log("sel_val ckick event", sel_val, sel_tag.selectedIndex, optionArr, sel_tag.options.length, this.id, "keyWordList", keyWordList);
    }
}, false);
// 選擇欄位(搜尋val)
addEvent(search_list, "change", "select", function (e) {
    let slectIdName = this.id.slice(0, -1);
    if (slectIdName.indexOf("input_Field") > -1) {
        let input_select = document.getElementById(this.id);
        let keyWordIndex = Number(splitId_to_Num("input_Field", this.id));
        for (let i = 0; i < keyWordList.length; i++) {
            if (keyWordList[i].index === keyWordIndex) {
                keyWordList[i].keyWord = input_select.value;
            }
        }
    } else {
        let sel_tag = document.getElementById(this.id);
        let input_tag = document.getElementById("input_Field" + splitId_to_Num("select_Field", this.id));
        let null_tag = document.getElementById("null_Field" + splitId_to_Num("select_Field", this.id));
        let keyWordIndex = Number(splitId_to_Num("select_Field", this.id));
        let sel_val = sel_tag.options[sel_tag.selectedIndex].value;
        if (sel_tag.selectedIndex > 0) {
            if (input_tag) {
                input_tag.remove();
            }
            append_Field(search_type[sel_tag.selectedIndex - 1], sel_tag, keyWordIndex);
            // let input_tag = document.getElementById("input_Field" + splitId_to_Num("select_Field", this.id));
            optionArr[sel_tag.selectedIndex - 1].used = keyWordIndex;
            optionArr[sel_tag.selectedIndex - 1].use_status = true;
            // optionArr[sel_tag.selectedIndex - 1].classList = "d-none";
            null_tag.classList = "d-none";
            for (let i = 0; i < keyWordList.length; i++) {
                if (keyWordList[i].index === keyWordIndex) {
                    keyWordList[i].optionType = optionArr[sel_tag.selectedIndex - 1].value;
                    keyWordList[i].keyWord = "";
                }
            }
        } else {
            null_tag.classList = "form-control mx-1";
            if (input_tag) {
                input_tag.remove();
            }
            for (let i = 0; i < keyWordList.length; i++) {
                if (keyWordList[i].index === keyWordIndex) {
                    keyWordList[i].optionType = "";
                    keyWordList[i].keyWord = "";
                }
            }
        }
        for (let i = 1; i < sel_tag.options.length; i++) {
            console.log("sel_tag.options", optionArr[i - 1].used, this.id, sel_tag.selectedIndex)
            if (optionArr[i - 1].used === keyWordIndex && i !== sel_tag.selectedIndex) {
                optionArr[i - 1].used = "";
                // optionArr[i - 1].classList = "";
                sel_tag.options[i].disabled = optionArr[i - 1].use_status = false;
                console.log("sel_tag.options")
            } else {
                sel_tag.options[i].disabled = optionArr[i - 1].use_status;
                // sel_tag.options[i].classList = optionArr[i - 1].classList;
            }
        }
        console.log("sel_val change event", sel_val, sel_tag.selectedIndex, optionArr, sel_tag.options.length, this.id, "keyWordList", keyWordList);
    }
}, false);
// input
addEvent(search_list, "keyup", "input", function (e) {
    if (this.id.indexOf("input_FieldA") > -1 || this.id.indexOf("input_FieldB") > -1) {
        let div_tag = document.getElementById(this.id).parentNode;
        let keyWordIndex = Number(splitId_to_Num("input_Field", div_tag.id));
        let input_A = document.getElementById("input_FieldA" + keyWordIndex);
        let input_B = document.getElementById("input_FieldB" + keyWordIndex);
        let mergeVal = input_A.value + input_B.value
        console.log("div_tag", div_tag, input_B.value);
        for (let i = 0; i < keyWordList.length; i++) {
            if (keyWordList[i].index === keyWordIndex) {
                keyWordList[i].keyWord = mergeVal;
            }
        }
    } else {
        let input_tag = document.getElementById(this.id);
        let keyWordIndex = Number(splitId_to_Num("input_Field", this.id));
        // keyWordList[keyWordIndex].keyWord = input_tag.value;
        console.log("keyup Val", input_tag.value, input_tag.name);
        // ----input為時間區間用(一格)---- //
        // if (input_tag.name ==="text_date"){
        //     // 處理時間格式
        // }
        // ------------------------ //
        for (let i = 0; i < keyWordList.length; i++) {
            if (keyWordList[i].index === keyWordIndex) {
                keyWordList[i].keyWord = input_tag.value;
            }
        }
    }

}, false);
// 時間
addEvent(search_list, "change", "input", function (e) {
    // 時間格式調整
    function dateReplace(date) {
        return date.replace(/[\-]/g, "");
    }
    function toTimeStamp(date) {
        // return String(Date.parse(date) / 1000);
        return Date.parse(date) / 1000;
    }
    function swapVal(obj) {
        [obj.a, obj.b] = [obj.b, obj.a];
        return obj;
    }
    if (this.id.indexOf("input_FieldA") > -1 || this.id.indexOf("input_FieldB") > -1) {
        let div_tag = document.getElementById(this.id).parentNode;
        let keyWordIndex = Number(splitId_to_Num("input_Field", div_tag.id));
        let input_A = document.getElementById("input_FieldA" + keyWordIndex);
        let input_B = document.getElementById("input_FieldB" + keyWordIndex);
        let mergeVal = 0;
        let timeStamp_A = toTimeStamp(input_A.value);
        let timeStamp_B = toTimeStamp(input_B.value);
        console.log("timeStamp_A&timeStamp_B", timeStamp_A, timeStamp_B)
        if (!timeStamp_A) {
            timeStamp_A = timeStamp_B;
            timeStamp_B = timeStamp_B + 86399
            console.log("AAA");
            input_A.value = input_B.value;
        }
        else if (!timeStamp_B) {
            timeStamp_B = timeStamp_A + 86399
            console.log("BBB");
            input_B.value = input_A.value;
        }
        else if (timeStamp_A > timeStamp_B && timeStamp_B !== 0) {
            console.log("timeStamp_A > timeStamp_B")
            timeStamp_A = timeStamp_B;
            timeStamp_B = timeStamp_B + 86399;
            input_A.value = input_B.value;
        }
        else if (timeStamp_A === timeStamp_B) {
            console.log("timeStamp_A < timeStamp_B")
            timeStamp_B = timeStamp_A + 86399
        }
        mergeVal = String(timeStamp_A) + ":" + String(timeStamp_B);
        console.log("div_tag", mergeVal, input_B.value);
        for (let i = 0; i < keyWordList.length; i++) {
            if (keyWordList[i].index === keyWordIndex) {
                keyWordList[i].keyWord = mergeVal;
            }
        }
    } else {
        let input_tag = document.getElementById(this.id);
        let keyWordIndex = Number(splitId_to_Num("input_Field", this.id));
        // keyWordList[keyWordIndex].keyWord = input_tag.value;
        let date_val = dateReplace(input_tag.value);
        console.log("time Val", date_val);
        for (let i = 0; i < keyWordList.length; i++) {
            if (keyWordList[i].index === keyWordIndex) {
                keyWordList[i].keyWord = date_val;
            }
        }
    }
}, false);
// 刪除欄位btn
addEvent(search_list, "click", "i", function (e) {
    console.log("keyWordList", keyWordList);
    if (this.id) {
        let keyWordIndex = Number(splitId_to_Num("i_minus", this.id));
        let removed;
        for (i = 0; i < keyWordList.length; i++) {
            if (keyWordIndex === keyWordList[i].index) {
                removed = keyWordList.splice(i, 1);
            }
        }
        for (let i = 0; i < optionArr.length; i++) {
            if (keyWordIndex === optionArr[i].used) {
                optionArr[i].used = "";
                optionArr[i].use_status = false;
                optionArr[i].classList = ""
            }
        }
        document.getElementById(this.id).parentElement.parentElement.remove();
        // let tag = document.getElementById(this.id).parentElement.parentElement.getElementsByTagName("select")[0].id;
        console.log("i_tag", this.id, removed, keyWordIndex)
    }

}, true);
addEvent(search_list, "click", "button", function (e) {
    console.log("keyWordList", keyWordList);
    if (this.id !== "btn_add") {
        let keyWordIndex = Number(splitId_to_Num("btn_minus", this.id));
        let removed;
        for (i = 0; i < keyWordList.length; i++) {
            if (keyWordIndex === keyWordList[i].index) {
                removed = keyWordList.splice(i, 1);
            }
        }
        for (let i = 0; i < optionArr.length; i++) {
            if (keyWordIndex === optionArr[i].used) {
                optionArr[i].used = "";
                optionArr[i].use_status = false;
                optionArr[i].classList = ""
            }
        }
        document.getElementById(this.id).parentElement.remove();
        console.log("button_tag", this.id, typeof this.id, removed, keyWordIndex)
    }

}, true);
// ------------------------------------- //
// 新增搜尋欄位
function addField() {
    console.log("addField_sum", addField_sum, table_len);

    const box_Container = document.getElementById("search_list");
    let li_len = box_Container.getElementsByTagName("li").length;
    console.log("box_Container", box_Container, li_len)

    if (li_len + 1 > table_len) {
        alert(langTrans.search_alert_text);
    } else {
        let field_box = document.createElement("li");
        // add class
        field_box.classList.add("d-flex", "align-items-center");
        field_box.innerHTML = searchField_set(addField_sum);
        box_Container.appendChild(field_box);
        // 加入option
        let select_Field = document.getElementById("select_Field" + addField_sum);
        if (optionArr) {
            for (let i = 0; i < optionArr.length; i++) {
                let appendOption = new Option(optionArr[i].content_text, optionArr[i].value);
                select_Field.appendChild(appendOption);
            }
            // 
            for (let i = 1; i < select_Field.options.length; i++) {
                select_Field.options[i].disabled = optionArr[i - 1].use_status;
            }
        }
        // 加入查詢傳輸項
        keyWordList.push({
            index: addField_sum,
            optionType: "",
            keyWord: ""
        });
        addField_sum += 1;
    }
}
// dataTable測試
$(document).ready(function () {
    let table = $('#dataTable').DataTable({
        // 排序開關
        "ordering": false,
        // 分頁詳細資料
        // "info": false,
        // 搜尋筆數
        lengthMenu: [
            [10],
            ["10"],
        ],
        language: {
            url: dataTableTrans
        },
        processing: true,
        serverSide: true,
        columns: [{
            "data": "案類"
        },
        {
            "data": "編號"
        },
        {
            "data": "發生時段"
        },
        { "data": "_id" },
        {
            "data": "發生(現)日期"
        },
        {
            "data": "發生(現)地點"
        },
        ],
        ajax: {
            "url": "https://data.taipei/api/v1/dataset/08052aba-d76d-4b25-93f7-e19cec685f5a?scope=resourceAquire",
            "type": 'GET',
            "data": function (d) {
                console.log("data!!!", d, d.search.value);
                return {
                    q: d.search.value,
                    limit: d.length,
                    offset: d.start

                }
            },

            dataSrc(data) {
                console.log("SRC", data);
                createOption(data, search_text, search_key);
                data.recordsTotal = data.result.count
                data.recordsFiltered = data.result.count
                return data.result.results
            },
        }
    });
    $('#dataTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        console.log("data", data)
        // alert('You clicked on ' + data["編號"] + '\'s row');
        var name = $('td', this).eq(2).text();
        console.log("tdName", name);
        // document.querySelector("#innerData").innerHTML = `
        // <select class="form-control mx-1">
        //     <option selected>選擇欄位</option>
        // </select>
        // <div>
        //     ${name}
        // </div>
        // `
        $('#DescModal').modal("show");
    });
});