#!/usr/bin/env node
const { program } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const configFilePath = path.join(__dirname, "config.json");
const Table = require("cli-table");
const chalk = require("chalk");

// Load configurations
function loadConfig() {
  try {
    const data = fs.readFileSync(configFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save configurations
function saveConfig(config) {
  fs.writeFileSync(configFilePath, JSON.stringify(config));
}

program.version("1.0.0").description(
  chalk.bold.green(`
    ▄▄▄        ██████  ██▓     ██▓▄▄▄█████▓
   ▒████▄    ▒██    ▒ ▓██▒    ▓██▒▓  ██▒ ▓▒
   ▒██  ▀█▄  ░ ▓██▄   ▒██░    ▒██▒▒ ▓██░ ▒░
   ░██▄▄▄▄██   ▒   ██▒▒██░    ░██░░ ▓██▓ ░ 
    ▓█   ▓██▒▒██████▒▒░██████▒░██░  ▒██▒ ░ 
    ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░░ ▒░▓  ░░▓    ▒ ░░   
     ▒   ▒▒ ░░ ░▒  ░ ░░ ░ ▒  ░ ▒ ░    ░    
     ░   ▒   ░  ░  ░    ░ ░    ▒ ░  ░      
         ░  ░      ░      ░  ░ ░           
     
    asLIT - asbru made lit af 🔥 !
    A CLI tool to connect to your servers via SSH.
    made with ❤️ by @Animesh Das @Rakesh Modak
   `)
);

program
  .command("add")
  .description("Add a new server configuration")
  .action(async () => {
    const config = loadConfig();
  
    const questions = [
      { type: "input", name: "name", message: "Server name:" },
      { type: "input", name: "host", message: "Server host:" },
      { type: "input", name: "username", message: "Username:" },
      {
        type: "password",
        name: "password",
        message: "Password (optional):",
        validate: (input) => input.length >= 0 || true,
      },
    ];
    const answers = await inquirer.prompt(questions);
    if (answers.password === "") {
      delete answers.password;
    }
    const findServerName = config.find((x) => x.name === answers.name);
    if (findServerName) {
      program.error("Server Name already exist! X");
    }
    if (!config.length) {
      config.push({ id: 1, ...answers });
    } else {
      const lastInsertedServer = config[config.length - 1];
      const newId = lastInsertedServer.id + 1;
      config.push({ id: newId, ...answers });
    }

    saveConfig(config);
    console.log("Server configuration saved. ✔");
  });

program
  .command("list")
  .description("List all server configurations")
  .action(() => {
    const config = loadConfig();
    const table = new Table({
      head: [
        chalk.green("Id"),
        chalk.green("Name"),
        chalk.green("Host"),
        chalk.green("Username"),
      ],
      style: {
        head: ["cyan"],
        border: ["yellow"],
      },
    });
    config.forEach((c) => {
      table.push([
        chalk.magenta(c.id),
        chalk.magenta(c.name),
        chalk.magenta(c.host),
        chalk.magenta(c.username),
      ]);
    });
    console.log(table.toString());
  });

program
  .command("connect <serverName>")
  .description("Connect to a server")
  .action((serverName) => {
    const config = loadConfig();
    const server = config.find((x) => x.id.toString() === serverName || x.name === serverName);

    if (server) {
      console.log(`Connecting to server: ${serverName}`);

      const sshProcess = spawn("ssh", [`${server.username}@${server.host}`], {
        stdio: "inherit", // Inherit the standard input/output of the current process
      });

      sshProcess.on("close", (code) => {
        console.log(`SSH connection to ${serverName} closed with code ${code}`);
      });

      sshProcess.on("error", (err) => {
        console.error(`Error connecting to ${serverName}:`, err);
      });
    } else {
      console.error(`Server "${serverName}" not found.`);
    }
  });


  program
  .command("delete <serverName>")
  .description("delete a server")
  .action((serverName) => {
    const config = loadConfig();
    const newConfig = config.filter((x) => x.id.toString() !== serverName );
    saveConfig(newConfig);
    console.log(`server list updated`);
    
  });

program.parse(process.argv);
