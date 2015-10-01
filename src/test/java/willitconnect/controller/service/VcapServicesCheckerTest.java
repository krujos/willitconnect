package willitconnect.controller.service;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import willitconnect.controller.model.CheckedEntry;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

public class VcapServicesCheckerTest {

    VcapServicesChecker checker = new VcapServicesChecker();

    @Before
    public void before() {
        VcapServicesChecker.results = new ArrayList<CheckedEntry>();
    }

    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        checker.check(null);
    }

    @Test
    public void itShouldNotComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        checker.check(services);
    }

    @Test
    public void itShouldFindOneHostnameToCheck() {
        checker.check(
                new JSONObject(VcapServicesStrings.cleardb));

        List<CheckedEntry> shouldBeASingleHostName = VcapServicesChecker.results;
        assertThat(shouldBeASingleHostName, hasSize(1));
        assertThat(shouldBeASingleHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

}
