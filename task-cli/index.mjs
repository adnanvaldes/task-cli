#!/usr/bin/env node

import Tasks from "./task-cli.mjs"

const taskCLI = new Tasks();
taskCLI.markTask(9, "done")
console.log(taskCLI.taskList)