package willitconnect.service;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.times;
import static org.powermock.api.mockito.PowerMockito.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Connection.class)
public class VcapServicesCheckerTest {

    VcapServicesChecker checker = new VcapServicesChecker();

    @Before
    public void before() {
        VcapServicesChecker.results = new ArrayList<CheckedEntry>();
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
    public void itShouldFindOneHostnameToCheck() {
        checker.parse(
                new JSONObject(VcapServicesStrings.cleardb));

        List<CheckedEntry> shouldBeASingleHostName = VcapServicesChecker.results;
        assertThat(shouldBeASingleHostName, hasSize(1));
        assertThat(shouldBeASingleHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

    @Test
    public void itShodlCheckOnlyValidHostnames() {
        VcapServicesChecker.results.add(new CheckedEntry(Date.from(Instant.EPOCH),
                "amazon.com:80", false));
        VcapServicesChecker.results.add(new CheckedEntry(Date.from(Instant.EPOCH),
                "example.com", false));

        VcapServicesChecker.check();
        assertThat(VcapServicesChecker.results.get(0).getLastChecked(),
                is(not(equalTo(Date.from(Instant.EPOCH)))));
        assertThat(VcapServicesChecker.results.get(1).getLastChecked(),
                is(equalTo(Date.from(Instant.EPOCH))));
    }

    @Test
    public void validHostsReceiveAConnectionCheck() {
        mockStatic(Connection.class);

        when(Connection.checkConnection("amazon.com", 80)).thenReturn(true);
        VcapServicesChecker.results.add(new CheckedEntry(Date.from(Instant.EPOCH),
                "amazon.com:80", false));
        VcapServicesChecker.results.add(new CheckedEntry(Date.from(Instant.EPOCH),
                "example.com", false));

        VcapServicesChecker.check();

        verifyStatic(times(1));
        Connection.checkConnection("amazon.com", 80);
    }

    @Test
    public void successfulConnectionsAreReflectedInTheResultsSet() {
        
    }

}
