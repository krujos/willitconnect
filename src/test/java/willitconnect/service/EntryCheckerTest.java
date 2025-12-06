package willitconnect.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import willitconnect.model.CheckedEntry;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.sql.Date;
import java.time.Instant;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.junit.Assert.assertEquals;
import static willitconnect.model.CheckedEntry.DEFAULT_RESPONSE_TIME;

@RunWith(MockitoJUnitRunner.class)
public class EntryCheckerTest {

    private MockRestServiceServer mockServer;
    private CheckedEntry entry;
    private EntryChecker checker;
    private RestTemplate restTemplate;
    private CheckedEntry returnedEntry;
    private SimpleClientHttpRequestFactory requestFactory;

    @Before
    public void setUp() {
        entry = new CheckedEntry("http://example.com");
        restTemplate = new RestTemplate();
        requestFactory = new SimpleClientHttpRequestFactory();
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

    @Test
    public void itShouldUseProxyRequestFactoryAndRestoreOriginalAfterSuccess() {
        RestTemplate proxyAwareRestTemplate = spy(new RestTemplate());
        SimpleClientHttpRequestFactory originalFactory = new SimpleClientHttpRequestFactory();
        originalFactory.setConnectTimeout(1234);
        originalFactory.setReadTimeout(5678);
        proxyAwareRestTemplate.setRequestFactory(originalFactory);
        reset(proxyAwareRestTemplate);

        mockServer = MockRestServiceServer.createServer(proxyAwareRestTemplate);
        mockServer.expect(requestTo("http://example.com"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withServerError());

        EntryChecker proxyAwareChecker = new EntryChecker(proxyAwareRestTemplate);

        entry.setHttpProxy("proxy.example.com:8080");

        proxyAwareChecker.check(entry);

        ArgumentCaptor<ClientHttpRequestFactory> captor = ArgumentCaptor.forClass(ClientHttpRequestFactory.class);
        verify(proxyAwareRestTemplate, atLeast(2)).setRequestFactory(captor.capture());

        ClientHttpRequestFactory proxiedFactory = captor.getAllValues().get(0);
        assertThat(proxiedFactory, is(instanceOf(SimpleClientHttpRequestFactory.class)));

        SimpleClientHttpRequestFactory proxiedSimple = (SimpleClientHttpRequestFactory) proxiedFactory;
        Proxy proxy = (Proxy) ReflectionTestUtils.getField(proxiedSimple, "proxy");
        assertThat(proxy, is(notNullValue()));
        InetSocketAddress proxyAddress = (InetSocketAddress) proxy.address();
        assertThat(proxyAddress.getHostName(), is(equalTo("proxy.example.com")));
        assertThat(proxyAddress.getPort(), is(equalTo(8080)));

        Integer proxiedConnectTimeout = (Integer) ReflectionTestUtils.getField(proxiedSimple, "connectTimeout");
        Integer proxiedReadTimeout = (Integer) ReflectionTestUtils.getField(proxiedSimple, "readTimeout");
        Integer originalConnectTimeout = (Integer) ReflectionTestUtils.getField(originalFactory, "connectTimeout");
        Integer originalReadTimeout = (Integer) ReflectionTestUtils.getField(originalFactory, "readTimeout");

        assertThat(proxiedConnectTimeout, is(equalTo(originalConnectTimeout)));
        assertThat(proxiedReadTimeout, is(equalTo(originalReadTimeout)));
        assertThat(proxyAwareRestTemplate.getRequestFactory(), is((ClientHttpRequestFactory) originalFactory));
    }

    @Test
    public void itShouldRestoreRequestFactoryAfterProxyFailure() {
        RestTemplate proxyAwareRestTemplate = spy(new RestTemplate());
        SimpleClientHttpRequestFactory originalFactory = new SimpleClientHttpRequestFactory();
        proxyAwareRestTemplate.setRequestFactory(originalFactory);
        reset(proxyAwareRestTemplate);

        mockServer = MockRestServiceServer.createServer(proxyAwareRestTemplate);

        doThrow(new ResourceAccessException("boom"))
                .when(proxyAwareRestTemplate)
                .getForEntity(eq(entry.getEntry()), eq(String.class));

        EntryChecker proxyAwareChecker = new EntryChecker(proxyAwareRestTemplate);

        entry.setHttpProxy("proxy.example.com:8080");

        proxyAwareChecker.check(entry);

        verify(proxyAwareRestTemplate, atLeast(2)).setRequestFactory(any(ClientHttpRequestFactory.class));
        assertThat(proxyAwareRestTemplate.getRequestFactory(), is((ClientHttpRequestFactory) originalFactory));
    }
}
