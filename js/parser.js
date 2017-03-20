'use strict';

function parse(){
  var text = getConsoleText();

  console.log('got: ');
  console.log(text);

  if(!text.length){
    return;
  }

  var multiline = true;
  var lines = text.split('\n');
  var query = lines[0];
  var parsed = {};
  var hasErr = false;
  var result = '';
  var results = { hasErr: hasErr, msg: ''  };
  var msg = '<p class="alert alert-success">All queries done succesfully.</p>';

  var div = document.createElement('div');
  div.setAttribute('id', 'tableView');

  for(var i=0; i<lines.length && !hasErr; i++){
    while(!hasErr && multiline && i<lines.length){ // assume query might be multiline
      if(!lines[i].trim().toLowerCase().startsWith('insert') &&
         !lines[i].trim().toLowerCase().startsWith('select')){
        query += lines[i++];
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
      // handle insert query OR call insert query handler
      parsed = parseInsert(query);
      if(!parsed){
        return;
      }
      else{
        // result = executeInsert(parsed);

        // console.log(tables);
        // console.log(query);

        tableToImport = tables[parsed['tablename'].toLowerCase()];
        // console.log(tableToImport);

        // build array
        var dataArr = jsonToArr(parsed);
        console.log(dataArr);

        result = validate([dataArr]);
        if(result){
          $('#main').append(div);
        }
        else{
          msg = '<p class="alert alert-danger">Oops something went wrong.</p>';
          break;
        }
      }
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

  div.innerHTML = msg;
  $('#main').html(div);
}

function parseInsert(query){
	var parsedQuery = {};
	var error = false;
	var i, j;

	//Skipping the spaces
	for (var m = 0; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}

	//Checking syntax of term "insert"
	var insertWord = "";
	for ( i = 0 ; i < query.length; i++) {
		if(query[i] != " ")
			insertWord = insertWord + query[i];
		else
			break;
	}

	if(insertWord.toLowerCase() != "insert"){
		alert("ERROR: Syntax error. Does not have any command.");
		return null;
	}

	//Skipping the spaces
	for (var m = i; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}

	//Checking syntax of term "into"
	var intoWord = "";
	for ( j = i  ; j < query.length; j++) {
		if(query[j] != " ")
			intoWord = intoWord + query[j];
		else
			break;
	}

	if(intoWord.toLowerCase() != "into"){
		alert("ERROR: Syntax error. Does not have 'into'");
		return null;
	}


	//Skipping the spaces
	for (var m = j; m < query.length; m++) {
		if(query[m]!=" "){
			j = m;
			break;
		}
	}

	//Getting the table name
	var tablename = "";

	for ( i = j ; i < query.length; i++) {
		if(query[i] != " " &&query[i] != "(")
			tablename = tablename+query[i];
		else
			break;
	}


	var parameter = "";
	var parsedParameter = [];

	//Skipping the spaces
	for (var m = i ; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}


	//Getting the column names
	if(query[i].toLowerCase() == "v"){
		for(var n = 0; n < tables[tablename.toLowerCase()].fields.length; n++){
			parsedParameter.push(tables[tablename.toLowerCase()].fields[n].name);
		}
		j = i - 1;
	}else if(query[i] == "("){
		for ( j = i + 1; j < query.length; j++) {
			if(query[j] != ")")
				parameter = parameter + query[j];
			else
				break;
		}

		parameter = parameter.replace(/\s/g,"");
		parsedParameter = parameter.split(",");

	}else{
		alert("ERROR: Syntax Error. Column names not cited.");
		return null;
	}

	//Checking syntax of term "values"
	var valueWord = "";
	for ( i = j + 1 ; i < query.length; i++) {
		if(query[i] != " " && query[i] !="("){
			valueWord = valueWord + query[i];
		}
		else if(query[i] == " " ){
			continue;
		}
		else
			break;
	}

	if(valueWord.toLowerCase() != "values"){
		alert("ERROR: Syntax error, does not have a 'VALUES'");
		return null;
	}

	//Getting the values
	var values = "";
	for(j = i + 1; j < query.length ; j++){
		if(query[j] == "(")
			continue;
		else if(query[j] ==")")
			break;
		else
			values = values + query[j];
	}

	//This also gets the values that is empty string
	var parsedValues = [];
	var values2 = values.split(",");
	for (var n = 0; n < values2.length; n++) {
		if (values2[n].indexOf("'") > -1 ){
			if(values2[n].lastIndexOf("'") - values2[n].indexOf("'") != 1){
				parsedValues.push(values2[n].slice(values2[n].indexOf("'")+1, values2[n].lastIndexOf("'") ));
			}else{
				parsedValues.push("");
			}
		}else if (values2[n].indexOf('"') > -1){
			if(values2[n].lastIndexOf('"') - values2[n].indexOf('"') != 1){
				parsedValues.push(values2[n].slice(values2[n].indexOf('"')+1, values2[n].lastIndexOf('"')));
			}else{
				parsedValues.push("");
			}
		}else if(values2[n] == "" || /^\s+$/.test(values[n]) ){
			alert("ERROR: Syntax error. No value between ',,'.");
			return null;
		}else{
			parsedValues.push(values2[n].replace(/\s/g,""));
		}
	}

	//Creating the parsed query into an object
	parsedQuery = {
		"tablename" : tablename,
		"params" : parsedParameter,
		"values" : {}
	}

	//Checking if the number of columns is equal to the number of values stated in the query
	if(parsedParameter.length != parsedValues.length){
		alert("ERROR: Columns and values does not match.");
		return null;
	}

	//Populate parsedQuery
	for (var i = parsedParameter.length -1; i >= 0; i--) {
		parsedQuery.values[(parsedParameter[i])] = parsedValues[i];

	}

	return parsedQuery;
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
                // if(data[i][whereCol] === whereVal){
                //   result.push(data[i]);
                // }
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
