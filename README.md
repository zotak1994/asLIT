
# asLIT - asbru made lit af 🔥 !

A CLI tool to connect to your servers via SSH.



## Features

- Add new server configurations interactively.
- List all saved server configurations.
- Connect to servers using SSH.
- As of now it only works with your public key


## Run Locally

Clone the project

```bash
  git clone https://github.com/animeshd9/asLIT
```

Go to the project directory

```bash
  cd asLIT
```

Install the required dependencies:

```bash
  npm install
```
    
Make the script executable

```bash
  chmod +x ./bin/index.js

```
Intall the script globally

```bash
   sudo npm i -g /home/<user-name>/asLIT
```
## Usage/Examples
Add a Server Configuration

```bash
 aslit add
```

List Server Configurations

```bash
 aslit list
```
Connect to a Server

```bash
 aslit connect <server-name>
```
## Configuration
The server configurations are stored in a config.json file. The script uses encryption for sensitive information.
## Contributing

Contributions are always welcome! If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## License

[MIT](https://choosealicense.com/licenses/mit/)

