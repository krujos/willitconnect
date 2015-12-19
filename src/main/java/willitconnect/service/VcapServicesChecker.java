package willitconnect.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;
import willitconnect.service.util.EntryConsumer;

import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Checks VCAP_SERVICES for keys named host and values that look like URI's
 */
@Service
public class VcapServicesChecker {
    private String proxy;
    private String proxyType;
    private int proxyPort;
    private JSONObject vcapServices;
    private Logger log = Logger.getLogger(VcapServicesChecker.class);

    public List<CheckedEntry> getConnectionResults() {
        return results;
    }

    public VcapServicesChecker(JSONObject vcapServices) {
        log.info("Creating service checker with " + vcapServices);
        this.vcapServices = vcapServices;
        initialize();
    }

    private ArrayList<CheckedEntry> results;

    private void parse() {
        java.util.Objects.requireNonNull(vcapServices);

        if (0 == vcapServices.length())
            return;

        vcapServices.keys().forEachRemaining(new EntryConsumer(results,
                vcapServices));
    }

    private void check() {
        results.forEach(e -> {
            log.info("checking " + e.getEntry());
            if (e.isValidHostname()) {
                String hostname = getHostname(e);
                int port = getPort(e, hostname);
                if ( hasProxy() ) {
                    e.setCanConnect(
                            Connection.checkProxyConnection(
                                    hostname, port, proxy, proxyPort,
                                    proxyType));
                } else {
                    e.setCanConnect(Connection.checkConnection(hostname, port));
                }
                e.setLastChecked(Date.from(Instant.now()));
            }
            log.error(e.getEntry() + " is not a valid hostname");
        });
    }

    private boolean hasProxy() {
        return null != getProxy();
    }

    private int getPort(CheckedEntry e, String hostname) {
        return Integer.parseInt(e.getEntry().substring(
                hostname.length() + 1,
                e.getEntry().length()));
    }

    private String getHostname(CheckedEntry e) {
        return e.getEntry().substring(0, e.getEntry().indexOf(':'));
    }

    public void setProxy(String proxy, int port, String proxyType) {
        this.proxy = proxy;
        this.proxyPort = port;
        this.proxyType = proxyType;
        // validate connection status with proxy set
        initialize();
    }

    public void unSetProxy() {
        this.proxy = null;
        this.proxyPort = 0;
        this.proxyType = null;
        // validate connection with proxy removed
        initialize();
    }

    private void initialize() {
        results = new ArrayList<>();
        this.parse();
        this.check();
    }

    public String getProxy() {
        return proxy;
    }

    public String getProxyType() {
        return proxyType;
    }
}
