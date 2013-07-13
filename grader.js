#!/usr/bin/env node
//Thanks to Petr Dusil who wrote this and posted it in forum
// "HW3, Part 3. Restler"  https://class.coursera.org/startup-001/forum/thread?thread_id=3186
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var URL_DEFAULT = "https://evening-retreat-2349.herokuapp.com";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLValid = function(infile) {
    var instr = infile.toString();
    return instr;
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var cheerioProcess = function(checksfile, htmldata) {
    $ = cheerio.load(htmldata);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return (out);
};

var printtoconsole = function(out) {
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
};

var checkHtml = function(htmlfile, checksfile, htmlurl) {
  if(htmlurl=="") fs.readFile(htmlfile, "utf8", function(error, data) {
    if (!(error)) {
      var out = cheerioProcess(checksfile, data);
      if (require.main==module) printtoconsole (out);
      return(out);
    }
    else {
      console.log ('HTML input file reading error');
      process.exit(1);
    }
  })
  else rest.get(htmlurl).on('complete', function(result) {
         if (result instanceof Error) {
           console.log('URL reading error: ' + result.message);
           process.exit(1);}
         else {
           var out = cheerioProcess(checksfile, result);
           if(require.main==module) printtoconsole(out);
           return(out);
         }
       });
};



var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <url_link>', 'URL to index.html', clone(assertURLValid), URL_DEFAULT)
    .parse(process.argv);
    checkHtml(program.file, program.checks, program.url);
} else {
    exports.checkHtml = checkHtml;
}
