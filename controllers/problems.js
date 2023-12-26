const axios = require("axios");
const fs = require("fs");
const path = require("path");

// replace with your directory name and directory should be in the project root
const directoryName = "../files";

exports.problem_one = async function (req, res, next) {
  try {
    const urls = req.body.urls;
    if (!Array.isArray(urls)) {
      throw new Error("Invalid input: expected an array of URLs");
    }
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
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.problem_three = async function (req, res, next) {
  try {
    const directoryPath = path.join(__dirname, directoryName);
    const files = fs.readdirSync(directoryPath);
    const textFiles = files.filter((file) => file.endsWith(".txt"));
    const contents = [];
    for (const file of textFiles) {
      const content = fs.readFileSync(path.join(directoryPath, file), "utf8");
      contents.push(content);
    }
    res.status(200).json(contents);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
