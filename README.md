Will It Connect?
================
[![wercker status](https://app.wercker.com/status/95669acf2b99f3b76662dd01e0696d37/m "wercker status")](https://app.wercker.com/project/bykey/95669acf2b99f3b76662dd01e0696d37)

Sometimes, you just want to know if you can reach your thing (service really)
 from Cloud Foundry. Is there a proxy in the way, is there an app security
 group, the dreaded firewall of doom or is it your code? Will It Connect
 takes a hostname (or ip) and a port and tries to make a socket connection from
 inside Cloud Foundry. If your destination allows us to open a socket, we
 report success, if not, we fail. Deploy it to the same space you intend to
 run your app and you can test the exact environment! The original usecase
 was designed with non http connections in mind, so we don't make any
 assumptions about protocol. We simply open a socket connection to the host
 and port.


#For Example:

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
for fields with the substring `host` and `port` to try to make reasonable guesses
about what your service needs. We also connect to keys named 'URI' and anything
that looks like a URL. See the `accept` method in [EntryConsumer.java](src/main/java/willitconnect/service/util/EntryConsumer.java)
for the algorithm used. You can see the results of this scan by calling the
`/serviceresults` endpoint.


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

If you are making changes to index.js, afterwards you'll need to use babel to transform
the jsx before testing or deploying your changes

```
➜ npm install -g babel
➜ babel index.js --compact --no-comments > index-babel.js
```

#TODO
* UI Support for `/serviceresults`
* proxy servers
