package willitconnect.service;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;

import java.io.IOException;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;

public class EntryCheckerUnknownHostTests {

    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    private EntryChecker checker;

    @Before
    public void setUp() {
        restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);
        checker = new EntryChecker(restTemplate);
    }

    @Test
    public void itCannotConnectToUnknownHost() {
        CheckedEntry entry = new CheckedEntry("http://does_not_exist.com");

        mockServer.expect(requestTo("http://does_not_exist.com"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withException(new IOException("unknown host exception")));

        CheckedEntry returnedEntry = checker.check(entry);

        assertFalse(returnedEntry.canConnect());
        assertThat(returnedEntry.getHttpStatus(), is(equalTo(0)));
        mockServer.verify();
    }

}
