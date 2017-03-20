'use strict';

var tableToImport = '';

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
  csv = csv.trim();

  // parse csv string
  var data = csvToArray(csv);
  // console.log(data);

  // build field string
  var fields = [];
  for(var field of tableToImport.fields){
    fields.push(field.name);
  }

  // get first line of imported data
  var dataHeader = data[0].join(',');
  var tableHeader = fields.join(',');

  if(dataHeader === tableHeader){
    data.splice(0, 1);
  }

  // console.log(data);
  data = validate(data);
}

function errorHandler(ev) {
  if(ev.target.error.name == "NotReadableError") {
    alert("Cannot read file!");
    clearConsoleText();
  }
}

// read CSV file and display as table
// https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-jaascript--cms-25626
function csvToArray(csvStr){

  var data = [];
  var row, rowCells, content;

  var allRows = csvStr.trim().split(/\s*\r?\n+|\s*\r+\n?/);

  for(var singleRow=0; singleRow<allRows.length; singleRow++){
    row = [];

    rowCells = allRows[singleRow].trim().split(',');

    for(var rowCell=0; rowCell<rowCells.length; rowCell++){
      content = trimQuotes(rowCells[rowCell]);
      if(!isNaN(content)){
        content = parseInt(content);
      }
      row.push(content);
    }

    data.push(row);
  }
  return data;
}

function readCSV(filePath){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: filePath,
      dataType: 'text'
    })
    .then(
          (data) => {
            var array = csvToArray(data);
            resolve(array);
          },
          (error) => {
            reject(error);
          });
  });
}

function buildView(data){
  var table = '<table class="table table-responsive table-striped table-hover">';

  for(var row=0; row<data.length; row++){
    if(row===0){
      table+= '<thead> <tr>';
    }
    if(row===1){
      table+= '<tbody> <tr>';
    }
    else{
      table+= '<tr>';
    }

    for(var cell=0; cell<data[row].length; cell++){
      var content = trimQuotes(data[row][cell]);

      if(row===0){
        table+= '<th>' + content + '</th>';
      }
      else{
        table+= '<td>' + content + '</td>';
      }
    }

    if(row===0){
      table+= '</tr> </thead>';
    }
    else{
      table+= '</tr>';
    }
  }
  table+= '</tbody> </table>';

  return table;
}

function displayTable(filePath){

  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');

  readCSV(filePath)
    .then(
          (data) => {
            // console.log(data);
            var table = buildView(data);

            div.innerHTML = table;

            if(data.length === 1){
              var msg = '<p class="well">Table is empty.</p>';
              div.innerHTML = msg;
            }
            else{
              // remove headers
              data.splice(0, 1);

              $('#main').html(div);
              $('#main table').DataTable({
                data: data,
                paging: true,
                ordering: true,
                searching: true,
                lengthChange: true,
                lengthMenu: [
                  [10, 25, 50, 100, 1000, 10000, -1],    // data per page
                  [10, 25, 50, 100, 1000, 10000, "All"]  // label
                ],
                orderMulti: true,
                scrollY: "300px", // needed for fixed header
                fixedHeader: {
                  header: true,
                  footer: false
                },
                search: {
                  caseInsensitive: true,
                  regex: true
                },
                scrollCollapse: true,
              });
            }
          },
          (error) => {
            // console.log(error);
            var msg = '<p class="alert alert-danger">Oops something went wrong.</p>';
            div.innerHTML = msg;

            $('#main').html(div);
          });
}

function showHome(){
  var home = '<div class="page-header"><h3>aDB: A single-user prototype DBMS</h3></div><p>Click on the table names on the right to view their contents.</p><p>Execute your SQL query below on the console.</p><p>Import files from the upper right-hand corner.</p>';
  $('#main').html(home);
}

function trimQuotes(text){
  if (text && text.toString().charAt(0) === '"'){
    text = text.substr(1);
  }
  if(text && text.toString().charAt(text.length-1) === '"'){
    text = text.substr(0, text.length-1);
  }
  return text;
}

function setTableToImport(table){
  // console.log(table);
  $("#csvFileInput").prop('disabled', false);
  $('#csvFileInput').trigger('click');
  tableToImport = table;
}

function validate(data){
  var fields = tableToImport.fields;
  var required = tableToImport.required;

  // set corresponding indices of columns
  for(var i=0; i<fields.length; i++){
    fields[i].index = i;
  }

  for(var i=0; i<required.length; i++){
    for(var j=0; j<fields.length; j++){
      if(required[i] === fields[j].name){
        required[i] = fields[j];
        break;
      }
    }
  }

  var query = {};

  for(var row=0; row<data.length; row++){

    // console.log(data[row]);
    // console.log(fields);

    if(data[row].length < fields.length){
      alert('Expected number of values not met by given data');
      return;
    }
    else{
      // all columns have some value, even ''

      // check if required indices have value
      for(var req of required){
        var index = req.index;
        if(data[row][index] === undefined ||
           data[row][index] === null ||
           data[row][index].length === 0){

          alert('Missing value for required column: '+req);
          return;
        }
      }

      // at this point all required fields of the entry exists but not validated
      query = {
        tablename: tableToImport.name,
        values: {}
      };

      // validate expected formats, data types while building query object
      for(var field of fields){

        var value = data[row][field.index];

        // validate type
        switch(field.type){
          case 'number':
            value = parseFloat(value);
            if(typeof value !== 'number'){
              alert('Unexpected '+(typeof value)+' type for: '+field.name);
              return;
            }
          break;
          case 'string':
            if(typeof value !== 'string'){
              alert('Unexpected '+(typeof value)+' type for: '+field.name);
              return;
            }
          break;
          case 'enum':
            switch(field.enumType){
              case 'sem':
              if(field.possibleValues.indexOf(value) < 0){
                alert('Unexpected enum value for: '+field.name);
                return;
              }
              break;
            }
          break;
        }

        // validate format
        if(field.format){
          // specific format exists
          if(!isValidFormat(field.format, value)){
            alert('Invalid format for value: '+value+' at column: '+field.name);
            return;
          }
          else{
            // value follows expected format
            switch(field.type){
              case 'number':
                value = parseInt(value, 10);
              break;
              case 'string':
                // trim value to MAX chars
                value = value.substr(0,max.string);
              break;
            }
          }
        }

        // append to query object
        query.values[field.name] = value;
      }

      // console.log(query);
      // at this point query object is ready for insert
      executeInsert(query);

    }
  }
}

function isValidFormat(format, value){
  value = value.toString();
  format = '^'+format+'$';

  var regex = new RegExp(format, 'g');
  return value.match(regex);
}
