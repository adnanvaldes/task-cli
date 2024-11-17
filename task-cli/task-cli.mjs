import { cwd, exit } from "node:process";
import fs from "node:fs";

const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";

class Tasks {
  constructor() {
    this.taskPath = `${cwd()}/tasks.json`;
    this.taskList = this.readTasksFile();
    this.utils = new Utils();
  }

  getOrCreateTaskList() {
    if (fs.existsSync(this.taskPath)) {
      return this.taskPath;
    } else {
      fs.writeFileSync(this.taskPath, "[]");
    }

    return this.taskPath;
  }

  readTasksFile() {
    const taskFile = this.getOrCreateTaskList();
    const taskContent = fs.readFileSync(taskFile);
    try {
      return taskContent ? JSON.parse(taskContent) : [];
    } catch (error) {
      this.utils.handleErrors(error);
    }
  }

  updateTasksFile() {
    fs.writeFileSync(this.taskPath, JSON.stringify(this.taskList));
  }

  taskExists(taskID) {
    for (const item of this.taskList) {
      if (item.id == taskID) {
        return true
      }
    }
    console.log(`${red}Task not found (ID: ${taskID})`)
    exit(1)
  }

  createTask(taskDescription) {
    const newID = this.utils.getHighestID(this.taskList) + 1;
    const newTask = {
      id: newID,
      task: {
        description: taskDescription,
        status: "todo",
        createdAt: new Date().toLocaleString(),
        updatedAt: null,
      },
    };
    this.taskList.push(newTask);
    this.updateTasksFile();
    console.log(`Task added successfully (ID: ${newID})`);
  }

  updateTask(taskID, taskDescription) {
    this.taskExists(taskID)
    for (let item of this.taskList) {
      if (taskID == item.id) {
        item.task.description = taskDescription;
        item.task.updatedAt = new Date().toLocaleString();
      }
      break;
    }
    this.updateTasksFile();
    console.log(`Task updated successfully (ID: ${taskID})`);
  }

  deleteTask(taskID) {
    this.taskExists(taskID)

    let newTaskList = this.taskList.filter((item) => item.id != taskID);
    this.taskList = newTaskList;
    this.updateTasksFile();
    console.log(`Task deleted successfully (ID: ${taskID})`);
  }

  markTask(taskID, status) {
    this.taskExists(taskID)
    for (let item of this.taskList) {
      if (taskID == item.id) {
        switch (status) {
          case "todo":
            item.task.status = "todo";
            break;
          case "mark-in-progress":
            item.task.status = "in-progress";
            break;
          case "mark-done":
            item.task.status = "done";
            break;
          default:
            throw new Error("Mark status is one of [todo | mark-in-progress | mark-done]");
        }
        item.task.updatedAt = new Date().toLocaleString();
      }
    }
    this.updateTasksFile();
  }

  listTasks(status = null) {
      if (!status) {
        for (let item of this.taskList) {
        console.log(
          `${green}${item.task.description}\n${yellow}Status: ${item.task.status}\nTask ID: ${item.id}\n${reset}created ${item.task.createdAt} | updated ${item.task.updatedAt}\n`
        );
      }
    } else {
      if (!["started", "todo", "done"].includes(status)) {
        console.log("[status] must be one of [todo | started | done]")
        return
      }
      console.log(`Tasks ${status}:\n`);
      for (let item of this.taskList) {
        if (item.task.status == status) {
          console.log(
            `Task: ${green}${item.task.description}\n${yellow}Task ID: ${item.id}${reset}\ncreated ${item.task.createdAt} updated ${item.task.updatedAt}\n`
          );
        }
      }
    }
  }
}

class Utils {
  getHighestID(taskList) {
    const isEmptyList = (taskList) => Object.keys(taskList).length == 0;
    if (isEmptyList(taskList)) {
      return 0;
    } else {
      let currentMax = 0;
      for (let task of taskList) {
        if (task.id > currentMax) {
          currentMax = task.id;
        }
      }
      return currentMax;
    }
  }

  handleErrors(error) {
    if (error instanceof SyntaxError) {
      console.error(
        `A syntax error occurred: ${error.message}\nCheck your JSON task file?`
      );
    } else if (error instanceof TypeError) {
      console.error("A type error occurred:", error.message);
    } else {
      console.error("An error occurred:", error.message);
    }
  }
}

export default Tasks;
