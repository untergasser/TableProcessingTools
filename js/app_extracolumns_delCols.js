"use strict";

const submitButton = document.getElementById('btn-submit')
submitButton.addEventListener('click', runDiff)

const remHeadA = document.getElementById('remHeadA')

const remHeadB = document.getElementById('remHeadB')

document.addEventListener("DOMContentLoaded", function() {
    window.fileA = { "fileName": "File (A)"};
    window.fileB = { "fileName": "File (B)"};
    initlib();
});

function runDiff() {
    var tableA = readTable("File (A)", window.fileA, 0, 0, "\t", '"');
    var tableB = readTable("File (B)", window.fileB, 0, 0, "\t", '"');


    tableA = eraseColumn(tableA, remHeadA.value);
    tableB = eraseColumn(tableB, remHeadB.value);

    var ret = compTableExtraCol(tableA, tableB);

    showHTable("a-data", tableA);
    showHTable("b-data", tableB);

    if (ret == "") {
        ret = "No difference found!!!"
    }

    document.getElementById("dif-data").innerHTML = "<p>" + ret.replace(/\n/g, '<br>') + "</p>"
    $('[href="#dif-tab"]').tab('show')
}

