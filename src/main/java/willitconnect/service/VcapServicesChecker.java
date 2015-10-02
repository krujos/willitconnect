package willitconnect.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;
import willitconnect.service.util.EntryConsumer;

import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;

/**
 * Checks VCAP_SERVICES for keys named host and values that look like URI's
 */
public class VcapServicesChecker {

    public static volatile ArrayList<CheckedEntry> results;

    private static Logger log = Logger.getLogger(VcapServicesChecker.class);

    public static void parse(JSONObject vcapServices) {
        java.util.Objects.requireNonNull(vcapServices);

        log.info(vcapServices);
        if (0 == vcapServices.length())
            return;

        ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

        vcapServices.keys().forEachRemaining(new EntryConsumer(entries, vcapServices));
        results = entries;
    }

    public static void check() {
        results.forEach(e -> {
            if (e.isValidHostname()) {
                String hostname = getHostname(e);
                int port = getPort(e, hostname);

                e.setCanConnect(Connection.checkConnection(hostname, port));
                e.setLastChecked(Date.from(Instant.now()));
            }
        });
    }

    private static int getPort(CheckedEntry e, String hostname) {
        return Integer.parseInt(e.getEntry().substring(
                hostname.length() + 1,
                e.getEntry().length()));
    }

    private static String getHostname(CheckedEntry e) {
        return e.getEntry().substring(0, e.getEntry().indexOf(':'));
    }
}
