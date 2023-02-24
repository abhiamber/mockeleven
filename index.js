const express = require("express");

let app = express();

app.get("/", async (req, res) => {
  res.send("HUrray !");
});

app.listen(8080, () => {
  console.log("server working");
});
