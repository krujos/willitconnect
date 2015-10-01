package willitconnect.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import willitconnect.service.util.Connection;

@RestController
public class WillItConnectController {

    @RequestMapping( value = "/guide", method = RequestMethod.GET)
    public String root() {
        return new StringBuilder()
                .append("<h3>Use me like this:<h3> ")
                .append("<pre>")
                .append("$ curl http://willitconnect.yourcfdomain.com/willitconnect")
                .append(" -d host=somehostname")
                .append(" -d port=443")
                .append("</pre>")
                .append("<p>Find out more ")
                .append("<a href='https://github.com/krujos/willitconnect'</a>here<p>")
                .toString();
    }

    @RequestMapping( value = "/willitconnect")
    public String root(@RequestParam("host") String host,
                       @RequestParam ("port") int port)  {
        if (Connection.checkConnection(host, port))
            return "I can connect to " + host + " on " + port;
        return "I cannot connect to " + host + " on " + port;
    }

}
