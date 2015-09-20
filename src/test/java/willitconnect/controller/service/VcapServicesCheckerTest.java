package willitconnect.controller.service;

import org.json.JSONObject;
import org.junit.Test;

public class VcapServicesCheckerTest {

    VcapServicesChecker checker = new VcapServicesChecker();


    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        checker.check(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void itShouldComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        checker.check(services);
    }
}
