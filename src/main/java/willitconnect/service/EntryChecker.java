package willitconnect.service;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.sql.Date;
import java.time.Instant;

import static org.apache.log4j.Logger.getLogger;

@Service
public class EntryChecker {
    private Logger log = getLogger(EntryChecker.class);

    public CheckedEntry check(CheckedEntry e, String proxy, int proxyPort,
                              String proxyType) {
        log.info("checking " + e.getEntry());
        if (e.isValidHostname()) {
            String hostname = getHostname(e);
            int port = getPort(e, hostname);
            if (null != proxy) {
                e.setCanConnect(
                        Connection.checkProxyConnection(
                                hostname, port, proxy, proxyPort,
                                proxyType));
            } else {
                e.setCanConnect(Connection.checkConnection(hostname, port));
            }
            e.setLastChecked(Date.from(Instant.now()));
        } else if (e.isValidUrl() ){
            e.setCanConnect(true);
        } else {
            log.error(e.getEntry() + " is not a valid hostname");
        }
        return e;
    }

    private int getPort(CheckedEntry e, String hostname) {
        return Integer.parseInt(e.getEntry().substring(
                hostname.length() + 1,
                e.getEntry().length()));
    }

    private String getHostname(CheckedEntry e) {
        return e.getEntry().substring(0, e.getEntry().indexOf(':'));
    }

}
