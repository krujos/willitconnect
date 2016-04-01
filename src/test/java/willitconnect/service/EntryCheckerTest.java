package willitconnect.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.testng.AssertJUnit.assertEquals;

public class EntryCheckerTest {

    private MockRestServiceServer mockServer;
    private CheckedEntry entry;
    private EntryChecker checker;

    @Before
    public void setUp() {
        entry = new CheckedEntry("http://example.com");
        RestTemplate restTemplate = new RestTemplate();
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
        CheckedEntry returnedEntry = checker.check(entry, null, 0, null);
        assertTrue(returnedEntry.canConnect());
    }

    @Test
    public void itShouldReturnTheHttpResponse() {
        CheckedEntry returnedEntry = checker.check(entry, null, 0, null);
        assertEquals(returnedEntry.getHttpStatus(), HttpStatus
                .INTERNAL_SERVER_ERROR.value());
    }
}