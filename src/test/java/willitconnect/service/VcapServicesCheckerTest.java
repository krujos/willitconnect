package willitconnect.service;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
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

    VcapServicesChecker checker = new VcapServicesChecker();

    @Before
    public void before() {
        //VcapServicesChecker.results = new ArrayList<CheckedEntry>();
    }

    @After
    public void after() {
        VcapServicesChecker.results.clear();
    }

    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        checker.parse(null);
    }

    @Test
    public void itShouldNotComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        checker.parse(services);
    }

    @Test
    public void itShouldFindTwoHostnamesToCheck() {
        checker.parse(
                new JSONObject(VcapServicesStrings.cleardb));

        List<CheckedEntry> shouldBeASingleHostName = VcapServicesChecker.results;
        assertThat(shouldBeASingleHostName, hasSize(2));
        assertThat(shouldBeASingleHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
        assertThat(shouldBeASingleHostName.get(1).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

    @Test
    public void itShodlCheckOnlyValidHostnames() {
        addValidAndInvalidResults();

        VcapServicesChecker.check();
        assertThat(VcapServicesChecker.results.get(0).getLastChecked(),
                is(not(equalTo(Date.from(Instant.EPOCH)))));
        assertThat(VcapServicesChecker.results.get(1).getLastChecked(),
                is(equalTo(Date.from(Instant.EPOCH))));
    }

    private void addValidAndInvalidResults() {
        VcapServicesChecker.results.add(new CheckedEntry(
                "amazon.com:80"));
        VcapServicesChecker.results.add(new CheckedEntry(
                "example.com"));
    }

    @Test
    public void validHostsReceiveAConnectionCheck() {
        mockStatic(Connection.class);

        when(Connection.checkConnection("amazon.com", 80)).thenReturn(true);
        addValidAndInvalidResults();

        VcapServicesChecker.check();

        verifyStatic(times(1));
        Connection.checkConnection("amazon.com", 80);
    }

    @Test
    public void successfulConnectionsAreReflectedInTheResultsSet() {
        mockStatic(Connection.class);
        when(Connection.checkConnection("amazon.com", 80)).thenReturn(true);
        addValidAndInvalidResults();

        VcapServicesChecker.check();
        assertTrue(VcapServicesChecker.results.get(0).canConnect());
        assertFalse(VcapServicesChecker.results.get(1).canConnect());
    }

    @Test
    public void itShouldHandleAnEmptyVcapServices() {
        VcapServicesChecker.parse(new JSONObject("{}"));
        VcapServicesChecker.check();
        assertThat(VcapServicesChecker.results, hasSize(0));
    }

    @Test
    public void itShouldHandleACallToCheckBeforeParseGracefully() {
        VcapServicesChecker.check();
        assertThat(VcapServicesChecker.results, hasSize(0));
    }
}
