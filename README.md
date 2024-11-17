# task-cli

`task-cli` is a simple Node.js app to track tasks in the terminal, written as part of [roadmap.sh](https://roadmap.sh) backend development [projects](https://roadmap.sh/projects/task-tracker).

## Installation

First clone this repository and navigate to the root directory of `task-cli`:

```bash
git clone https://github.com/adnanvaldes/task-cli.git
cd task-cli
```

You can use the app from the root directory by using `node . <arguments>`. If you want to use it elsewhere, install the app using [npm](https://www.npmjs.com/): 

```bash
npm install -g .
```

`task-cli` will now be an available command from anywhere in your terminal. 

>[!note]
>If you would like to change the command you use, update the `pacgake.json` file. The line that says `"task-cli": "./task-cli/index.mjs"` is where the CLI command is named - feel free to change the first part.


## Usage

Command usage: `task-cli [options] [arg1] [arg2]` 

Start by adding your first task:

```bash
task-cli add "learn how to use task-cli"
```

If you see a message telling you the task was added successfully, you can now use `task-cli list` to see it:

```bash
task-cli list

// Output:

learn how to use task-cli

Status: todo
Task ID: 1
created 2024-11-17, 11:05:47 a.m. | updated null
```

Should you want to update the description of the task, use `task-cli update <task id> <updated text>`:

```bash
task-cli update 1 "i updated my tasks!"
```

This will change the text of the task, and will modify the `updated` element so you can see the last time you made a change.

You can also call `task-cli` without any arguments to see a simple usage message:

```bash
task-cli

// Outputs:
usage: task-cli [options] [arg1] [arg2]
  options:
    add               Add new task to list
    update            Update task description. arg1 is the task ID to update, arg2 is the new text to insert
    delete            Deletes a task from list by task ID. arg1 is the ID of the task to be deleted
    mark-in-progress  Marks task ID=<arg1> as in-progress
    mark-done         Marks task ID=<arg1> as done
    list [status]     Lists tasks. Can be filtered by status.  
```

### List of options:

| **Option**               | **Description**                                                          |
| ------------------------ | ------------------------------------------------------------------------ |
| `add`                    | Adds a new task to the list                                              |
| `update <id> <new-text>` | Updates the text of the task with id = `<id>`                            |
| `delete <id>`            | Deletes task with specified id                                           |
| `mark-in-progress <id>`  | Sets task status to "in-progress"                                        |
| `mark-done <id>`         | Sets task status to "done"                                               |
| `list [status]`          | Lists all tasks, optionally filtering for those with status = `[status]` |

## License

[MIT](https://choosealicense.com/licenses/mit/)