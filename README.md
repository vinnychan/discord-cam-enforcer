# discord-cam-enforcer

A discord bot that will kick users from a voice channel that requires camera to be on.

It doesn't detect if the person is actively participating with a face cam, but at least it can deter lurkers from joining a 'cam required' voice chat.

Uses redis on docker as a persistent store

## Installation

#### Requirements:
* Node 14+
* Docker

Use the node package manager [npm](https://www.npmjs.com/) to install discord-cam-enforcer.

```bash
npm install
npm run redis:create
```

## Usage
```
!help
!set-vc-require-cam-timeout 5000 // sets timeout to 5 seconds
!set-vc-require-cam <channelID> <true|false> // sets a voice channel to enforce cameras on
```
## Future
* Ability to change bot prefix
* Add permission checks
* Track user offences so they get banned from a specific voice channel

## License
[MIT](https://choosealicense.com/licenses/mit/)