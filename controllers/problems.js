const axios = require("axios");
const fs = require("fs");
const path = require("path");

// replace with your directory name and directory should be in the project root
const directoryName = "../files";

exports.problem_one = async function (req, res, next) {
  try {
    const urls = ["https://api.agify.io/?name=afaq", "https://www.boredapi.com/api/activity", "http://universities.hipolabs.com/search?country=Pakistan", "https://datausa.io/api/data?drilldowns=Nation&measures=Population"];
    const downloadPromises = urls.map((url) => axios.get(url).then((response) => response.data));
    const contents = await Promise.all(downloadPromises);
    res.status(200).json(contents);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.problem_two = async function (req, res, next) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      url: "https://api.publicapis.org/entries",
    };
    const response = await axios.request(config);
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: `Server responded with status code ${response.status}` });
    }
  } catch (e) {
    if (e.response.status === 404) {
      res.status(404).json({ message: "Not found" });
    } else if (e.response.status === 403) {
      res.status(403).json({ message: "Forbidden" });
    } else {
      res.status(500).json({ message: e.message });
    }
  }
};

exports.problem_three = async function (req, res, next) {
  try {
    const directoryPath = path.join(__dirname, directoryName);
    const files = fs.readdirSync(directoryPath);
    const textFiles = files.filter((file) => file.endsWith(".txt"));
    const contents = [];
    for (const file of textFiles) {
      console.log("reading file: ", file);
      const content = fs.readFileSync(path.join(directoryPath, file), "utf8");
      contents.push(content);
    }
    res.status(200).json(contents);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
