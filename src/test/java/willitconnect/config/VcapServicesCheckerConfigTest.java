package willitconnect.config;

import org.junit.Test;
import willitconnect.service.VcapServicesChecker;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;

public class VcapServicesCheckerConfigTest {

    /**
     * WARNING!
     * This test assumes you don't have VCAP_SERVICES set in your
     * environment when running it!
     */
    @Test
    public void itHandlesANullVcapServices() {
        VcapServicesCheckerConfig config = new VcapServicesCheckerConfig();
        VcapServicesChecker checker = config.newVcapServicesChecker();
        assertThat(checker.getConnectionResults(), hasSize(0));

    }
}