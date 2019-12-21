const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     res.end(data);
  //   });

  // Solution 2 - Backpressure - cannot process fast enough
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", chunk => {
  //     res.write(chunk);
  //   });

  // Solution 3 - Fixes Backpressure
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);

  readable.on("end", () => {
    res.end();
  });

  readable.on("error", err => {
    console.log(err);
    res.statusCode = 500;
    res.end("File not found!");
  });
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
