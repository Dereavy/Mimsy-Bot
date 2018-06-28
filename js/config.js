var fs = require('fs');
var yaml = require('js-yaml');
// load configuration
try {
    var filename = "./config.yml";
    var contents = fs.readFileSync(filename, 'utf8');
    var config = yaml.load(contents);
    //console.log(util.inspect(data, false, 10, true));
} catch (err) {
    //console.log(err.stack || String(err));
}
exports.get = config;