package willitconnect.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.*;

public class Connection {
    private static final Logger log = LoggerFactory.getLogger(Connection.class);

    public static boolean checkConnection(String host, int port) {
        logHost(host, port);

        // Use try-with-resources to ensure socket is always closed
        try (Socket socket = new Socket()) {
            SocketAddress addr = new InetSocketAddress(
                    Inet4Address.getByName(host), port);
            socket.connect(addr, 3000);
            return socket.isConnected();
        } catch (IOException e) {
            log.debug("Connection failed to {}:{} - {}", host, port, e.getMessage());
            return false;
        }
    }

    private static void logHost(String host, int port) {
        log.info("checking " + host +  ":" + port);
    }

    public static boolean checkProxyConnection(
            String host, int port, String proxyHost, int proxyPort,
            String proxyType) {
        logHost(host, port);

        // Validate proxy type
        String sanitizedProxyType = proxyType == null ? null : proxyType.trim();
        if (!"http".equalsIgnoreCase(sanitizedProxyType)) {
            throw new IllegalArgumentException("Proxy type must be http");
        }

        // Use try-with-resources to ensure socket is always closed
        try {
            SocketAddress addr = new InetSocketAddress(
                    Inet4Address.getByName(host), port);
            SocketAddress proxyAddr = new InetSocketAddress(
                    Inet4Address.getByName(proxyHost), proxyPort);
            Proxy proxy = new Proxy(Proxy.Type.HTTP, proxyAddr);

            try (Socket socket = new Socket(proxy)) {
                socket.connect(addr, 3000);
                return socket.isConnected();
            }
        } catch (IOException e) {
            log.debug("Proxy connection failed to {}:{} via {}:{} - {}",
                    host, port, proxyHost, proxyPort, e.getMessage());
            return false;
        }
    }
}
