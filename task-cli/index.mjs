#!/usr/bin/env node

import Tasks from "./task-cli.mjs"

const taskCLI = new Tasks();
taskCLI.createTask("hello")
taskCLI.updateTask(1, "Goodbye")