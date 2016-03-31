package willitconnect.service;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.sql.Date;
import java.time.Instant;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.times;
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Connection.class)
public class VcapServicesCheckerTest {

    VcapServicesChecker checker;

    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        new VcapServicesChecker(null);
    }

    @Test
    public void itShouldNotComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        new VcapServicesChecker(services);
    }

    @Test
    public void itShouldFindTwoHostnamesToCheck() {

        checker = new VcapServicesChecker(
                new JSONObject(VcapServicesStrings.cleardb));

        List<CheckedEntry> shouldBeASingleHostName = checker.getConnectionResults();
        assertThat(shouldBeASingleHostName, hasSize(2));
        assertThat(shouldBeASingleHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
        assertThat(shouldBeASingleHostName.get(1).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

    @Test
    public void itShouldCheckOnlyValidHostnames() {
        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        checker = new VcapServicesChecker(new JSONObject(json));
        assertThat(checker.getConnectionResults().get(0).getLastChecked(),
                is(not(equalTo(Date.from(Instant.EPOCH)))));
        assertThat(checker.getConnectionResults().get(1).getLastChecked(),
                is(equalTo(Date.from(Instant.EPOCH))));
    }

    @Test
    public void validHostsReceiveAConnectionCheck() {
        mockStatic(Connection.class);
        when(Connection.checkConnection("a.com", 80)).thenReturn(true);

        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        checker = new VcapServicesChecker(new JSONObject(json));
        checker.getConnectionResults();

        verifyStatic(times(1));
        Connection.checkConnection("a.com", 80);
    }

    @Test
    public void successfulConnectionsAreReflectedInTheResultsSet() {
        mockStatic(Connection.class);
        when(Connection.checkConnection("a.com", 80)).thenReturn(true);
        when(Connection.checkProxyConnection(anyString(), anyInt(),
                anyString(), anyInt(), anyString())).thenThrow(
                    new IllegalArgumentException());

        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        checker = new VcapServicesChecker(new JSONObject(json));

        assertTrue(checker.getConnectionResults().get(0).canConnect());
        assertFalse(checker.getConnectionResults().get(1).canConnect());

    }

    @Test
    public void itShouldHandleAnEmptyVcapServices() {
        checker = new VcapServicesChecker(new JSONObject("{}"));
        assertThat(checker.getConnectionResults(), hasSize(0));
    }

    @Test
    public void itShouldHandleAFullVcapServices() {
        checker = new VcapServicesChecker(
                new JSONObject("{ VCAP_SERVICES: " + VcapServicesStrings.cleardb + "}"));
        assertThat(checker.getConnectionResults(), hasSize(2));
    }

    @Test
    public void itUsesAHttpProxy() {
        String json = "{ a: [{'hostname':'a.com:80'}]}";
        checker = new VcapServicesChecker(new JSONObject(json));

        mockStatic(Connection.class);
        when(Connection.checkProxyConnection("a.com", 80, "proxy.com", 80,
                "http"))
                .thenReturn(true);
        when(Connection.checkConnection(anyString(), anyInt())).thenThrow(new
                IllegalArgumentException());

        checker.setProxy("proxy.com", 80, "http");
        assertTrue(checker.getConnectionResults().get(0).canConnect());
    }

    @Test
    public void itRemovesAHttpProxy() {
        String json = "{ a: [{'hostname':'a.com:80'}]}";
        checker = new VcapServicesChecker(new JSONObject(json));
        checker.setProxy("proxy.com", 80, "http");

        mockStatic(Connection.class);
        when(Connection.checkConnection("a.com", 80))
                .thenReturn(true);
        when(Connection.checkProxyConnection(anyString(), anyInt(), anyString(), anyInt(), anyString())).thenThrow(new
                IllegalArgumentException());

        checker.unSetProxy();

        assertTrue(checker.getConnectionResults().get(0).canConnect());
    }

}
