package willitconnect.service.util;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.net.*;

public class Connection {
    private static Logger log = Logger.getLogger(Connection.class);

    public static boolean checkConnection(String host, int port) {
        logHost(host, port);
        Socket socket = new Socket();
        try {
            SocketAddress addr = new InetSocketAddress(
                    Inet4Address.getByName(host), port);
            socket.connect(addr, 3000);
            boolean connected = socket.isConnected();
            socket.close();
            if (connected) {
                return true;
            }
        } catch (IOException e) { }
        return false;
    }

    private static void logHost(String host, int port) {
        log.info("checking " + host +  ":" + port);
    }

    public static boolean checkProxyConnection(
            String host, int port, String proxyHost, int proxyPort,
            String proxyType) {
        logHost(host, port);
        String sanitizedProxyType = proxyType == null ? null : proxyType.trim();
        if (!"http".equalsIgnoreCase(sanitizedProxyType)) {
            throw new IllegalArgumentException("Proxy type must be http");
        }
        try {
            SocketAddress addr = new InetSocketAddress(
                    Inet4Address.getByName(host), port);
            SocketAddress proxyAddr = new InetSocketAddress(
                            Inet4Address.getByName(proxyHost), proxyPort);
            Proxy proxy = new Proxy(Proxy.Type.HTTP, proxyAddr);
            Socket socket = new Socket(proxy);
            socket.connect(addr, 3000);
            boolean connected = socket.isConnected();
            socket.close();
            if (connected) {
                return true;
            }
        } catch (IOException e) { }
        return false;
    }
}
