package willitconnect.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

class CustomResponseErrorHandler implements ResponseErrorHandler {

    private ResponseErrorHandler errorHandler = new DefaultRes
    ponseErrorHandler();

    public boolean hasError(ClientHttpResponse response) throws IOException {
        return errorHandler.hasError(response);
    }

    public void handleError(ClientHttpResponse response) throws IOException {
    }
}

@Service
public class EntryChecker {
    private final RestTemplate restTemplate;
    private static final Logger log = LoggerFactory.getLogger(EntryChecker.class);

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
            ProxyParts proxyParts = parseProxyString(e.getHttpProxy());
            if (proxyParts == null) {
                log.error("Invalid proxy format: " + e.getHttpProxy() + ". Expected format: host:port");
                e.setCanConnect(false);
            } else {
                e.setCanConnect(
                        Connection.checkProxyConnection(
                                hostname, port, proxyParts.host, proxyParts.port, "http"));
            }
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

        ProxyParts proxyParts = parseProxyString(e.getHttpProxy());
        if (proxyParts == null) {
            log.error("Invalid proxy format: " + e.getHttpProxy() + ". Expected format: host:port");
            throw new IllegalArgumentException("Invalid proxy format: " + e.getHttpProxy());
        }
        Proxy proxy = new Proxy(Proxy.Type.HTTP,
                new InetSocketAddress(proxyParts.host, proxyParts.port));
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

    /**
     * Safely parses a proxy string in the format "host:port".
     * 
     * @param proxyString the proxy string to parse
     * @return ProxyParts containing host and port, or null if the format is invalid
     */
    private ProxyParts parseProxyString(String proxyString) {
        if (proxyString == null || proxyString.trim().isEmpty()) {
            return null;
        }
        
        String[] parts = proxyString.split(":");
        if (parts.length != 2) {
            return null;
        }
        
        String host = parts[0].trim();
        String portStr = parts[1].trim();
        
        if (host.isEmpty() || portStr.isEmpty()) {
            return null;
        }
        
        try {
            int port = Integer.parseInt(portStr);
            if (port < 1 || port > 65535) {
                log.warn("Proxy port out of valid range (1-65535): " + port);
                return null;
            }
            return new ProxyParts(host, port);
        } catch (NumberFormatException e) {
            log.warn("Invalid proxy port format: " + portStr);
            return null;
        }
    }

    /**
     * Helper class to hold parsed proxy host and port.
     */
    private static class ProxyParts {
        final String host;
        final int port;
        
        ProxyParts(String host, int port) {
            this.host = host;
            this.port = port;
        }
    }

}
