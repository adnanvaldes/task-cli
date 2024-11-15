#!/usr/bin/env node

import Tasks from "./task-cli.mjs";
import argv from "node:process";

const usage = `
usage: task-cli [options] [arg1] [arg2]
  options:
    add           Add new task to list
    update        Update task description. arg1 is the task ID to update, arg2 is the new text to insert
    delete        Deletes a task from list by task ID. arg1 is the ID of the task to be deleted
    started       Marks task ID=<arg1> as started
    done          Marks task ID=<arg1> as done
    list [status] Lists tasks. Can be filtered by status.     
`

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
    console.log(usage);
}

