# ConnectServer [![Build Status](https://travis-ci.org/Vandise/ConnectServer.svg?branch=master)](https://travis-ci.org/Vandise/ConnectServer)
The ConnectServer(CS) is in charge of reporting available Hosts(Servers) and their Channels(GameServers) to the game client. These are queried from RethinkDB. This allows multiple gameservers to be pinged from a single application and not handle any reporting statuses, hard coding ip addresses and their ports. It also allows administrators to dynamically make a server/channel unavailble for client connections by switching an offline field from false to true. On server close the GS will update this field to reflect its current status.

The CS will validate the client build version against the selected GameServer. Generally helpful for beta tests.

The CS will also make sure there are available connection slots once a gameserver is selected. The CS will only report a connection count once and some slots may free from other players disconnecting.

After client validation and the GS will accept more connections: the socket connection is transfered to the game and authentication servers.

## Requests
The following requests are availble by the CS

### get_active_servers
Returns servers who've reported an online status.
```
Response:
Object:
  host_1: Array<ChannelObject>
  host_2: ...
```
Each host contains an array of available ChannelObjects containing the following information:

| Field         | DataType      | Description                           |
|:------------- |:-------------:| :------------------------------------- |
| id            | String        | The server ID (for debugging purposes) |
| ip            | String        | The IP address of the Channel  |
| port          | Integer       | The Port of the Channel |
| connections   | Integer       | Total User Conenctions on the Channel |
| max_connections | Integer     | Maximum connections supported by the Channel|
| name          |   String      | Channel name |
