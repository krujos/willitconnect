[![Stories in Ready](https://badge.waffle.io/krujos/willitconnect.png?label=ready&title=Ready)](https://waffle.io/krujos/willitconnect)
Will It Connect?
================
[![wercker status](https://app.wercker.com/status/95669acf2b99f3b76662dd01e0696d37/m "wercker status")](https://app.wercker.com/project/bykey/95669acf2b99f3b76662dd01e0696d37)

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


#For Example:

V2 API
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
100   163    0   125    0    38      0      0 --:--:--  0:02:07 --:--:--    17
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

V1 API
```
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=amazon.com -d port=80
I can connect to amazon.com on 80
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=twitter.com -d port=8080
I cannot connect to twitter.com on 8080
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=twitter.com -d port=443
I can connect to twitter.com on 443
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=google.com -d port=443
I can connect to google.com on 443
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=pivotal.io -d port=443
I can connect to pivotal.io on 443
➜ curl "http://willitconnect.cfapps.io/willitconnect" -d host=nowaynohow.io -d port=443
I cannot connect to nowaynohow.io on 443
```

## Will It Connect also consumes bound services!
If you bind a service to willitconnect we'll do our best to connect to them. We
look for fields with the substring `host` and `port` to try to make reasonable guesses
about what your service needs. We also connect to keys named 'URI' and anything
that looks like a URL. See the `accept` method in [EntryConsumer.java](src/main/java/willitconnect/service/util/EntryConsumer.java)
for the algorithm used. You can see the results of this scan by calling the
`/serviceresults` endpoint.

*NOTE* This feature does not support HTTP(S) connections yet!!


#Get Some
3 steps get you up and running!
##From the latest release
Download the jar file from the latest [release](https://github.com/krujos/willitconnect/releases)
and push it

```
➜ cf push -p willitconnect-0.0.1.jar #Use the right version # from the release
```

##From source

```
➜ git clone https://github.com/krujos/willitconnect
➜ npm install
➜ ./gradlew assemble
➜ cf push
```

#Development
The project uses the standard spring boot directory structure, with web content located
in src/main/resources/static.

You can run it locally by using
```
➜ ./gradlew bootRun
```

#TODO
* improve test coverage for UI

