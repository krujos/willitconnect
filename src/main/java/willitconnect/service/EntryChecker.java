package willitconnect.service;

import org.apache.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
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

    public CheckedEntry check(CheckedEntry e) {
        log.info("checking " + e.getEntry());

        if (e.isValidUrl()) {
            try {
                ClientHttpRequestFactory oldFactory = null;
                if ( null != e.getHttpProxy() ) {
                    oldFactory = swapProxy(e);
                }

                ResponseEntity<String> resp =
                        restTemplate.getForEntity(e.getEntry(), String.class);

                if ( null != oldFactory ) {
                    restTemplate.setRequestFactory(oldFactory);
                }

                log.info("Status = " + resp.getStatusCode());
                e.setCanConnect(true);
                e.setHttpStatus(resp.getStatusCode());
            } catch (ResourceAccessException ex) {
                e.setCanConnect(false);
            }
            e.setLastChecked(Date.from(Instant.now()));

        } else if (e.isValidHostname()) {
            String hostname = getHostname(e);
            int port = getPort(e, hostname);
            if (null != e.getHttpProxy()) {
                String proxy = e.getHttpProxy().split(":")[0];
                int proxyPort = Integer.parseInt(e.getHttpProxy().split(":")[1]);

                e.setCanConnect(
                        Connection.checkProxyConnection(
                                hostname, port, proxy, proxyPort, "http"));
            } else {
                e.setCanConnect(Connection.checkConnection(hostname, port));
            }
            e.setLastChecked(Date.from(Instant.now()));

        } else {
            log.error(e.getEntry() + " is not a valid hostname");
        }
        return e;
    }

    private ClientHttpRequestFactory swapProxy(CheckedEntry e) {
        ClientHttpRequestFactory oldFactory;
        oldFactory = restTemplate.getRequestFactory();

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();

        Proxy proxy= new Proxy(Proxy.Type.HTTP,
                new InetSocketAddress(
                    e.getHttpProxy().split(":")[0],
                    Integer.parseInt(e.getHttpProxy().split(":")[1]
                    )));
        requestFactory.setProxy(proxy);

        return oldFactory;
    }

    private int getPort(CheckedEntry e, String hostname) {
        return Integer.parseInt(e.getEntry().substring(
                hostname.length() + 1,
                e.getEntry().length()));
    }

    private String getHostname(CheckedEntry e) {
        return e.getEntry().split(":")[0];
    }

}
