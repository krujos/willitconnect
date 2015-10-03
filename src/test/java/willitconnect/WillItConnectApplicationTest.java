package willitconnect;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import willitconnect.service.VcapServicesChecker;
import willitconnect.service.VcapServicesStrings;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.MockitoAnnotations.initMocks;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;

@RunWith(PowerMockRunner.class)
@PrepareForTest(VcapServicesChecker.class)
public class WillItConnectApplicationTest {


    @Before
    public void before() {
        initMocks(this);
        mockStatic(VcapServicesChecker.class);
    }

    @Test
    public void itShouldParseServicesOnStartup() {
        WillItConnectApplication.vcapServices = "{}";
        WillItConnectApplication shouldHaveCalledParseServices =
                new WillItConnectApplication();

        verifyStatic(times(1));
        VcapServicesChecker.checkVcapServices(Matchers.any(JSONObject.class));

    }

    @Test
    public void itShouldCheckServicesOnStartup() {
        WillItConnectApplication.vcapServices =
                "{ VCAP_SERVICES: " + VcapServicesStrings.cleardb + "}";
        WillItConnectApplication shouldHaveCalledParseServices =
                new WillItConnectApplication();

        verifyStatic();
        VcapServicesChecker.checkVcapServices(Matchers.any(JSONObject.class));
    }

    @Test
    public void itDosentFreakOutWithNull() {
        WillItConnectApplication.vcapServices = null;
        WillItConnectApplication shouldHaveCalledCheckServices =
                new WillItConnectApplication();
        verifyStatic(never());
        VcapServicesChecker.checkVcapServices(Matchers.any(JSONObject.class));
    }
}
