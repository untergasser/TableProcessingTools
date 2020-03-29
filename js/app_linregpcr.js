"use strict";

const submitButton = document.getElementById('btn-submit')
submitButton.addEventListener('click', runDiff)

const choiceExcludeNoPlat = document.getElementById('choiceExcludeNoPlateau')

const choiceExcludeEff = document.getElementById('choiceExcludeEfficiency')

document.addEventListener("DOMContentLoaded", function() {
    window.fileA = { "fileName": "Pascal (A)"};
    window.fileB = { "fileName": "Python (B)"};
    initlib();
});

function runDiff() {
    var tableA = readTable("Pascal (A)", window.fileA, 3, 0, ",", '"');
    var tableB = readTable("Python (B)", window.fileB, 0, 0, "\t", '"');

    tableA = replaceColValues(tableA, 5, "-9.99", "nan");
    tableA = replaceColValues(tableA, 6, "1.0", "nan");
    tableA = replaceColValues(tableA, 7, "0.0", "nan");
    tableA = replaceColValues(tableA, 9, "-1.0", "nan");
    tableA = replaceColValues(tableA, 9, "0.0", "nan");
    tableA = replaceColValues(tableA, 14, "-9.99", "nan");

    var ret = compTableEqSize(tableA, tableB, lineCompLinRegPCR);

    showHTable("a-data", tableA);
    showHTable("b-data", tableB);

    if (ret == "") {
        ret = "No difference found!!!"
    }

    document.getElementById("dif-data").innerHTML = "<p>" + ret.replace(/\n/g, '<br>') + "</p>"
    $('[href="#dif-tab"]').tab('show')
}

function lineCompLinRegPCR(tabA, rowA, tabB, rowB) {
    let diff = ""
    let parShift = 0;
    let platShift = true;
    let effShift = true;
    if ((choiceExcludeNoPlat.value == "y") && (choiceExcludeEff.value == "n")) {
        parShift = 8;
        effShift = false;
    }
    if ((choiceExcludeNoPlat.value == "n") && (choiceExcludeEff.value == "y")) {
        parShift = 4;
        platShift = false;
    }
    if ((choiceExcludeNoPlat.value == "n") && (choiceExcludeEff.value == "n")) {
        parShift = 12;
        effShift = false;
        platShift = false;
    }

    let ret = compFloat(tabA.dataCells[rowA][10], true, tabB.dataCells[rowB][8], false, -12);
    diff += evalResult(tabA, rowA, 10, tabB, rowB, 8, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][2], true, tabB.dataCells[rowB][9], false, -12);
    diff += evalResult(tabA, rowA, 2, tabB, rowB, 9, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][3], true, tabB.dataCells[rowB][10], false, -12);
    diff += evalResult(tabA, rowA, 3, tabB, rowB, 10, ret, "head", "");

    ret = compTarget(tabA.dataCells[rowA][11], tabB.dataCells[rowB][5]);
    diff += evalResult(tabA, rowA, 11, tabB, rowB, 5, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][8], true, tabB.dataCells[rowB][11], false, -12);
    diff += evalResult(tabA, rowA, 8, tabB, rowB, 11, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][6], true, tabB.dataCells[rowB][18], false, -12);
    diff += evalResult(tabA, rowA, 6, tabB, rowB, 18, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][7], true, tabB.dataCells[rowB][19], false, -12);
    diff += evalResult(tabA, rowA, 7, tabB, rowB, 19, ret, "head", "");

    ret = compInt(tabA.dataCells[rowA][4], tabB.dataCells[rowB][15]);
    diff += evalResult(tabA, rowA, 4, tabB, rowB, 15, ret, "head", "");

    ret = compFloatExp(tabA.dataCells[rowA][5], true, tabB.dataCells[rowB][20], false, -12);
    diff += evalResult(tabA, rowA, 5, tabB, rowB, 20, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][9], true, tabB.dataCells[rowB][26 + parShift], false, -12);
    diff += evalResult(tabA, rowA, 9, tabB, rowB, 26 + parShift, ret, "head", "");

    ret = compFloat(tabA.dataCells[rowA][12], true, tabB.dataCells[rowB][23 + parShift], false, -12);
    diff += evalResult(tabA, rowA, 12, tabB, rowB, 23 + parShift, ret, "head", "");

    ret = compFloatExp(tabA.dataCells[rowA][14], true, tabB.dataCells[rowB][25 + parShift], false, -12);
    diff += evalResult(tabA, rowA, 14, tabB, rowB, 25 + parShift, ret, "head", "");

    ret = compLinRegPCRInvUse(tabA.dataCells[rowA][16], 1, tabB.dataCells[rowB][39]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 39, ret, "head", "");

    ret = compLinRegPCRUse(tabA.dataCells[rowA][16], 2, tabB.dataCells[rowB][40]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 40, ret, "head", "");

    ret = compLinRegPCRInvUse(tabA.dataCells[rowA][16], 3, tabB.dataCells[rowB][41]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 41, ret, "head", "");

    ret = compLinRegPCRUse(tabA.dataCells[rowA][16], 4, tabB.dataCells[rowB][42]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 42, ret, "head", "");
    if (platShift) {
        ret = compLinRegPCRUse(tabA.dataCells[rowA][16], 5, tabB.dataCells[rowB][43]);
        diff += evalResult(tabA, rowA, 16, tabB, rowB, 43, ret, "head", "");
    } else {
        ret = compLinRegPCRUse(tabA.dataCells[rowA][16], 5, tabB.dataCells[rowB][44]);
        diff += evalResult(tabA, rowA, 16, tabB, rowB, 44, ret, "head", "");
    }

    ret = compLinRegPCRUse(tabA.dataCells[rowA][16], "A", tabB.dataCells[rowB][47]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 47, ret, "head", "");

    ret = compLinRegPCRUse(tabA.dataCells[rowA][16], "B", tabB.dataCells[rowB][48]);
    diff += evalResult(tabA, rowA, 16, tabB, rowB, 48, ret, "head", "");



    // Check used "1"
    ret = compLinRegPCRUse(tabA.dataCells[rowA][15], 1, tabB.dataCells[rowB][49]);
    diff += evalResult(tabA, rowA, 15, tabB, rowB, 49, ret, "head", "");


    // Check used "2"
    let regEx2 = new RegExp(2,"g");
    let sumUp = false;
    let AA = "";
    let BB = "";
    let CC = "";
    let DD = "";
    let EE = "";
    let FF = "";
    if (!(parseBool(tabB.dataCells[rowB][39]))){
        sumUp = true;
        AA = " (difference!!)"
    }
    if (parseBool(tabB.dataCells[rowB][40])){
        sumUp = true;
        BB = " (difference!!)"
    }
    if (parseBool(tabB.dataCells[rowB][42])){
        sumUp = true;
        FF = " (difference!!)"
    }
    if (parseFloat(tabB.dataCells[rowB][18]) < 1.001){
        sumUp = true;
        CC = " (difference!!)"
    }
    if (platShift) {
        if (!effShift && parseBool(tabB.dataCells[rowB][43])){
            sumUp = true;
            EE = " (difference!!)"
        }
    } else {
        if (!(parseBool(tabB.dataCells[rowB][41]))){
            sumUp = true;
            DD = " (difference!!)"
        }
        if (!effShift && parseBool(tabB.dataCells[rowB][44])){
            sumUp = true;
            EE = " (difference!!)"
        }
    }
    if (regEx2.test(tabA.dataCells[rowA][15]) == sumUp) {
        diff += "String check (2) between " + tabA.fileName + " row " + rowA + " column \"";
        diff += tabA.dataCells[0][15] + "\" (15) and " + tabB.fileName + " row " + rowB;
        diff += " " + tabB.dataCells[rowB][1] + ":\n"
        diff += tabA.dataCells[0][15] + ": " + tabA.dataCells[rowA][15] + "\n"
        diff += regEx2.test(tabA.dataCells[rowA][15]) + ": " + !sumUp + "\n"
        diff += tabB.dataCells[0][39] + ": " + tabB.dataCells[rowB][39] + AA + "\n"
        diff += tabB.dataCells[0][40] + ": " + tabB.dataCells[rowB][40] + BB + "\n"
        diff += tabB.dataCells[0][18] + ": " + tabB.dataCells[rowB][18] + CC + "\n"
        diff += tabB.dataCells[0][41] + ": " + tabB.dataCells[rowB][41] + DD + "\n"
        diff += tabB.dataCells[0][42] + ": " + tabB.dataCells[rowB][42] + FF + "\n"
        if (platShift) {
            diff += tabB.dataCells[0][43] + ": " + tabB.dataCells[rowB][43] + EE +"\n"
        } else {
            diff += tabB.dataCells[0][44] + ": " + tabB.dataCells[rowB][44] + EE +"\n"
        }
    }

    // Check used "3"
    let regEx3 = new RegExp(3,"g");
    sumUp = false;
    let AAA = "";
    let BBB = "";
    let CCC = "";
    if (!(parseBool(tabB.dataCells[rowB][39]))){
        sumUp = true;
        AAA = " (difference!!)"
    }
    if (parseBool(tabB.dataCells[rowB][40])){
        sumUp = true;
        BBB = " (difference!!)"
    }
    if (platShift) {
        if (!(parseBool(tabB.dataCells[rowB][41])) && parseBool(tabB.dataCells[rowB][43])){
            sumUp = true;
            CCC = " (difference!!)"
        }
    } else {
        if (!(parseBool(tabB.dataCells[rowB][41])) && parseBool(tabB.dataCells[rowB][44])){
            sumUp = true;
            CCC = " (difference!!)"
        }
    }
    if (regEx3.test(tabA.dataCells[rowA][15]) == sumUp) {
        diff += "String check (3) between " + tabA.fileName + " row " + rowA + " column \"";
        diff += tabA.dataCells[0][15] + "\" (15) and " + tabB.fileName + " row " + rowB;
        diff += ":\n"
        diff += tabA.dataCells[0][15] + ": " + tabA.dataCells[rowA][15] + "\n"
        diff += tabB.dataCells[0][39] + ": " + tabB.dataCells[rowB][39] + AAA +"\n"
        diff += tabB.dataCells[0][40] + ": " + tabB.dataCells[rowB][40] + BBB + "\n"
        diff += tabB.dataCells[0][41] + ": " + tabB.dataCells[rowB][41] + CCC + "\n"
        if (platShift) {
            diff += tabB.dataCells[0][43] + ": " + tabB.dataCells[rowB][43] + CCC + "\n"
        } else {
            diff += tabB.dataCells[0][44] + ": " + tabB.dataCells[rowB][44] + CCC + "\n"
        }
    }

    return diff;
}


window.compLinRegPCRUse = compLinRegPCRUse
function compLinRegPCRUse(varA, numb, varB) {
    let isExp = new RegExp(numb,"g");
    if (isExp.test(varA) == (parseBool(varB))) {
        return "e";
    }
    return "u"
}

window.compLinRegPCRInvUse = compLinRegPCRInvUse
function compLinRegPCRInvUse(varA, numb, varB) {
    let isExp = new RegExp(numb,"g");
    if (isExp.test(varA) == (!(parseBool(varB)))) {
        return "e";
    }
    return "u"
}


window.compTarget = compTarget
function compTarget(varA, varB) {
    if (!(varA) || !(varB)) {
        return "u"
    }

    if (varA == varB) {
        return "e";
    }

    if (varA == "not_named") {
        return "e";
    }

    return "u"
}

