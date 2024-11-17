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
    this.STATUS = {
      TODO : "todo",
      IN_PROGRESS: "in-progress",
      DONE: "done"
    };
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
        break;
      }
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
    const validStatuses = Object.values(this.STATUS);
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Use one of ${validStatuses.join(" | ")}`);
    }
    this.taskExists(taskID);

    for (let item of this.taskList) {
      if (item.id == taskID) {
        item.task.status = status
        break
      }
    }
    this.updateTasksFile();
    console.log(`Task ${taskID} marked as ${status}.`);
  }

  listTasks(status = null) {
    const validStatuses = ["todo", "in-progress", "done"];
    if (status && !validStatuses.includes(status)) {
      console.log(`[status] must be one of ${validStatuses.join(" | ")}`);
      return;
    }
  
    const tasksToDisplay = status
      ? this.taskList.filter(task => task.task.status === status)
      : this.taskList;
  
    if (tasksToDisplay.length === 0) {
      console.log("No tasks found.");
      return;
    }

    for (let item of tasksToDisplay) {
      console.log(
        `Task: ${green}${item.task.description}\n${yellow}Status: ${item.task.status}\n${yellow}Task ID: ${item.id}${reset}\ncreated ${item.task.createdAt} updated ${item.task.updatedAt}\n`
      );
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
