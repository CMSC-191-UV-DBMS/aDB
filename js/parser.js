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
      parsed = parseInsert(query);
      	console.log(parsed);
      // if(parsed.err){
      //   hasErr = true;
      //   result.msg = parsed.msg;
      //   result.hasErr = hasErr;
      //   break;interact with csv since auto-commit
      // result = executeInsert(parsed);
      // }

      //
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
    }
  }

  // test select, modify 'parsed' data in function for now
  // executeSelect({});

  // test append, modify 'parsed' data in function for now
  // executeInsert({});

  return result;
}

function parseInsert(query){
	var parsedQuery = {};
	var error = false;
	var i, j;

	for (var m = 0; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}

	var insertWord = "";
	for ( i = 0 ; i < query.length; i++) {
		if(query[i] != " ")
			insertWord = insertWord + query[i];
		else
			break;
	}

	if(insertWord.toLowerCase() != "insert"){
		error = true;
		return {err: true, msg: "ERROR: Syntax error. Does not have any command."};
	}

	for (var m = i; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}

	var intoWord = "";
	for ( j = i  ; j < query.length; j++) {
		if(query[j] != " ")
			intoWord = intoWord + query[j];
		else
			break;
	}

	if(intoWord.toLowerCase() != "into"){
		error = true;
		return {err: true, msg: "ERROR: Syntax error. Does not have 'into'"};
	}


	for (var m = j; m < query.length; m++) {
		if(query[m]!=" "){
			j = m;
			break;
		}
	}

	var tablename = "";

	for ( i = j ; i < query.length; i++) {
		if(query[i] != " " &&query[i] != "(")
			tablename = tablename+query[i];
		else
			break;
	}


	var parameter = "";
	var parsedParameter = [];

	for (var m = i ; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}


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
		error = true;
		return {err: true, mgs: "ERROR: Syntax Error. Column names not cited."};
	}

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
		error = true;
		return {err: true, msg: "ERROR: Syntax error, does not have a 'VALUES'"};
	}

	var values = "";
	for(j = i + 1; j < query.length ; j++){
		if(query[j] == "(")
			continue;
		else if(query[j] ==")")
			break;
		else
			values = values + query[j];
	}
	
	var parsedValues = [];
	// values = values.replace('"',"");
	// values = values.replace("'","");
	var values2 = values.split(",");
	for (var n = values2.length -1; n >= 0; n--) {
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

			return {err: true , msg: "ERROR: Syntax error. No value between ',,'."}
		}else{
			parsedValues.push(values2[n]);
		}
	
	parsedQuery = {
		"tablename" : tablename,
		"params" : parsedParameter,
		"values" : {}
	}

	if(parsedParameter.length != parsedValues.length){
		error = true;
		return {err:true, msg: "ERROR: Columns and values does not match."};
	}

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

  // get from file
  readCSV(tablePath[query.tablename])
    .then(
          (data) => {
            // console.log(data);

            var headers = data[0];
            data = arrayToJson(data);

            // console.log(data);

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
