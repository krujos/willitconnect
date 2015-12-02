package willitconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import willitconnect.model.CheckedEntry;
import willitconnect.service.VcapServicesChecker;
import willitconnect.service.util.Connection;

import java.util.List;

@RestController
public class WillItConnectController {

    private final VcapServicesChecker vcapServicesChecker;

    @Autowired
    public WillItConnectController(VcapServicesChecker vcapServicesChecker) {
        this.vcapServicesChecker = vcapServicesChecker;
    }

    //TODO Do we still need this?
    @RequestMapping(value = "/guide", method = RequestMethod.GET)
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

    @RequestMapping(value = "/willitconnect")
    public String connect(@RequestParam("host") String host,
                       @RequestParam ("port") int port)  {
        if (Connection.checkConnection(host, port))
            return "I can connect to " + host + " on " + port;
        return "I cannot connect to " + host + " on " + port;
    }

    //TODO: refactor to remove code duplication 
    @RequestMapping(value = "/willitconnectproxy")
    public String proxyConnect(@RequestParam("host") String host,
                       @RequestParam ("port") int port,
                       @RequestParam("proxyHost") String proxyHost,
                       @RequestParam ("proxyPort") int proxyPort)  {
        if (Connection.checkProxyConnection(
                host, port, proxyHost, proxyPort, "http"))
            return "I can connect to " + host + " on " + port;
        return "I cannot connect to " + host + " on " + port;
    }

    @RequestMapping(value = "/serviceresults", method = RequestMethod.GET)
    public @ResponseBody List<CheckedEntry> getServiceResults() {
        return vcapServicesChecker.getConnectionResults();
    }

    @RequestMapping(value = "/proxy", method = RequestMethod.PUT)
    public void proxy(@RequestParam("proxy") String proxy,
                      @RequestParam("proxyPort") int proxyPort,
                      @RequestParam("proxyType") String proxyType)
    {
        vcapServicesChecker.setProxy(proxy, proxyPort, proxyType);
    }
}
