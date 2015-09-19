package willitconnect.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.*;

@RestController
public class WillItConnectController {

    @RequestMapping( value = "/", method = RequestMethod.GET)
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
        Socket socket = new Socket();
        try {
            SocketAddress addr = new InetSocketAddress(
                    Inet4Address.getByName(host), port);
            socket.connect(addr, 3000);
            if (socket.isConnected()) {
                return "I can connect to " + host + " on " + port;
            }
            socket.close();
        } catch (IOException e) { }
        return "I cannot connect to " + host + " on " + port;
    }
}
