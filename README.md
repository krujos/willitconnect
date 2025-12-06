
Will It Connect?
================
[![wercker status](https://app.wercker.com/status/95669acf2b99f3b76662dd01e0696d37/m "wercker status")](https://app.wercker.com/project/bykey/95669acf2b99f3b76662dd01e0696d37)
[![Stories in Ready](https://badge.waffle.io/krujos/willitconnect.png?label=ready&title=Ready)](https://waffle.io/krujos/willitconnect)

 Sometimes, you just want to know if you can reach your thing (service really)
 from Cloud Foundry. Is there a proxy in the way, is there an app security
 group, the dreaded firewall of doom or is it your code? Will It Connect
 takes a url or hostname and a port or an ip and a port and tries to make a  
 connection from inside Cloud Foundry. If your destination allows us to open 
 a socket or responds to a GET request on the URL, we report success, if not,
 we fail. Deploy it to the same space you intend to run your app and you can 
 test the exact environment! The original usecase was designed with non http 
 connections in mind, so we don't make any assumptions about protocol unless 
 you provide a url (i.e. something that starts with `http://` or `https://`.
 We simply open a socket connection to the host and port. If you provide a 
 URL we make a GET request, including SSL handshake if required.


# For Example:

## V2 API
### Mac/Linux/BSD/etc
```
➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"http://amazon.com"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   148  100   118  100    30    108     27  0:00:01  0:00:01 --:--:--   108
{
  "lastChecked": 0,
  "entry": "http://amazon.com",
  "canConnect": true,
  "httpStatus": 200,
  "validHostname": false,
  "validUrl": true
}
➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"google.com:443"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   152  100   125  100    27   1121    242 --:--:-- --:--:-- --:--:--  1126
{
  "lastChecked": 1459476345175,
  "entry": "google.com:443",
  "canConnect": true,
  "httpStatus": 0,
  "validHostname": true,
  "validUrl": false
}
➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"https://twitter.com"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   152  100   120  100    32    173     46 --:--:-- --:--:-- --:--:--   173
{
  "lastChecked": 0,
  "entry": "https://twitter.com",
  "canConnect": true,
  "httpStatus": 200,
  "validHostname": false,
  "validUrl": true
}
➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"http://does-not-exist.com"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   163    0   126    0    38      0      0 --:--:--  0:02:07 --:--:--    17
{
  "lastChecked": 0,
  "entry": "http://does-not-exist.com",
  "canConnect": false,
  "httpStatus": 0,
  "validHostname": false,
  "validUrl": true
}

➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"does-not-exist.com"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   150  100   119  100    31    193     50 --:--:-- --:--:-- --:--:--   193
{
  "lastChecked": 0,
  "entry": "does-not-exist.com",
  "canConnect": false,
  "httpStatus": 0,
  "validHostname": false,
  "validUrl": false
}
➜ curl willitconnect.cfapps.io/v2/willitconnect -d '{"target":"google.com:20"}' -H "Content-Type: application/json" | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   151  100   125  100    26     37      7  0:00:03  0:00:03 --:--:--    37
{
  "lastChecked": 1459477570094,
  "entry": "google.com:20",
  "canConnect": false,
  "httpStatus": 0,
  "validHostname": true,
  "validUrl": false
}
```

### Windows Powershell
```
PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"http://amazon.com"}' -Headers @{"Content-Type"="application/json"} -Method POST

lastChecked   : 1493667208210
entry         : http://amazon.com
canConnect    : True
httpStatus    : 301
httpProxy     :
responseTime  : 79
validUrl      : True
validHostname : False

PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"google.com:443"}' -Headers @{"Content-Type"="application/json"} -Method POST

lastChecked   : 1493667208210
entry         : google.com:443
canConnect    : True
httpStatus    : 0
httpProxy     :
responseTime  : 3018
validUrl      : False
validHostname : True

PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"https://twitter.com"}' -Headers @{"Content-Type"="application/json"} -Method POST

lastChecked   : 1493667672286
entry         : https://twitter.com
canConnect    : True
httpStatus    : 200
httpProxy     :
responseTime  : 742
validUrl      : True
validHostname : False

PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"http://does-not-exist.com"}' -Headers @{"Content-Type"="application/json"} -Method POST

lastChecked   : 1493667888431
entry         : http://does-not-exist.com
canConnect    : False
httpStatus    : 0
httpProxy     :
responseTime  : 127212
validUrl      : True
validHostname : False

PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"does-not-exist.com"}' -Headers @{"Content-Type"="application/json"} -Method POST

lastChecked   : 0
entry         : does-not-exist.com
canConnect    : False
httpStatus    : 0
httpProxy     :
responseTime  : 1
validUrl      : False
validHostname : False

PS C:\>Invoke-RestMethod willitconnect.cfapps.io/v2/willitconnect -Body '{"target":"google.com:20"}' -Header
s @{"Content-Type"="application/json"} -Method POST

lastChecked   : 1493668051469
entry         : google.com:20
canConnect    : False
httpStatus    : 0
httpProxy     :
responseTime  : 3018
validUrl      : False
validHostname : True
```

# Get Some
3 steps get you up and running!
## From the latest release
Download the jar file from the latest [release](https://github.com/krujos/willitconnect/releases)
and push it

```
➜ cf push -p willitconnect-0.0.1.jar #Use the right version # from the release
```

## From source

```
➜ git clone https://github.com/krujos/willitconnect
➜ npm install
➜ ./gradlew assemble
➜ cf push
```

# Development
The project uses the standard spring boot directory structure, with web content located
in src/main/resources/static.

## Prerequisites
- Java 21 (required for Spring Boot backend)
- Node.js 14+ (for frontend build and optional Node.js backend)
- npm 6+

## Running Locally

### Option 1: Java Backend (Spring Boot)
```bash
➜ npm install --legacy-peer-deps  # Install frontend dependencies
➜ ./gradlew bootRun                # Run Spring Boot backend with webpack build
```

The application will be available at `http://localhost:8080`

For faster development (skip webpack):
```bash
➜ ./gradlew bootRun -x webpack -x npmInstallLegacy
```

### Option 2: Node.js Backend (Lightweight)
For environments where Java dependencies are unavailable, a Node.js implementation is provided:
```bash
➜ npm install --legacy-peer-deps
➜ node server.js
```

The Node.js backend provides the same v2 API functionality with zero Java dependencies.

## Recent Improvements
This project has recently undergone significant bug fixes and improvements:

- **Resource Management**: Fixed resource leaks in socket connections using try-with-resources pattern
- **Error Handling**: Added comprehensive validation and error handling to the REST API
- **Code Quality**: Removed unsafe reflection usage in favor of explicit configuration
- **Proxy Support**: Enhanced proxy string parsing with proper validation
- **Documentation**: Integrated Tessl library documentation for AI-assisted development

# ChatOps

Willitconnect can also be connected to hubot -- more information at [hubot-will-it-connect](https://www.npmjs.com/package/hubot-will-it-connect)
