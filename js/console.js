'use strict';

const consoleId = 'sqlConsole';
const consoleTextArea = 'sqlQuery';

function clearConsoleText(){
  var textarea = document.getElementsByName(consoleTextArea)[0];
  textarea.value = '';
}

function getConsoleText(){
  var form = document.getElementById(consoleId);
  var text = form[consoleTextArea].value;
  return text;
}

function setConsoleText(text){
  var form = document.getElementById(consoleId);
  form[consoleTextArea].value = text;
}
