'use strict';

function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
      // FileReader are supported.
      getAsText(files[0]);
  } else {
      alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
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
  var table = '<table class="table-responsive table table-striped table-hover">';

  for(var singleRow=0; singleRow<allRows.length; singleRow++){
    if(singleRow===0){
      table+= '<thead>';
      table+= '<tr>';
    }
    else{
      table+= '<tr>';
    }
    var rowCells = allRows[singleRow].trim().split(',');
    for(var rowCell=0; rowCell<rowCells.length; rowCell++){
      if(singleRow===0){
        table+= '<th>';
        table+= rowCells[rowCell];
        table+= '</th>';
      }
      else{
        table+= '<td>';
        table+= rowCells[rowCell];
        table+= '</td>';
      }
    }

    if(singleRow===0){
      table+= '</tr>';
      table+= '</thead>';
      table+= '<tbody>';
    }
    else{
      table+= '</tr>';
    }
  }
  table+= '</tbody>';
  table+= '</table></div>';

  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');
  div.innerHTML = table;


  if(allRows.length === 1){
    var msg = '<p class="well">Table is empty.</p>';
    div.innerHTML = msg;
  }

  $('#main').html(div);
}


function readCSV(tablename){
  $.ajax({
    url: 'tables/'+tablename+'.csv',
    dataType: 'text'
  }).done(successFunction);
}
