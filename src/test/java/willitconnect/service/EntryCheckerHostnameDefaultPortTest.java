package willitconnect.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;
import willitconnect.service.util.Connection;

import static org.junit.Assert.assertTrue;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Connection.class)
public class EntryCheckerHostnameDefaultPortTest {

    @Before
    public void setUp() {
        PowerMockito.mockStatic(Connection.class);
        PowerMockito.when(Connection.checkConnection("example.com", 80))
                .thenReturn(true);
    }

    @Test
    public void hostOnlyEntriesDefaultToPortEighty() {
        RestTemplate restTemplate = new RestTemplate();
        EntryChecker checker = new EntryChecker(restTemplate);
        CheckedEntry entry = new CheckedEntry("example.com");

        CheckedEntry result = checker.check(entry);

        PowerMockito.verifyStatic(Connection.class);
        Connection.checkConnection("example.com", 80);
        assertTrue(result.canConnect());
    }
}
