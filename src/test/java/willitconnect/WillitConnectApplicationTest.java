package willitconnect;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import willitconnect.controller.service.VcapServicesChecker;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.MockitoAnnotations.initMocks;

@RunWith(PowerMockRunner.class)
@PrepareForTest(VcapServicesChecker.class)
public class WillItConnectApplicationTest {


    @Before
    public void before() {
        initMocks(this);
    }

    @Test
    public void itShouldCheckServicesOnStartup() {
        PowerMockito.mockStatic(VcapServicesChecker.class);

        WillItConnectApplication.vcapServices = "{}";
        WillItConnectApplication shouldHaveCalledCheckServices =
                new WillItConnectApplication();

        PowerMockito.verifyStatic(times(1));
    }

    @Test
    public void itDosentFreakOutWithNull() {
        WillItConnectApplication.vcapServices = null;
        WillItConnectApplication shouldHaveCalledCheckServices =
                new WillItConnectApplication();
        assertTrue(true);
    }
}
