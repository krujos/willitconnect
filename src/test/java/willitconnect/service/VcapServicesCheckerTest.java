package willitconnect.service;

import org.json.JSONObject;
import org.junit.After;
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
import static org.mockito.Mockito.times;
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Connection.class)
public class VcapServicesCheckerTest {

    VcapServicesChecker checker;

    @After
    public void after() {
        VcapServicesChecker.getResults().clear();
    }

    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        VcapServicesChecker.checkVcapServices(null);
    }

    @Test
    public void itShouldNotComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        VcapServicesChecker.checkVcapServices(services);
    }

    @Test
    public void itShouldFindTwoHostnamesToCheck() {
        checker = VcapServicesChecker.checkVcapServices(
                new JSONObject(VcapServicesStrings.cleardb));

        List<CheckedEntry> shouldBeASingleHostName = checker.getResults();
        assertThat(shouldBeASingleHostName, hasSize(2));
        assertThat(shouldBeASingleHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
        assertThat(shouldBeASingleHostName.get(1).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

    @Test
    public void itShouldCheckOnlyValidHostnamesNewIface() {
        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        VcapServicesChecker.checkVcapServices(new JSONObject(json));
        assertThat(VcapServicesChecker.getResults().get(0).getLastChecked(),
                is(not(equalTo(Date.from(Instant.EPOCH)))));
        assertThat(VcapServicesChecker.getResults().get(1).getLastChecked(),
                is(equalTo(Date.from(Instant.EPOCH))));
    }

    @Test
    public void validHostsReceiveAConnectionCheck() {
        mockStatic(Connection.class);
        when(Connection.checkConnection("a.com", 80)).thenReturn(true);

        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        VcapServicesChecker.checkVcapServices(new JSONObject(json));

        verifyStatic(times(1));
        Connection.checkConnection("a.com", 80);
    }

    @Test
    public void successfulConnectionsAreReflectedInTheResultsSet() {
        mockStatic(Connection.class);
        when(Connection.checkConnection("a.com", 80)).thenReturn(true);

        String json = "{ a: [{'hostname':'a.com:80'},{'hostname':'e.com'}]}";
        checker = VcapServicesChecker.checkVcapServices(new JSONObject(json));

        assertTrue(checker.getResults().get(0).canConnect());
        assertFalse(checker.getResults().get(1).canConnect());
    }

    @Test
    public void itShouldHandleAnEmptyVcapServices() {
        checker = VcapServicesChecker.checkVcapServices(new JSONObject("{}"));
        assertThat(checker.getResults(), hasSize(0));
    }

}
