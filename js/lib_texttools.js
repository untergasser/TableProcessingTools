"use strict";

window.fileA = { "fileName": "File A"};
window.fileB = { "fileName": "File B"};
window.fileC = { "fileName": "File C"};
window.fileD = { "fileName": "File D"};

$('#mainTab a').on('click', function(e) {
    e.preventDefault();
    $(this).tab('show');
})

// console.log("Libstart")

// Better in app.js:
// document.addEventListener("DOMContentLoaded", function() {
//    initlib();
// });

window.initlib = initlib
function initlib() {
    if (document.getElementById('file-a')) {
        document.getElementById('file-a').addEventListener('change', loadFileA, false);
    }
    if (document.getElementById('file-b')) {
        document.getElementById('file-b').addEventListener('change', loadFileB, false);
    }
    if (document.getElementById('file-c')) {
        document.getElementById('file-c').addEventListener('change', loadFileC, false);
    }
    if (document.getElementById('file-d')) {
        document.getElementById('file-d').addEventListener('change', loadFileD, false);
    }

    if (document.getElementById('link-a')) {
        document.getElementById('link-a').innerHTML = window.fileA.fileName
    }
    if (document.getElementById('file-a-text')) {
        document.getElementById('file-a-text').innerHTML = window.fileA.fileName
    }
    if (document.getElementById('link-b')) {
        document.getElementById('link-b').innerHTML = window.fileB.fileName
    }
    if (document.getElementById('file-b-text')) {
        document.getElementById('file-b-text').innerHTML = window.fileB.fileName
    }
    if (document.getElementById('link-c')) {
        document.getElementById('link-c').innerHTML = window.fileC.fileName
    }
    if (document.getElementById('file-c-text')) {
        document.getElementById('file-c-text').innerHTML = window.fileC.fileName
    }
    if (document.getElementById('link-d')) {
        document.getElementById('link-d').innerHTML = window.fileD.fileName
    }
    if (document.getElementById('file-d-text')) {
        document.getElementById('file-d-text').innerHTML = window.fileD.fileName
    }
}

function loadFileA(event){
    const reader = new FileReader();
    reader.onload = function (event) { window.fileA = event.target.result.replace(/\r\n/g, '\n');};
    reader.readAsText(event.target.files[0]);
}

function loadFileB(event){
    const reader = new FileReader();
    reader.onload = function (event) { window.fileB = event.target.result.replace(/\r\n/g, '\n');};
    reader.readAsText(event.target.files[0]);
}

function loadFileC(event){
    const reader = new FileReader();
    reader.onload = function (event) { window.fileC = event.target.result.replace(/\r\n/g, '\n');};
    reader.readAsText(event.target.files[0]);
}

function loadFileD(event){
    const reader = new FileReader();
    reader.onload = function (event) { window.fileD = event.target.result.replace(/\r\n/g, '\n');};
    reader.readAsText(event.target.files[0]);
}

window.parseBool = parseBool
function parseBool(value) {
    if ((value.toLowerCase() == "true") ||
        (value.toLowerCase() == "yes") ||
        (value.toLowerCase() == "y") ||
        (value.toLowerCase() == "1") ||
        (value.toLowerCase() == "j") ||
        (value.toLowerCase() == "w") ||
        (value.toLowerCase() == "wahr")) {
        return true;
    }
    return false;
}

window.readTable = readTable
function readTable(fileName, text, offset, rowIDpos, colSep, txtMark) {
    let tableCellData = [];
    let tableCellColor = [];
    let colLookup = {};
    let rowLookup = {};

    let fixNewlines = text.replace(/\n+$/g, '');
    let lines = fixNewlines.split("\n")

    for (let i = offset ; i < lines.length ; i++) {
        let tableCellDataLine = [];
        let tableCellColorLine = [];
        let cells = lines[i].split(colSep);
        for (let c = 0 ; c < cells.length ; c++) {
            tableCellDataLine.push(cells[c]);
            if (i == offset) {
                tableCellColorLine.push("#ffffff");
                colLookup[cells[c]] = c;
            } else {
                tableCellColorLine.push("#cccccc");
            }
            if (c == rowIDpos) {
                rowLookup[cells[c]] = i;
            }
        }
        tableCellData.push(tableCellDataLine);
        tableCellColor.push(tableCellColorLine);
    }

    let retFile = {
        "fileName": fileName,
        "dataCells": tableCellData,
        "colorCells": tableCellColor,
        "colLookup": colLookup,
        "rowLookup": rowLookup
    }
    return retFile
}

window.compTableFloatHeader = compTableFloatHeader
function compTableFloatHeader(tab, precis) {
    var keysA = Object.keys(tab.colLookup);
    var nKeys = {};
    for (var i = 0; i < keysA.length; i++) {
        if (keysA[i].indexOf('.') != -1) {
            tab.dataCells[0][tab.colLookup[keysA[i]]] = parseFloat(keysA[i]).toFixed(precis)
            nKeys[parseFloat(keysA[i]).toFixed(precis)] = tab.colLookup[keysA[i]]
        } else {
            nKeys[keysA[i]] = tab.colLookup[keysA[i]]
        }
    }
    tab.colLookup = nKeys
    return tab
}

window.showTable = showTable
function showTable(elem, tab) {
    let ret = '<table class="table table-bordered">\n'
    for (var row = 0; row < tab.dataCells.length; row++) {
        ret += '<tr>\n'
        for (var col = 0; col < tab.dataCells[row].length; col++) {
            ret += '<td style="background-color: ' + tab.colorCells[row][col] + ';">'
            ret += tab.dataCells[row][col] + '</td>\n'
        }
        ret += '</tr>\n'
    }
    ret += '</table>\n'
    document.getElementById(elem).innerHTML = ret
}

window.showHTable = showHTable
function showHTable(elem, tab) {
    let ret = '<table class="table table-bordered">\n'
    for (var row = -1; row < tab.dataCells.length; row++) {
        ret += '<tr>\n'
        if (row == -1)   {
            for (var col = 0; col < tab.dataCells[0].length; col++) {
                ret += '<td style="background-color: #ffffff;">'
                ret += (col + 1) + '</td>\n'
            }
        } else {
            for (var col = 0; col < tab.dataCells[row].length; col++) {
                ret += '<td style="background-color: ' + tab.colorCells[row][col] + ';">'
                ret += tab.dataCells[row][col] + '</td>\n'
            }
        }
        ret += '</tr>\n'
    }
    ret += '</table>\n'
    document.getElementById(elem).innerHTML = ret
}

window.eraseColumn = eraseColumn
function eraseColumn(tab, colList) {
    let headerList = colList.split(";")
    for (var hd = 0; hd < headerList.length; hd++) {
        let foundHd = -1;
        for (var col = 0; col < tab.dataCells[0].length; col++) {
            if (tab.dataCells[0][col] == headerList[hd]) {
                foundHd = col;
                break;
            }
        }
        for (var row = 1; row < tab.dataCells.length; row++) {
            tab.dataCells[row][foundHd] = "--del--"
        }
    }
    return tab
}

window.replaceValues = replaceValues
function replaceValues(tab, oVal, nVal) {
    for (var row = 1; row < tab.dataCells.length; row++) {
        for (var col = 0; col < tab.dataCells[row].length; col++) {
            if (tab.dataCells[row][col] == oVal) {
                tab.dataCells[row][col] = nVal
            }
        }
    }
    return tab
}

window.replaceColValues = replaceColValues
function replaceColValues(tab, col, oVal, nVal) {
    for (var row = 1; row < tab.dataCells.length; row++) {
        if (parseFloat(tab.dataCells[row][col]) - parseFloat(oVal) < 0.000000000001) {
            tab.dataCells[row][col] = nVal
        }
    }
    return tab
}

window.compSameTable = compSameTable
function compSameTable(tabA, tabB) {
    let minRows = Math.min(tabA.dataCells.length, tabB.dataCells.length);
    let diffText = "";
    for (var row = 1; row < minRows; row++) {
        let minCols = Math.min(tabA.dataCells[row].length, tabB.dataCells[row].length);
        for (var col = 0; col < minCols; col++) {
            let ret = compString(tabA.dataCells[row][col], tabB.dataCells[row][col]);
            diffText += evalResult(tabA, row, col, tabB, row, col, ret, "head", "");
        }
    }
    return diffText
}

window.compTableExtraCol = compTableExtraCol
function compTableExtraCol(tabA, tabB) {
    var keysA = Object.keys(tabA.colLookup);
    var commonKeys = [];
    for (var i = 0; i < keysA.length; i++) {
        if (keysA[i] in tabB.colLookup) {
            commonKeys.push(keysA[i])
        }
    }
    let minRows = Math.min(tabA.dataCells.length, tabB.dataCells.length);
    let diffText = "";
    for (var row = 1; row < minRows; row++) {
        for (var i = 0; i < commonKeys.length; i++) {
            let ret = compString(tabA.dataCells[row][tabA.colLookup[commonKeys[i]]], tabB.dataCells[row][tabB.colLookup[commonKeys[i]]]);
            diffText += evalResult(tabA, row, tabA.colLookup[commonKeys[i]], tabB, row, tabB.colLookup[commonKeys[i]], ret, "head", "");
        }
    }
    return diffText
}

window.compTableExtraColFloat = compTableExtraColFloat
function compTableExtraColFloat(tabA, tabB, precis) {
    var keysA = Object.keys(tabA.colLookup);
    var commonKeys = [];
    for (var i = 0; i < keysA.length; i++) {
        if (keysA[i] in tabB.colLookup) {
            commonKeys.push(keysA[i])
        }
    }
    let minRows = Math.min(tabA.dataCells.length, tabB.dataCells.length);
    let diffText = "";
    for (var row = 1; row < minRows; row++) {
        for (var i = 0; i < commonKeys.length; i++) {
                // compFloat(varA, comA, varB, comB, precis)
            let ret = compFloat(tabA.dataCells[row][tabA.colLookup[commonKeys[i]]], false, tabB.dataCells[row][tabB.colLookup[commonKeys[i]]], false, precis);
            diffText += evalResult(tabA, row, tabA.colLookup[commonKeys[i]], tabB, row, tabB.colLookup[commonKeys[i]], ret, "head", "");
        }
    }
    return diffText
}

window.compTableExtraColExpoFloat = compTableExtraColExpoFloat
function compTableExtraColExpoFloat(tabA, tabB, precis) {
    var keysA = Object.keys(tabA.colLookup);
    var commonKeys = [];
    for (var i = 0; i < keysA.length; i++) {
        if (keysA[i] in tabB.colLookup) {
            commonKeys.push(keysA[i])
        }
    }
    let minRows = Math.min(tabA.dataCells.length, tabB.dataCells.length);
    let diffText = "";
    for (var row = 1; row < minRows; row++) {
        for (var i = 0; i < commonKeys.length; i++) {
                // compFloat(varA, comA, varB, comB, precis)
            let ret = compFloatExp(tabA.dataCells[row][tabA.colLookup[commonKeys[i]]], false, tabB.dataCells[row][tabB.colLookup[commonKeys[i]]], false, precis);
            diffText += evalResult(tabA, row, tabA.colLookup[commonKeys[i]], tabB, row, tabB.colLookup[commonKeys[i]], ret, "head", "");
        }
    }
    return diffText
}

window.compTableEqSize = compTableEqSize
function compTableEqSize(tabA, tabB, lineCompFunct) {
    let minRows = Math.min(tabA.dataCells.length, tabB.dataCells.length);
    let diffText = "";
    for (var row = 1; row < minRows; row++) {
        diffText += lineCompFunct(tabA, row, tabB, row);
    }
    return diffText
}

window.compFloat = compFloat
function compFloat(varA, comA, varB, comB, precis) {
    if (!(varA) || !(varB)) {
        return "u"
    }

    if ((varA.toLowerCase() == "nan") && (varB.toLowerCase() == "nan")) {
        return "e";
    }

    if (comA) {
        varA = varA.replace(/,/g, '.');
    }
    if (comB) {
        varB = varB.replace(/,/g, '.');
    }

    if (varA == varB) {
        return "e";
    }

    let flA = parseFloat(varA);
    let flB = parseFloat(varB);
    let pre = Math.pow(10, parseFloat(precis));
    if (Math.abs(flA - flB) < pre) {
        return "a";
    }

    return "u"
}

window.compFloatExp = compFloatExp
function compFloatExp(varA, comA, varB, comB, precis) {
    if (!(varA) || !(varB)) {
        return "u"
    }

    if ((varA.toLowerCase() == "nan") && (varB.toLowerCase() == "nan")) {
        return "e";
    }

    varA = varA.replace(/E/g, 'e');
    varB = varB.replace(/E/g, 'e');

    let isExp = /e/;
    if (!isExp.test(varA) || !isExp.test(varB)) {
        return (compFloat(varA, comA, varB, comB, precis))
    }

    if (comA) {
        varA = varA.replace(/,/g, '.');
    }
    if (comB) {
        varB = varB.replace(/,/g, '.');
    }

    if (varA == varB) {
        return "e";
    }

    let arrA = varA.split("e")
    let arrB = varB.split("e")

    if (parseInt(arrA[1]) != parseInt(arrB[1])){
        return "u";
    }


    let flA = parseFloat(arrA[0]);
    let flB = parseFloat(arrB[0]);
    let pre = Math.pow(10, precis);

    if (Math.abs(flA - flB) < pre) {
        return "a";
    }

    return "u"
}

window.compInt = compInt
function compInt(varA, varB) {
    if (!(varA) || !(varB)) {
        return "u"
    }

    if (varA == varB) {
        return "e";
    }

    let flA = parseInt(varA);
    let flB = parseInt(varB);

    if (flA == flB) {
        return "e";
    }

    return "u"
}

window.compString = compString
function compString(varA, varB) {
    if ((varA == "") && (varB == "")) {
        return "e"
    }

    if (!(varA) || !(varB)) {
        return "u"
    }

    if (varA == varB) {
        return "e";
    }

    return "u"
}

window.testArrayRange = testArrayRange
function testArrayRange(tab, row, col) {
    if (row >= tab.dataCells.length) {
        return true
    }
    if (col >= tab.dataCells[row].length) {
        return true
    }
    return false
}



window.evalResult = evalResult
function evalResult(tabA, rowA, colA, tabB, rowB, colB, ret, form, rowID) {
    if ((testArrayRange(tabA, rowA, colA)) && (testArrayRange(tabB, rowB, colB))) {
        return tabA.fileName + " row " + rowA + " column " + colA + " and " + tabB.fileName + " row " + rowB + " column " + colB + " do not exist!\n";
    }
    if (testArrayRange(tabA, rowA, colA)) {
        tabB.colorCells[rowB][colB] = "#ff0000";
        return tabA.fileName + " row " + rowA + " column " + colA + " does not exist!\n";
    }
    if (testArrayRange(tabB, rowB, colB)) {
        tabA.colorCells[rowA][colA] = "#ff0000"
        return tabB.fileName + " row " + rowB + " column " + colB + " does not exist!\n";
    }

    if (ret == "u") {
        let retStr = ""
        tabA.colorCells[rowA][colA] = "#ff0000";
        tabB.colorCells[rowB][colB] = "#ff0000";
        if (form == "head") {
            retStr = "Difference between " + tabA.fileName + " row " + rowA + " column \"";
            retStr += tabA.dataCells[0][colA] + "\" (" + colA + ") and " + tabB.fileName + " row " + rowB;
            retStr += " column \"" + tabB.dataCells[0][colB] + "\" (" + colB + "):\n"
        } else {
            retStr = "Difference between " + tabA.fileName + " row " + rowA + " column " + colA;
            retStr += " and " + tabB.fileName + " row " + rowB + " column " + colB + ":\n"
        }
        retStr += tabA.dataCells[rowA][colA] + "\n"
        retStr += tabB.dataCells[rowB][colB] + "\n"
        return retStr
    }
    if (ret == "a") {
        tabA.colorCells[rowA][colA] = "#00cc00";
        tabB.colorCells[rowB][colB] = "#00cc00";
        return ""
    }
    if (ret == "e") {
        tabA.colorCells[rowA][colA] = "#009900";
        tabB.colorCells[rowB][colB] = "#009900";
        return ""
    }

    return ""
}
