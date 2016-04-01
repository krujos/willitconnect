package willitconnect.controller;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.CheckedEntry;
import willitconnect.service.EntryChecker;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class WillItConnectV2ControllerURLTest {
    private MockMvc mockMvc;

    static String TARGET = "https://pivotal.io";
    static String PROXY = "proxy.example.com:80";
    static JSONObject REQUEST = new JSONObject().put("target", TARGET);

    static JSONObject PROXY_REQUEST = new JSONObject()
            .put("target", TARGET)
            .put("http_proxy", PROXY);

    CheckedEntry entry = new CheckedEntry(REQUEST.getString("target"));

    RestTemplate restTemplate = new RestTemplate();

    MockRestServiceServer mockServer;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectV2Controller(new EntryChecker(restTemplate))).build();

        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @After
    public void after() {
        mockServer.verify();
    }

    @Test
    public void itShouldConnectToAUrl() throws Exception {
        mockServer.expect(requestTo(TARGET)).andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        "<body>Hello World</body>", MediaType.TEXT_HTML));

        mockMvc.perform(get("/v2/willitconnect")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(REQUEST.toString()))
                .andExpect(jsonPath("$.canConnect", is(true)))
                .andExpect(jsonPath("$.entry", is(REQUEST.get("target"))))
                .andExpect(jsonPath("$.httpStatus", is(HttpStatus.OK.value())));
    }

    @Test
    public void itShouldConnectEvenIfTheHttpStatusIsBad() throws Exception {
        mockServer.expect(requestTo(TARGET)).andExpect(method(HttpMethod.GET))
                .andRespond(withBadRequest());

        mockMvc.perform(get("/v2/willitconnect")
                .contentType(MediaType.APPLICATION_JSON)
                .content(REQUEST.toString()))
                .andExpect(jsonPath("$.canConnect", is(true)))
                .andExpect(jsonPath("$.entry", is(REQUEST.get("target"))))
                .andExpect(jsonPath("$.httpStatus", is(HttpStatus.BAD_REQUEST.value())));
    }

    @Test
    public void itShouldConnectThroughAProxy() throws Exception {
        mockServer.expect(requestTo(TARGET)).andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess());

        mockMvc.perform(get("/v2/willitconnect")
                .contentType(MediaType.APPLICATION_JSON)
                .content(PROXY_REQUEST.toString()))
                .andExpect(jsonPath("$.canConnect", is(true)))
                .andExpect(jsonPath("$.httpProxy", is(PROXY)));

    }
}