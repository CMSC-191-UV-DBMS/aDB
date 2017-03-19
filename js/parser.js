"use strict";

$("#execute").click(function(){
	parse($("#console").val());
});


function parse(text){
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
  return result;
}


function parseInsert(query){
	var parsedQuery = {};
	var error = false;
	var i, j;
	var old = query;
	

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
		return {err: true};
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
		return {err: true};
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
	


	var completeParameter = false;
	var parameter = "";
	var parsedParameter = [];

	for (var m = i ; m < query.length; m++) {
		if(query[m]!=" "){
			i = m;
			break;
		}
	}


	if(query[i] == "v"){
		completeParameter = true;

	}else if(query[i] == "("){
		for ( j = i + 1; j < query.length; j++) {
			if(query[j] != ")")
				parameter = parameter + query[j];
			else
				break;
		}

		parameter = parameter.replace(" ","");
		parsedParameter = parameter.split(",");

	}else{
		error = true;
		return {err: true};
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
		return {err: true};
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
	values = values.replace('"',"");
	parsedValues = values.split(",");

	parsedQuery = {
		"table" : tablename,
		"params" : parsedParameter,
		"values" : {}
	}

	if(parsedParameter.length != parsedValues.length){
		error = true;
		return {err:true};
	}

	for (var i = parsedParameter.length -1; i >= 0; i--) {
		parsedQuery.values[(parsedParameter[i])] = parsedValues[i];	
		
	}

	console.log(parsedQuery);
	return parsedQuery;
}

