'use strict';

// CSV upload : https://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/
function handleFiles(files) {
  if (window.FileReader) {  // Check for the various File API support.
    getAsText(files[0]);    // FileReader is supported.
  } else {
    alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();

  reader.readAsText(fileToRead);  // Read file into memory as UTF-8

  reader.onload = loadHandler;    // Load
  reader.onerror = errorHandler;  // Error handling
}

function loadHandler(event) {
  var csv = event.target.result;
  var data = processData(csv);
  setConsoleText(data);
}

function processData(csv) {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];
  var text;
  for (var i=0; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    var textArray = [];
    for (var j=0; j<data.length; j++) {
        textArray.push(data[j]);
    }
    // text = textArray+'\n';
    // if(text.startsWith(",")){
      // text.splice(0, 1);
    // }
    lines.push(textArray);
  }
  return lines;
}

function errorHandler(ev) {
  if(ev.target.error.name == "NotReadableError") {
    alert("Cannot read file!");
    clearConsoleText();
  }
}

// read CSV file and display as table
// https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-jaascript--cms-25626
function successFunction(data){

  var allRows = data.trim().split(/\s*\r?\n+|\s*\r+\n?/);
  var table = '<table class="table table-responsive table-striped table-hover">';

  for(var singleRow=0; singleRow<allRows.length; singleRow++){
    if(singleRow===0){
      table+= '<thead>';
      table+= '<tr>';
    }
    if(singleRow===1){
      table+= '<tbody>';
      table+= '<tr>';
    }
    else{
      table+= '<tr>';
    }
    var rowCells = allRows[singleRow].trim().split(',');
    for(var rowCell=0; rowCell<rowCells.length; rowCell++){
      var content = trimQuotes(rowCells[rowCell]);

      if(singleRow===0){
        table+= '<th>';
        table+= content;
        table+= '</th>';
      }
      else{
        table+= '<td>';
        table+= content;
        table+= '</td>';
      }
    }

    if(singleRow===0){
      table+= '</tr>';
      table+= '</thead>';
    }
    else{
      table+= '</tr>';
    }
  }
  table+= '</tbody>';
  table+= '</table>';

  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');
  div.innerHTML = table;

  if(allRows.length === 1){
    var msg = '<p class="well">Table is empty.</p>';
    div.innerHTML = msg;
  }

  $('#main').html(div);
}


function readCSV(filePath){
  $.ajax({
    url: filePath,
    dataType: 'text'
  }).done(successFunction);
}

function showHome(){
  var home = '<div class="page-header"><h3>aDB: A single-user prototype DBMS</h3></div><p>Click on the table names on the right to view their contents.</p><p>Execute your SQL query below on the console.</p><p>Import files from the upper right-hand corner.</p>';
  $('#main').html(home);
}

function trimQuotes(text){
  if (text.charAt(0) === '"'){
    text = text.substr(1)
  }
  if(text.charAt(text.length-1) === '"'){
    text = text.substr(0, text.length-1);
  }
  return text;
}
