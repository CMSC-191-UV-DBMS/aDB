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
