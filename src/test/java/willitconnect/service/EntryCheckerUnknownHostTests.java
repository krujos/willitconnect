package willitconnect.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.powermock.api.mockito.PowerMockito.when;

public class EntryCheckerUnknownHostTests {

    @Mock
    RestTemplate template;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void itCannotConnectToUnknownHost() {
        when(template.getForEntity(any(String.class), any())).thenThrow(new
                ResourceAccessException("unknown host exception"));
        EntryChecker checker = new EntryChecker(template);
        CheckedEntry entry = new CheckedEntry("http://does_not_exist.com");

        CheckedEntry returnedEntry = checker.check(entry, null, 0, null);

        System.out.println("status = " + entry.getHttpStatus());
        assertFalse(returnedEntry.canConnect());
        assertThat(returnedEntry.getHttpStatus(), is(equalTo(0)));
    }

}
