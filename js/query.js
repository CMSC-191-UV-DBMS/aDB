var json2csv = require('json2csv'),
    fs = require('fs');

function append(table, data){
  var newLine= "\n";

  var fields = table.fields;

  var appendThis = data;

  var toCsv = {
      data: appendThis,
      fields: fields,
      hasCSVColumnTitle: false,
      defaultValue: 'NULL'
  };

  var filename = table.path;

  return new Promise((resolve, reject) => {
    fs.stat(filename, function (err, stat) {
      if (err == null) {
        console.log('File exists');

        //write the actual data and end with newline
        var csv = json2csv(toCsv) + newLine;

        fs.appendFile(filename, csv, function (err) {
          // if (err) throw err;
          if (err) reject(err);

          console.log('The "data to append" was appended to file!');

          resolve(true);
        });
      }
      else {
        //write the headers and newline
        console.log('New file, just writing headers');
        fs.writeFile(filename, '', function (err, stat) {
          // if (err) throw err;
          if (err) reject(err);

          console.log('file saved');

          toCsv.hasCSVColumnTitle = true;

          //write the actual data and end with newline
          var csv = json2csv(toCsv) + newLine;

          fs.appendFile(filename, csv, function (err) {
              // if (err) throw err;
              if (err) reject(err);

              console.log('The "data to append" was appended to file!');

              resolve(true);
          });
        });
      }
    });
  })

}

module.exports = {
  append
};
