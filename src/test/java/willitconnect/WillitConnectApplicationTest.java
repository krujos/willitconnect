package willitconnect;

import org.junit.Test;
import org.mockito.Mock;
import willitconnect.controller.service.VcapServicesChecker;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class WillItConnectApplicationTest {


    @Mock
    VcapServicesChecker mockChecker;

    static {
        System.setProperty("VCAP_SERVICES", "{'foo':'bar'}");
    }

    @Test
    public void itShouldCheckServicesOnStartup() {

        WillItConnectApplication shouldHaveCalledCheckServices =
                new WillItConnectApplication();

        verify(mockChecker, times(1)).check(any());
    }
}
