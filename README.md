Will It Connect?
================

Sometimes, you just want to know if you can reach your thing (service really) from Cloud Foundry. Is there a proxy in the way, is there an app security group, the dreaded firewall of doom or is it your code? Will It Connect takes a hostname (or ip) and a port and tries to make a connection from inside Cloud Foundry. If your destination allows us to open a socket, we report success, if not, we fail. Deploy it to the same space you intend to run your app and you can test the exact environment! 


#For Example: 

```
➜ curl "http://localhost:8080/willitconnect" -d host=amazon.com -d port=80 
I can connect to amazon.com on 80
➜ curl "http://localhost:8080/willitconnect" -d host=twitter.com -d port=8080 
I cannot connect to twitter.com on 8080
➜ curl "http://localhost:8080/willitconnect" -d host=twitter.com -d port=443
I can connect to twitter.com on 443
➜ curl "http://localhost:8080/willitconnect" -d host=google.com -d port=443 
I can connect to google.com on 443 
➜ curl "http://localhost:8080/willitconnect" -d host=pivotal.io -d port=443 
I can connect to pivotal.io on 443 
➜ curl "http://localhost:8080/willitconnect" -d host=nowaynohow.io -d port=443
I cannot connect to nowaynohow.io on 443 
```

#Get Some
3 steps get you up and running!

```
➜ git clone https://github.com/krujos/willitconnect
➜ ./gradlew assemble
➜ cf push
```

#TODO
* Consume a bound service
* Add a web form
* Report the real app URI in the use me