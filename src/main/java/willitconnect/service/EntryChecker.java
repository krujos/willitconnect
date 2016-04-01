package willitconnect.service;

import org.apache.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.io.IOException;
import java.sql.Date;
import java.time.Instant;

import static org.apache.log4j.Logger.getLogger;

class CustomResponseErrorHandler implements ResponseErrorHandler {

    private ResponseErrorHandler errorHandler = new DefaultResponseErrorHandler();

    public boolean hasError(ClientHttpResponse response) throws IOException {
        return errorHandler.hasError(response);
    }

    public void handleError(ClientHttpResponse response) throws IOException {
    }
}

@Service
public class EntryChecker {
    private final RestTemplate restTemplate;
    private Logger log = getLogger(EntryChecker.class);

    public EntryChecker(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        restTemplate.setErrorHandler(new CustomResponseErrorHandler());
    }

    public CheckedEntry check(CheckedEntry e, String proxy, int proxyPort,
                              String proxyType) {
        log.info("checking " + e.getEntry());
        if (e.isValidUrl()) {
            ResponseEntity<String> resp =
                    restTemplate.getForEntity(e.getEntry(), String.class);
            log.info("Status = "+ resp.getStatusCode());
            e.setCanConnect(true);
            e.setHttpStatus(resp.getStatusCode());
        } else if (e.isValidHostname()) {
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
