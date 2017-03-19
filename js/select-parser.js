'use strict';
const db = {};
db.student = ['studno', 'studentname', 'birthday', 'degree', 'major', 'unitsearned'];
db.studenthistory = ['studno', 'description', 'action', 'dateFiled', 'dateResolved'];
db.course = ['cno', 'ctitle', 'cdesc', 'noofunits', 'haslab', 'semoffered'];
db.courseoffering = ['semester', 'acadyear', 'cno', 'section', 'time', 'maxstud'];
db.studcourse = ['studno', 'cno', 'semester', 'acadyear'];


function tableHasColumn(table, column) {
  for (let i = 0; i < db[table].length; i++) {
    if(db[table][i] == column)
      return true;
  }
  return false;
}

function tableExist(tableInQuery) {
  // for each table
  for (let table in db) {
    if (db.hasOwnProperty(table)) {
      if(tableInQuery == table){
        return true;
      }
    }
  }
  return false;
}

function columnExist(column) {
  // for each table
  for (let table in db) {
    if (db.hasOwnProperty(table)) {
      // for each column
      for(let i=0; i<db[table].length; i+=1){
        if(column == db[table][i]){
          return true;
        }
      }
    }
  }
  return false;
}

function error(token, type) {
  if(type == 'column_does_not_exist')
    console.error('Uknown column \''+token+'\'.');
  else if(type == 'table_does_not_exist')
    console.error('Uknown table \''+token+'\'.');
  else if(type == 'no_column_found_in_table')
    console.error('Column \''+token[0]+'\' does not exist on table \''+token[1]+'\'');
  else
    console.error('ERROR: You have an error in your SQL syntax. Error starts at \''+token+'\'.');
}

function parseSelect(query) {

  /*
  *  Clean query
  */
  query = query.trim().toLowerCase();
  let tokens = query.split(/\s+/);

  /*
  *  Variables
  */
  let columnsDone = false;
  let fromDone = false;
  let tableDone = false;
  let whereDone = false;
  let queryDone = false;
  let columnsSelected = [];
  let tableSelected = [];
  let whereClause = {};
  let allColumns = false; // used if '*'

  /*
  *  Loop for checking each token
  */
  for (let i = 0; i < tokens.length; i++) {

    /******************** Start of query ********************/
    if(i==0 && tokens[i] == 'select'){

      // check if no next tokens
      if(i+1 == tokens.length){
        error(tokens[i], null);
        return null;
      }
      continue;
    }
    else if(i==0){
        error(tokens[i], null);
        return null;
    }

    /*********************** table columns part ***********************
    *
    *  NOTE:
    *   Acceptable columns part:
    *      - '*'
    *      - one tableColumn
    *      - multiple table columns, but follows this syntax strictly
    *        (<tableColumn1>, <tableColumn2>[, <tableColumnN>])
    *******************************************************************/
    else if(i == 1){
      // all columns
      if(tokens[i] == '*'){
        columnsDone = true;
        allColumns = true;
        // check if no next tokens
        if(i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }
        continue;
      }
      // one table
      else if(/^[a-z]+$/.test(tokens[i])){
        if(!columnExist(tokens[i])){
          error(tokens[i], 'column_does_not_exist');
          return null;
        }
        // check if no next tokens
        if(i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }
        columnsSelected.push(tokens[i]);
        columnsDone = true;
        continue;
      }
      // multiple table columns
      else if(/^[a-z]+,$/.test(tokens[i])){
        let column = '';
        // get all table columns
        for(; (/^[a-z]+,$/.test(tokens[i])); i+=1){
          column = tokens[i].replace(',','');
          if(!columnExist(column)){
            error(tokens[i], 'column_does_not_exist');
            return null;
          }
          columnsSelected.push(column);
        }
        // check last table column
        if(!/^[a-z]+$/.test(tokens[i]) || !columnExist(tokens[i])){
          error(tokens[i], 'column_does_not_exist');
          return null;
        }
        columnsSelected.push(tokens[i]);
        columnsDone = true;
        // check if no next tokens
        if(i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }
        continue;
      }
      // error table column
      else{
        error(tokens[i], 'column_does_not_exist');
        return null;
      }
    }
    /********************** From Token ***********************/
    else if(columnsDone && !fromDone && tokens[i] == 'from'){
      // check if no next tokens
      if(i+1 == tokens.length){
        error(tokens[i], null);
        return null;
      }
      fromDone = true;
      continue;
    }
    /********************** Table part **********************
    *
    *  NOTE: only 1 table is accepted
    *********************************************************/
    else if(fromDone && !tableDone){
      if(/[a-z]+(;)?/.test(tokens[i])){

        if(tokens[i].endsWith(';')){
          tokens[i] = tokens[i].replace(';', '');
          queryDone = true;
        }
        // check if table exist
        if(!tableExist(tokens[i])){
          error(tokens[i], 'table_does_not_exist');
          return null;
        }
        // done but with extra tokens
        if(queryDone && i+1 != tokens.length){
          error(tokens[i+1], null);
          return null;
        }
        // not done but no extra tokens
        else if(!queryDone && i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }
        tableSelected.push(tokens[i]);
        if(queryDone){
          break; // object
        }
        tableDone = true;
        continue;
      }
      else{
        error(tokens[i], 'table_does_not_exist');
        return null;
      }
    }
    /********************** without Where **********************/
    else if(tableDone && !queryDone && !whereDone && tokens[i] == ';'){
      queryDone = true;
      break;
    }
    /********************** Where Token **********************/
    else if(tableDone && !queryDone && !whereDone && tokens[i] == 'where'){
      // check if no next tokens
      if(i+1 == tokens.length){
        error(tokens[i], null);
        return null;
      }
      whereDone = true;
      continue;
    }
    /********************** Condition part **********************
    *
    *  NOTE: = is only operator accepted for now
    *      Follows strict format: tableColumn=constant
    *********************************************************/
    else if(!queryDone && whereDone){
      // expect one tableColumn ****
      if(/^[a-z]+$/.test(tokens[i])){
        if(!columnExist(tokens[i])){
          error(tokens[i], 'column_does_not_exist');
          return null;
        }

        // check if no next tokens
        if(i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }

        let tempColumn = tokens[i];
        i+=1;
        // expect equal sign ****
        if(tokens[i] != '='){
            error(tokens[i], null);
            return null;
        }
        // check if no next tokens
        if(i+1 == tokens.length){
          error(tokens[i], null);
          return null;
        }
        // expect constant ****
        i+=1;

        // remove any semicolon if joined with last token
        if(tokens[i].endsWith(';')){
          queryDone = true;
          tokens[i] = tokens[i].replace(';','');
        }

        // check if string
        if(tokens[i].startsWith('\'') || tokens[i].startsWith('\"')){
          let strDelimeter = tokens[i].startsWith('\'')? '\'':'\"';
          let stringClosed = false;
          let fullStr = tokens[i];

          if(fullStr.endsWith(strDelimeter))
            stringClosed = true;

          i+=1;
          while(!stringClosed && i<tokens.length){
            fullStr += " " +tokens[i];

            if (fullStr.endsWith(strDelimeter)) {
              stringClosed = true;
              break;
            }
            else if (fullStr.endsWith(strDelimeter+';')) {
              fullStr = fullStr.replace(';', '');
              stringClosed = true;
              queryDone = true;
              break;
            }
            i+=1;
          }

          if(!stringClosed){
            error(tokens[i-1], null);
            return null;
          }

          whereClause[tempColumn] = fullStr.replace(new RegExp(strDelimeter, 'g'), '');
          if(queryDone){
            break;
          }
        }

        // check if number or date or student number
        else if(/^(\d+|([01][0-9]|2[0-3]):([0-5][0-9])|([12][0-9]{3})-[0-9]{5}|([12][0-9]{3})-(0[1-9]|1[0-2])-([012][0-9]|3[0-1]))$/.test(tokens[i])){
          whereClause[tempColumn] = tokens[i];
          if(queryDone){
            break;
          }
        }
        else{
          error(tokens[i], null);
          return null;
        }
        // check if no next tokens
        if(i+1 == tokens.length || tokens[i+1] != ';'){
          error(tokens[i], null);
          return null;
        }
        else{
          break;
        }
      }
      error(tokens[i], 'column_does_not_exist');
      return null;
    }
    else{
      error(tokens[i], null);
      return null;
    }
  }

  /******************************
  * Done with Loop (Query Done)
  ******************************/
  if(allColumns)
    columnsSelected = db[tableSelected];
  else{
    // check if all columns selected is in the table selected
    for(let i=0; i<columnsSelected.length; i+=1){
      if(!tableHasColumn(tableSelected[0], columnsSelected[i])){
        error([columnsSelected[i], tableSelected[0]], 'no_column_found_in_table');
        return null;
      }
    }
  }

  let result = {
    tablename: tableSelected,
    select: columnsSelected,
    where: whereClause
  };

  return result;
}
