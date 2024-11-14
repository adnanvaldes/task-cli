import { cwd } from 'node:process'
import fs from 'node:fs'

class Tasks {
    constructor() {
        this.taskPath = `${cwd()}/tasks.json`
        this.taskList = this.readTasksFile()
        this.utils = new Utils()
    };
    
    getOrCreateTaskList() {
        if (fs.existsSync(this.taskPath)) {
            return this.taskPath;
        } else {
            fs.writeFileSync(this.taskPath, "[]");
        };

        return this.taskPath;
        
    };

    readTasksFile() {
        const taskFile = this.getOrCreateTaskList()
        const taskContent = fs.readFileSync(taskFile)
        try {
            return taskContent ? JSON.parse(taskContent) : [];
        } catch (error) {
            this.utils.handleErrors(error)
        }
        
    };

    updateTasksFile() {
        fs.writeFileSync(this.taskPath, JSON.stringify(this.taskList))
    }

    createTask(taskDescription) {
        const newID = this.utils.getHighestID(this.taskList) + 1
        const newTask = {
            id : newID,
            task: {
            description : taskDescription,
            status : "todo",
            createdAt : new Date().toLocaleString(),
            updatedAt : null
            }
        }
        this.taskList.push(newTask)
        this.updateTasksFile()
        console.log(`Task added successfully (ID: ${newID})`)
    };

    updateTask(taskID, taskDescription) {
        for (let item of this.taskList) {
            if (taskID == item.id) {
                item.task.description = taskDescription
                item.task.updatedAt = new Date().toLocaleString()
            };
            break;
        }
        this.updateTasksFile()
    }

    deleteTask(taskID) {
        let newTaskList = this.taskList.filter(task => task.id !== taskID);
        this.taskList = newTaskList;
        this.updateTasksFile();
    }
};


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
                };
            };
            return currentMax;
        };       
    };

    handleErrors(error) {
        if (error instanceof SyntaxError) {
            console.error(`A syntax error occurred: ${error.message}\nCheck your JSON task file?`);
        } else if (error instanceof TypeError) {
            console.error("A type error occurred:", error.message);
        } else {
            console.error("An error occurred:", error.message);
        }
    };
}

export default Tasks


