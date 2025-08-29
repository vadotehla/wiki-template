import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const currentTime = () => {
  const now = new Date();

  const hour = now.getHours();
  const minute = now.getMinutes();

  return `\x1b[4;97;40m${hour > 12 ? hour - 12 : hour}:${
    minute > 9 ? minute : `0${minute}`
  } ${hour > 12 ? "PM" : "AM"}\x1b[0m`;
};

const app = express();
app.use((req, res, next) => {
  console.log(
    `${currentTime()}:   New request at \x1b[1;31m${req.ip}\x1b[0m; @ ${
      req.protocol
    }://${req.host}\x1b[1m${req.path}\x1b[0m`
  );
  next();
});
app.use(express.json());
app.use("/content", express.static(join(__dirname, "static")));
app.use(express.static(join(__dirname, "public")));

const unparsedFiles = await readdir("pages", {
    encoding: "utf8",
    recursive: true,
  }),
  paths = [];

console.clear();

unparsedFiles
  .filter(
    (f) => f.toLowerCase().endsWith(".md") || f.toLowerCase().endsWith(".mdx")
  )
  .forEach((f) => {
    const path = `/wiki/${f.replace(/(\.mdx|\.md)/gi, "").toLowerCase()}`;

    app.get(path, async (req, res) => {
      try {
        const data = await readFile(join(__dirname, "pages", f), "utf8");
        res.status(200).set("Content-Type", "text/markdown").send(data);
        return console.log(
          `${currentTime()}:   Request succeeded! @ ${req.protocol}://${
            req.host
          }\x1b[1m${req.path}\x1b[0m`
        );
      } catch (err) {
        console.error(
          `${currentTime()}:   Request failure! @ ${req.protocol}://${
            req.host
          }\x1b[1m${req.path}\x1b[0m\n${String(err).replace(
            /(\/Users\/[^\/]+\/)/,
            "~/"
          )}`
        );
        return res
          .status(500)
          .set("Content-Type", "text/markdown")
          .send("# 500 Internal Server Error");
      }
    });

    console.log(
      `${currentTime()}:   New route setup at \x1b[1;41m${path}\x1b[0m`
    );
    paths.push(path);
  });

app.get("/articles", (req, res) =>
  res.status(200).set("Content-Type", "application/json").json(paths)
);

app.listen(8080, () =>
  console.log(
    `${currentTime()}:   Listening on Port 8080 @ \x1b[1mhttp://localhost:8080\x1b[0m`
  )
);

