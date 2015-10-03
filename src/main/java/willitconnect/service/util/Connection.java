package willitconnect.service.util;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.Proxy;

public class Connection {
    public static boolean checkConnection(String host, int port) {
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

    public static boolean checkProxyConnection(String host, int port, String proxyHost, int proxyPort) {
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
