package willitconnect.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;

import java.sql.Date;
import java.time.Instant;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.testng.AssertJUnit.assertEquals;
import static willitconnect.model.CheckedEntry.DEFAULT_RESPONSE_TIME;

public class EntryCheckerTest {

    private MockRestServiceServer mockServer;
    private CheckedEntry entry;
    private EntryChecker checker;
    private RestTemplate restTemplate;
    private CheckedEntry returnedEntry;

    @Mock
    SimpleClientHttpRequestFactory requestFactory;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        entry = new CheckedEntry("http://example.com");
        restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(requestFactory);
        mockServer = MockRestServiceServer.createServer(restTemplate);
        mockServer.expect(requestTo("http://example.com"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withServerError());

        checker = new EntryChecker(restTemplate);

    }

    @After
    public void after() {
        mockServer.verify();
    }

    @Test
    public void itShouldConnectEvenWithABadStatus() throws Exception {
        returnedEntry = checker.check(entry);

        assertTrue(returnedEntry.canConnect());
    }

    @Test
    public void itShouldReturnTheHttpResponse() {
        returnedEntry = checker.check(entry);

        assertEquals(returnedEntry.getHttpStatus(), HttpStatus
                .INTERNAL_SERVER_ERROR.value());
    }

    @Test
    public void itShouldSetTheLastCheckedTime() {
        returnedEntry = checker.check(entry);

        assertThat(returnedEntry.getLastChecked(),
                is(greaterThan(Date.from(Instant.EPOCH))));
    }
    @Test
    public void itShouldConnectToAURLThroughAProxy() {
        entry.setHttpProxy("proxy.example.com:8080");
        CheckedEntry returnedEntry = checker.check(entry);

        assertThat(returnedEntry.getHttpProxy(),
                is(equalTo("proxy.example.com:8080")));
    }

    @Test
    public void itShouldSayHowLongItTookToConnect() {
        CheckedEntry returnedEntry = checker.check(entry);

        assertThat(returnedEntry.getResponseTime(), is(not(equalTo(DEFAULT_RESPONSE_TIME))));
    }
}