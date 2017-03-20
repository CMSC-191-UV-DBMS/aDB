'use strict';

function parse(){
  var text = getConsoleText();

  console.log('got: ');
  console.log(text);

  var multiline = true;
  var lines = text.split('\n');
  var query = lines[0];
  var parsed = {};
  var hasErr = false;
  var result = '';
  var results = { hasErr: hasErr, msg: ''  };

  for(var i=0; i<!hasErr && lines.length; i++){
    while(!hasErr && multiline){ // assume query might be multiline
      if(!lines[i].trim().toLowerCase().startsWith('insert') &&
         !lines[i].trim().toLowerCase().startsWith('select')){
        query += lines[i];
      }
      else{
        break; // start handling the built query
      }
    }

    if(!hasErr && query.trim().toLowerCase().startsWith('insert')){
      // handle insert query OR call insert query handler
      // parsed = parseInsert(query);

      // if(parsed.err){
      //   hasErr = true;
      //   result.msg = parsed.msg;
      //   result.hasErr = hasErr;
      //   break;
      // }

      // interact with csv since auto-commit
      // result = executeInsert(parsed);
    }

    if(!hasErr && query.trim().toLowerCase().startsWith('select')){
      // handle select query OR call select query handler
      // parsed = parseSelect(query);

      // if(parsed.err){
      //   hasErr = true;
      //   result.msg = parsed.msg;
      //   result.hasErr = hasErr;
      //   break;
      // }

      // interact with csv since auto-commit
      // results = executeSelect(parsed);

      // sample query = select name, age, date from tablename;
      // var index;
      // var tokens = query.split(" "); // contains "select", "name,", "age,", "date", "from", and "tablename;"
      // var tablename;
      // var attribs = [];
      // for(index=0;index<tokens.length - 1;index++){
      //   if(tokens[index] == "select" || tokens[index] == "from"){
      //     continue;
      //   }
      //   else{
      //     var attr = tokens[index];
      //     	if(attr.endsWith(",")){
      //       	attr = attr.substr(0, attr.length-1);  // removal of commas at the end of attribs
      //           // stringSample += "ATTR SUBSTR: "+ attr;
      //           attrib.push(attr);
      //       }
      //       else{
      //           // stringSample += "ATTR SUBSTR: "+ attr;
      //           attrib.push(attr);
      //       }
      //   }
      // }
      // tablename = tokens[tokens.length-1];
      // tablename = tablename.substr(0, tablename.length-1);
      // result = "{\n\t{\n\t\tattrib:"+attrib+";\n\t\ttablename:"+tablename+";\n\t}\n}";


    //var query = "select name from student;"; // this is the sample query
    // var tokens = query.split(" ");
    // var num = tokens.length;
    // var index;
    // var tablename;
    // var attrib = [];
    // var stringSample = "";  // for viewing elements of the JSONObject

    // for(index=0;index<tokens.length-1;index++){
    //   if(tokens[index] == "select" || tokens[index] == "from"){
    //     continue;
    //   }
    //   else{
    //   	var attr = tokens[index];
    //   	if(attr.endsWith(",")){  // removal of commas at the end of multiple attribs
    //     	attr = attr.substr(0, attr.length-1);
    //         attrib.push(attr);
    //     }
    //     else{
    //         attrib.push(attr);
    //     }
    //   }
    // }
    // tablename = tokens[tokens.length-1];
    // tablename = tablename.substr(0, tablename.length-1);

    // //stringSample += attrib + "<br>" + tablename;
    // /*
    // result string
    // {
    //     {
    //         attrib: ;
    //         tablename:
    //     }
    // }
    // */

    // result = "{\n\t{\n\t\tattrib:"+attrib+";\n\t\ttablename:"+tablename+"\n\t}\n}";
    // alert(result);
      parsed = parseSelect(query);
      // console.log(parsed);

      if(!parsed){
        return;
      }
      else{
        console.log(parsed);
        executeSelect(parsed);
      }

    }
  }

  // test select, modify 'parsed' data in function for now
  // executeSelect({});

  // test append, modify 'parsed' data in function for now
  // executeInsert({});

  return result;
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

  // expected format & sample equivalent queries

  // SELECT * FROM student;
  // query = {
  //   tablename: 'student',
  //   select: [
  //     'StudNo', 'StudentName', 'Birthday', 'Degree', 'Major', 'UnitsEarned'
  //   ],
  //   where: {}
  // };

  // SELECT StudNo, StudentName, Birthday, Degree FROM student where UnitsEarned = 78;
  // query = {
  //   tablename: 'student',
  //   select: [
  //     'StudNo', 'StudentName', 'Birthday', 'Degree'
  //   ],
  //   where: {
  //     'UnitsEarned' : '78'
  //   }
  // };

  // SELECT StudNo FROM student where UnitsEarned = 74;
  // query = {
  //   tablename: 'student',
  //   select: ['StudNo'],
  //   where: {
  //     'UnitsEarned': "74"
  //   }
  // };
  var file = tables[query.tablename].path;
  console.log(file);

  // var file = eval(query.tablename.path);
 // console.log(file);             // ---- undefined when select * from student;

  // get from file
  readCSV(file)
    .then(
          (data) => {
            // console.log(data);

            var headers = data[0];
            data = arrayToJson(data);

            console.log(data);

            // filter data
            var whereCol = Object.keys(query.where)[0];
            var whereVal = whereCol ? query.where[whereCol] : null;

            // filter by where
            var result = [];
            if(whereCol){
              for(var i=0; i<data.length; i++){
                if(data[i][whereCol] === whereVal){
                  result.push(data[i]);
                }
              }
              // console.log(result);
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
            // console.log(data);

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

  // expected format:

  // student
  // query = {
  //   tablename: 'student',
  //   values: {
  //     'StudNo' : '2013-13579',
  //     'StudentName' : 'Carmela',
  //     'Birthday' : '7-14-1996',
  //     'Degree' : 'BSCS',
  //     'UnitsEarned' : '144'
  //   }
  // };

  // course
  // query = {
  //   tablename: 'course',
  //   values: {
  //     'No': 'CMSC 142',
  //     'CTitle': 'Analysis of Algorithms',
  //     'CDesc': 'Big O',
  //     'NoOfUnits': 3,
  //     'HasLab': 1,
  //     'SemOffered': '1st'
  //   }
  // };

  // courseoffering
  // query = {
  //   tablename: 'courseoffering',
  //   values: {
  //     'Semester': '1st',
  //     'AcadYear': 2016,
  //     'CNo': 'CMSC 142',
  //     'Section': 'UV',
  //     'Time': '16:00',
  //     'MaxStud': 100
  //   }
  // };

  // studcourse
  // query = {
  //   tablename: 'studcourse',
  //   values: {
  //     'StudNo': '2013-24680',
  //     'CNo': 'CMSC 142',
  //     'Semester': '1st',
  //     'AcadYear': 2016,
  //   }
  // };

  // studenthistory
  // query = {
  //   tablename: 'studenthistory',
  //   values: {
  //     'StudNo': '2013-24680',
  //     'Description': 'Drop',
  //     'Action': 'Rejected',
  //     'DateFiled': '2017-02-28',
  //     'DateResolved': '2017-03-11'
  //   }
  // };

  $.ajax({
    url: '/tables/'+query.tablename,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(query.values),
    contentType: 'application/json'
    // success: readCSV(tablePath[query.tablename])
  });
}
