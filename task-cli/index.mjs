#!/usr/bin/env node

import Tasks from "./task-cli.mjs";
import argv from "node:process";

const taskCLI = new Tasks();
const args = argv.argv.slice([2]);


switch (args[0]) {
  case "add":
    taskCLI.createTask(args[1]);
    break;
  case "update":
    taskCLI.updateTask(args[1], args[2]);
    break;
  case "delete":
    console.log(args[1])
    taskCLI.deleteTask(args[1]);
    break;
  case "started":
    taskCLI.markTask(args[1]);
    break;
  case "done":
    taskCLI.markTask(args[1], args[0]);
    break;
  case "list":
    taskCLI.listTasks(args[1], args[0]);
    break;
  default:
    console.log("Usage: ");
}

