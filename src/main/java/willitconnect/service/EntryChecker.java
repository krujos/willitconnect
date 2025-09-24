package willitconnect.service;

import org.apache.log4j.Logger;
import org.apache.tomcat.jni.Time;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.lang.reflect.Field;
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
        long startTime = Instant.now().toEpochMilli();
        if (e.isValidUrl()) {
            checkUrl(e);
        } else if (e.isValidHostname()) {
            checkHostname(e);
        } else {
            log.error(e.getEntry() + " is not a valid hostname");
        }
        e.setResponseTime(Instant.now().toEpochMilli() - startTime);
        return e;
    }

    private void checkHostname(CheckedEntry e) {
        String hostname = e.getHostname();
        int port = e.getResolvedPort();
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
    }

    private void checkUrl(CheckedEntry e) {
        ClientHttpRequestFactory oldFactory = null;
        try {
            if ( null != e.getHttpProxy() ) {
                oldFactory = swapProxy(e);
            }

            ResponseEntity<String> resp =
                    restTemplate.getForEntity(e.getEntry(), String.class);

            log.info("Status = " + resp.getStatusCode());
            e.setCanConnect(true);
            e.setHttpStatus(resp.getStatusCode());
        } catch (ResourceAccessException ex) {
            e.setCanConnect(false);
        } finally {
            if ( null != oldFactory ) {
                restTemplate.setRequestFactory(oldFactory);
            }
            e.setLastChecked(Date.from(Instant.now()));
        }
    }

    private ClientHttpRequestFactory swapProxy(CheckedEntry e) {
        ClientHttpRequestFactory oldFactory = restTemplate.getRequestFactory();

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();

        if (oldFactory instanceof SimpleClientHttpRequestFactory) {
            SimpleClientHttpRequestFactory oldSimple = (SimpleClientHttpRequestFactory) oldFactory;
            Integer connectTimeout = extractTimeout(oldSimple, "connectTimeout");
            Integer readTimeout = extractTimeout(oldSimple, "readTimeout");

            if (connectTimeout != null) {
                requestFactory.setConnectTimeout(connectTimeout);
            }
            if (readTimeout != null) {
                requestFactory.setReadTimeout(readTimeout);
            }
        }

        Proxy proxy= new Proxy(Proxy.Type.HTTP,
                new InetSocketAddress(
                    e.getHttpProxy().split(":")[0],
                    Integer.parseInt(e.getHttpProxy().split(":")[1]
                    )));
        log.info("Using proxy " + proxy + " for " + e.getEntry());
        requestFactory.setProxy(proxy);

        restTemplate.setRequestFactory(requestFactory);

        return oldFactory;
    }

    private Integer extractTimeout(SimpleClientHttpRequestFactory factory, String fieldName) {
        Field field = ReflectionUtils.findField(SimpleClientHttpRequestFactory.class, fieldName);
        if (field != null) {
            ReflectionUtils.makeAccessible(field);
            Object value = ReflectionUtils.getField(field, factory);
            if (value instanceof Integer) {
                return (Integer) value;
            }
        }
        return null;
    }

}
