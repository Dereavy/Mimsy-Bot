'use strict';

var Task = require('data.task');

var eitherToTask = function eitherToTask(e) {
  return e.fold(Task.rejected, Task.of);
};

module.exports = eitherToTask;