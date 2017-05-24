'use strict';

function parse(){
  var text = getConsoleText();

  console.log('got: ');
  console.log(text);

  if(!text.length){
    return;
  }

  var multiline = true;
  var lines = text.trim().split('\n');
  var query = lines[0];
  var parsed = {};
  var hasErr = false;
  var result = '';
  var results = { hasErr: hasErr, msg: ''  };
  var msg = '<p class="alert alert-success">All queries done succesfully.</p>';

  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');

  for(var i=0; i<lines.length && !hasErr; i++){
    query = lines[i];

    while(!hasErr && multiline && i<lines.length){ // assume query might be multiline
      if(!lines[i].trim().toLowerCase().startsWith('insert') &&
         !lines[i].trim().toLowerCase().startsWith('select')){
        query += lines[++i];
      }
      else{
        break; // start handling the built query
      }
    }

    if(i>=lines.length){
      msg = '<p class="alert alert-danger">Oops something went wrong.</p>';
      break;
    }

    if(!hasErr && query.trim().toLowerCase().startsWith('insert')){
      parsed = parseInsert(query);
      if(!parsed){
        return;
      }
      else{
        tableToImport = tables[parsed['tablename'].toLowerCase()];

        var dataArr = jsonToArr(parsed);

        parsed = validate([dataArr]);
        // result = executeInsert(parsed);

        if(parsed){
          $('#main').append(div);
        }
        else{
          msg = '<p class="alert alert-danger">Oops something went wrong.</p>';
          break;
        }
      }
    }

    if(!hasErr && query.trim().toLowerCase().startsWith('select')){
      parsed = parseSelect(query);

      if(!parsed){
        return;
      }
      else{
        console.log(parsed);
        executeSelect(parsed);
      }
    }

    query = '';
    parsed = '';
    result = '';
  }

  div.innerHTML = msg;
  $('#main').html(div);
}

function arrayToJson(data){
  var json = [];

  for(var row=1; row<data.length; row++){
    var item = {};
    for(var cell=0; cell<data[row].length; cell++){
      item[data[0][cell]] = data[row][cell]
    }
    json.push(item);
  }

  return json;
}

function executeSelect(query){
  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');

  var file = tables[query.tablename].path;
  console.log(file);

  // console.log(file);             // ---- undefined when select * from student;

  // get from file
  readCSV(file)
    .then(
          (data) => {
            var headers = data[0];
            data = arrayToJson(data);

            console.log(data);

            // filter data
            var whereCol = Object.keys(query.where)[0];
            var whereVal = whereCol ? query.where[whereCol] : null;
            var whereOp = whereCol ? query.operator : null;

            // filter by where
            var result = [];
            if(whereCol){
              for(var i=0; i<data.length; i++){
                for(var i=0; i<data.length; i++){
                  console.log(data[i][whereCol] + '==' + whereVal);
                  switch(whereOp){
                    case '=':
                      if(moment(whereVal, "YYYY-MM-DD", true).isValid() ||
                         moment(whereVal, "HH:mm", true).isValid()){

                        if(moment(data[i][whereCol]).isSame(whereVal)){
                          result.push(data[i]);
                        }
                      }
                      else if(data[i][whereCol] === whereVal){
                        result.push(data[i]);
                      }
                    break;
                    case '>':
                      if(moment(whereVal, "YYYY-MM-DD", true).isValid() ||
                         moment(whereVal, "HH:mm", true).isValid()){

                        if(moment(data[i][whereCol]).isAfter(whereVal)){
                          result.push(data[i]);
                        }
                      }
                      else if(data[i][whereCol] > whereVal){
                        result.push(data[i]);
                      }
                    break;
                    case '<':
                      if(moment(whereVal, "YYYY-MM-DD", true).isValid() ||
                         moment(whereVal, "HH:mm", true).isValid()){

                        if(!moment(data[i][whereCol]).isSameOrAfter(whereVal)){
                          result.push(data[i]);
                        }
                      }
                      else if(data[i][whereCol] < whereVal){
                        result.push(data[i]);
                      }
                    break;
                    case '>=':
                      if(moment(whereVal, "YYYY-MM-DD", true).isValid() ||
                         moment(whereVal, "HH:mm", true).isValid()){

                        if(moment(data[i][whereCol]).isSameOrAfter(whereVal)){
                          result.push(data[i]);
                        }
                      }
                      else if(data[i][whereCol] >= whereVal){
                        result.push(data[i]);
                      }
                    break;
                    case '<=':
                      if(moment(whereVal, "YYYY-MM-DD", true).isValid() ||
                         moment(whereVal, "HH:mm", true).isValid()){

                        if(!moment(data[i][whereCol]).isAfter(whereVal)){
                          result.push(data[i]);
                        }
                      }
                      else if(data[i][whereCol] <= whereVal){
                        result.push(data[i]);
                      }
                    break;
                    case 'LIKE':
                    console.log('do something');
                    break;
                  }
                }
              }
            }
            else{
              result = data;
            }

            // filter by column
            var row;
            data = [query.select];
            for(var i=0; i<result.length; i++){
              row = [];
              for(var j=0; j<query.select.length; j++){
                row.push(result[i][query.select[j]]);
              }
              data.push(row);
            }

            var table = buildView(data);
            div.innerHTML = table;

            if(data.length === 1){
              var msg = '<p class="well">Table is empty.</p>';
              div.innerHTML = msg;
            }

            $('#main').html(div);
          },
          (error) => {
            // console.log(error);
            var msg = '<p class="alert alert-danger">Oops something went wrong.</p>';
            div.innerHTML = msg;

            $('#main').html(div);
          });
}

function executeInsert(query){
  $.ajax({
    url: '/tables/'+query.tablename.toLowerCase(),
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(query.values),
    contentType: 'application/json'
  })
  .then(
        (result) => {
          console.log(result);
          if(result.status == 200){
             return true;
          }
          return false;
        },
        (error) => {
          console.log(result);
          return false;
        });
}

function jsonToArr(json){
  var data = [];
  var fields = tableToImport.fields;

  for(var i=0; i<fields.length; i++){
    data.push(json.values[fields[i].name]);
  }

  return data;

}
