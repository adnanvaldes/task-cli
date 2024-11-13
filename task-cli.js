import { argv, cwd } from 'node:process'
import fs from 'node:fs'

const taskSchema = {
    type: "object",
    properties: {
      id: { type: "number" }, // or "number" if you're using numeric IDs
      description: { type: "string" },
      status: { 
        type: "string",
        enum: ["todo", "in-progress", "done"]
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" }
    },
    required: ["id", "description", "status", "createdAt", "updatedAt"],
  };


class Tasks {
    constructor(taskFile) {
        this.taskList = this.readTasks()
    };
    
    getOrCreateTaskList() {
        let taskPath = `${cwd()}/tasks.json`

        if (fs.existsSync(taskPath)) {
            return taskPath;
        } else {
            fs.writeFileSync(taskPath, "{}");
        };

        return taskPath;
        
    };

    readTasks() {
        const taskFile = this.getOrCreateTaskList()
        const taskContent = fs.readFileSync(taskFile)
        return taskContent ? JSON.parse(taskContent) : {};
    };
};

const taskCLI = new Tasks();


