const express = require("express");
const bodyParser = require("body-parser"); 
const path = require("path");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
app.use("/", express.static("./front/myteam/src/index.html"));

const stats_API = require(path.join(__dirname,"/back"));
stats_API(app);

app.listen(port, () => {
	console.log("Server ready!");
});