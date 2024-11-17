
import Tasks from "./task-cli.mjs";
import argv from "node:process";

const usage = `
usage: task-cli [command] [arg1] [arg2]
  commands:
    add               Add new task. arg1 is the task description.
    update            Update task description. arg1 is the task ID, arg2 is the new text.
    delete            Delete a task by task ID. arg1 is the task ID.
    todo              Mark a task as "to-do". arg1 is the task ID.
    mark-in-progress  Mark a task as "in-progress". arg1 is the task ID.
    mark-done         Mark a task as "done". arg1 is the task ID.
    list [status]     List tasks. Optionally filter by status (todo, in-progress, done).
`;

const taskCLI = new Tasks();
const args = argv.argv.slice(2).map(arg => arg.toLowerCase());

const commands = {
  add: () => taskCLI.createTask(args[1]),
  update: () => taskCLI.updateTask(args[1], args[2]),
  delete: () => taskCLI.deleteTask(args[1]),
  todo: () => taskCLI.markTask(args[1], taskCLI.STATUS.TODO),
  "mark-in-progress": () => taskCLI.markTask(args[1], taskCLI.STATUS.IN_PROGRESS),
  "mark-done": () => taskCLI.markTask(args[1], taskCLI.STATUS.DONE),
  list: () => taskCLI.listTasks(args[1]),
};


const command = commands[args[0]];
if (command) {
  try {
    command();
  } catch (error) {
    console.error("Error:", error.message);
    console.log(usage);
  }
} else {
  console.log(usage);
}