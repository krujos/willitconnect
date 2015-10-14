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
    private static Logger log = Logger.getLogger(VcapServicesChecker.class);
    private String proxy;
    private String proxyType;

    public static VcapServicesChecker checkVcapServices(JSONObject vcapServices) {
        VcapServicesChecker checker = new VcapServicesChecker();
        checker.parse(vcapServices);
        checker.check();
        return checker;
    }

    public List<CheckedEntry> getConnectionResults() {
        return results;
    }

    private VcapServicesChecker() {
        results = new ArrayList<>();
    }

    private volatile ArrayList<CheckedEntry> results;


    private void parse(JSONObject vcapServices) {
        java.util.Objects.requireNonNull(vcapServices);

        log.info(vcapServices);
        if (0 == vcapServices.length())
            return;

        vcapServices.keys().forEachRemaining(new EntryConsumer(results,
                vcapServices));
    }

    private void check() {
        results.forEach(e -> {
            if (e.isValidHostname()) {
                String hostname = getHostname(e);
                int port = getPort(e, hostname);
                e.setCanConnect(Connection.checkConnection(hostname, port));
                e.setLastChecked(Date.from(Instant.now()));
            }
        });
    }

    private int getPort(CheckedEntry e, String hostname) {
        return Integer.parseInt(e.getEntry().substring(
                hostname.length() + 1,
                e.getEntry().length()));
    }

    private String getHostname(CheckedEntry e) {
        return e.getEntry().substring(0, e.getEntry().indexOf(':'));
    }

    public void setProxy(String proxy, String proxyType) {
        this.proxy = proxy;
        this.proxyType = proxyType;
    }

    public String getProxy() {
        return proxy;
    }

    public String getProxyType() {
        return proxyType;
    }
}
