package willitconnect.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.EntryConsumer;

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
    private EntryChecker checker;

    public List<CheckedEntry> getConnectionResults() {
        return results;
    }

    public VcapServicesChecker(JSONObject vcapServices) {
        log.info("Creating service checker with " + vcapServices);
        this.vcapServices = vcapServices;
        checker = new EntryChecker();
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
        results.forEach(e -> checkEntry(e));
    }

    public void checkEntry(CheckedEntry e) {
        checker.check(e, proxy, proxyPort, proxyType);
    }

    private boolean hasProxy() {
        return null != getProxy();
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
