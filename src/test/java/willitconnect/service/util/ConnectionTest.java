package willitconnect.service.util;

import org.junit.Test;

import static org.junit.Assert.assertFalse;

public class ConnectionTest {

    @Test
    public void checkProxyConnectionAllowsNonInternedHttpProxyType() {
        String nonInternedHttp = new String("http");

        boolean canConnect = Connection.checkProxyConnection(
                "example.invalid", 80,
                "proxy.invalid", 8080,
                nonInternedHttp);

        assertFalse("Connection attempt should fail without throwing due to proxy type", canConnect);
    }
}
