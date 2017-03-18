"use strict";

function parse(text){
  var multiline = true;
  var lines = text.split('\n');
  var query = lines[0];
  var parsed = {};
  var hasErr = false;
  var result = '';
  var results = { hasErr: hasErr, msg: ''  };

  for(var i=1; i<!hasErr && lines.length; i++){
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
    var tokens = query.split(" ");
    var num = tokens.length;
    var index;
    var tablename;
    var attrib = [];
    var stringSample = "";  // for viewing elements of the JSONObject

    for(index=0;index<tokens.length-1;index++){
      if(tokens[index] == "select" || tokens[index] == "from"){
        continue;
      }
      else{
      	var attr = tokens[index];
      	if(attr.endsWith(",")){  // removal of commas at the end of multiple attribs
        	attr = attr.substr(0, attr.length-1);
            attrib.push(attr);
        }
        else{
            attrib.push(attr);
        }
      }
    }
    tablename = tokens[tokens.length-1];
    tablename = tablename.substr(0, tablename.length-1);

    //stringSample += attrib + "<br>" + tablename;
    /*
    result string
    {
        {
            attrib: ;
            tablename:
        }
    }
    */

    result = "{\n\t{\n\t\tattrib:"+attrib+";\n\t\ttablename:"+tablename+"\n\t}\n}";
    alert(result);
    }
  }
  return result;
}
