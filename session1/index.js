// console.log(global);
// // console.log(document);

// for(let i = 1; i <= 10; i++) {
//     console.log(i);
// }
const fs = require("fs");

const { printMessage } = require("./index2.js");
printMessage("Hello from index.js");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
// console.log(data);

fs.readFile(`${__dirname}/data.json`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});

console.log("End of index.js");

fs.writeFileSync(`${__dirname}/data2.json`, data, "utf-8");

fs.writeFileSync(`${__dirname}/message.txt`, "Hello from Nodejs", "utf-8");

fs.rename(`${__dirname}/message.txt`, `${__dirname}/docs.txt`, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("File renamed to docs.txt");
  }
});

const WHEN_TO_USE_NODEJS = `
Node.js is a runtime environment that allows you to run JavaScript code outside of a web browser. It is particularly useful for building server-side applications, command-line tools, and scripts. Here are some scenarios where you might want to use Node.js:
1. **Server-Side Applications**: Node.js is commonly used to build web servers and APIs. Its non-blocking, event-driven architecture makes it suitable for handling multiple concurrent connections efficiently.
2. **Real-Time Applications**: Node.js is well-suited for real-time applications such as chat applications, online gaming, and collaborative tools, where low latency and high throughput are essential.
3. **Microservices Architecture**: Node.js can be used to build microservices, allowing you to break down a large application into smaller, manageable services that can be developed, deployed, and scaled independently.
4. **I/O bound Applications**: Node.js is ideal for applications that involve a lot of input/output operations, such as reading and writing files, interacting with databases, or making HTTP requests.
5. **Command-Line Tools**: Node.js can be used to create command-line tools and scripts for automating tasks, managing files, or performing system administration tasks.
6. **Cross-Platform Development**: Node.js can be used to build cross-platform applications using frameworks like Electron, allowing you to create desktop applications that run on Windows, macOS, and Linux.
7. **Streaming Applications**: Node.js is suitable for building streaming applications, such as video or audio streaming platforms, where data is processed in chunks and delivered to clients in real-time.
8. **Single Page Applications (SPAs)**: Node.js can be used as a backend for SPAs, providing APIs and handling server-side rendering for improved performance and SEO.`;

fs.writeFile(
  `${__dirname}/message.txt`,
  WHEN_TO_USE_NODEJS,
  "utf-8",
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Message written to message.txt");
    }
  },
);
