# Arma-Reforger-API-Emulator
Emu Arma reforge API(Backend) service
* [Support ME](#support-me)
* [Installation](#installation)
* [Dependencies](#dependencies)
* [How to use](#how-to-use)
* [Config](#config)
  *  [Workshop config](#workshop-config)
  *  [API config](#api-config)
  *  [Client config](#client-config)
  *  [Server config](#server-config)
* [Info](#info)
## Support me
- **BTC**: bc1q49z2c4r482kvtafkndd0hw3hjfpp57clh2l9dq
- **USTD TRC20**: TCMSXb5H1EVU9GGFf45eMoebdCpiT9G9M3
- **Boosty**: [donate](https://boosty.to/serega25511s/donate)
## Dependencies
- [MongoDB](https://www.mongodb.com/try/download/community)
- Windows 10/11 x64
- Node JS 22
## Installation
```
git clone https://github.com/Serega25511s/Arma-Reforger-API-Emulator.git
npm install package.json

```

## How to use
1. Put client tool files in client game folder
2. Put server tool files in dedicated server folder
3. Start workshop auth server
4. Start MongoDB server
5. Start API: ```node index.js```
## Config
### Workshop config
```py
# .\WorkshopServer\Config.json
{
  "Server":{
    "PORT": 12222, # Workshop server port
    "AuthKey": "KEY" # authKey for auth get token request
  }
}
```

### API config
```py
# .\config.json
{
  "API": {
    "PORT": 6122, # api port
    "ActivateWorkshop": false # activate workshop functional (NEED account with license game)
  },
  "DB": {
    "ADDR": "mongodb://127.0.0.1:27017" # MongoDB address 
  },
  "Workshop": {
    "IP": "127.0.0.1", # worshop server address
    "PORT": 12222, # worshop server port
    "KEY": "KEY" # authKey for workshop
  }
}
```

### Client config
```py
# ClientGameFolder\ClientConfig.json
{
  "Master":{
    "URL": "http://127.0.0.1:6122" # backend url
  },
  "Client":{
    "EnableProxy": false, # enable proxy if need
    "ProxyAddr": "127.0.0.1:8888" # https proxy address
  }
}
```

### Server config
```py
# ServerGameFolder\ServerConfig.json
{
  "Master":{
    "URL": "http://127.0.0.1:6122" # backend url
  },
  "Server":{
    "EnableProxy": false, # enable proxy
    "ProxyAddr": "127.0.0.1:8888", # https proxy address
    "VisibleInLicense": false # if enabled server will be displayed in the original server list and licensed players will be able to login
  }
}
```
## Info
- If you want to use workshop server you need to start wokrshop server in machine with open and login Steam account with license game else you suck
- [BUY GAME](https://store.steampowered.com/app/1874880/Arma_Reforger/)
