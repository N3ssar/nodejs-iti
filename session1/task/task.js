const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`${__dirname}/todos.json`));

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    const newTodo = {
      id: data.length + 1,
      title: args.join(" "),
      status: "pending",
    };
    data.push(newTodo);
    fs.writeFileSync(`${__dirname}/todos.json`, JSON.stringify(data), "utf8");
    console.log(`Added new todo: ${newTodo.title}`);
    break;
  case "list":
    if (data.length === 0) {
      console.warn('No todos found, use "add" command to add new todos!');
    } else {
      console.log("Todos List:");
      data.forEach((todo) => {
        console.log(
          `${todo.id}. ${todo.title} [${todo.status === "completed" ? "x" : " "}]`,
        );
      });
    }
    break;
  case "delete":
    const idToDelete = args[0];
    if (!idToDelete) {
      console.error("Please provide the id of the todo to delete.");
      break;
    }
    const todoToDelete = data.find((todo) => todo.id === parseInt(idToDelete));
    if (!todoToDelete) {
      console.error(`Todo with id "${idToDelete}" not found.`);
      break;
    }
    const filteredData = data.filter(
      (todo) => todo.id !== parseInt(idToDelete),
    );
    fs.writeFileSync(
      `${__dirname}/todos.json`,
      JSON.stringify(filteredData),
      "utf8",
    );
    console.log(`Todo with id "${idToDelete}",deleted successfully!`);
    break;
  case "complete":
    const todoToComplete = data.find((todo) => todo.id === parseInt(args[0]));

    if (todoToComplete) {
      todoToComplete.status = "completed";
      fs.writeFileSync(`${__dirname}/todos.json`, JSON.stringify(data));
      console.log(`Completed todo: ${todoToComplete.title}`);
    } else {
      console.log("Todo not found.", todoToComplete);
    }
    break;
  default:
    console.log("Invalid command. Use 'add', 'list', 'complete', or 'delete'.");
}
