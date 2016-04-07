package willitconnect.controller;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;
import willitconnect.model.TracedEntry;
import willitconnect.service.EntryChecker;
import willitconnect.service.Tracer;
import willitconnect.service.util.Connection;

import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class WillItConnectV2ControllerHostnameTest {
    private MockMvc mockMvc;
    static JSONObject REQUEST = new JSONObject().put("target", "example.com:80");

    @Mock
    private Tracer tracer;

    @PrepareForTest(Connection.class)

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectV2Controller(
                        new EntryChecker(new RestTemplate()), tracer)).build();
    }

    @Test
    public void itShouldConnectToAHost() throws Exception {
        mockMvc.perform(get("/v2/willitconnect")
                .contentType(MediaType.APPLICATION_JSON)
                .content(REQUEST.toString()))
                .andExpect(jsonPath("$.canConnect", is(true)))
                .andExpect(jsonPath("$.validHostname", is(true)))
                .andExpect(jsonPath("$.validUrl", is(false)))
                .andExpect(jsonPath("$.entry", is(REQUEST.get("target"))))
                .andExpect(jsonPath("$.httpStatus", is(0)))
                .andExpect(status().isOk());
    }

    @Test
    public void itShouldTraceAnAddress() throws Exception {
        TracedEntry entry =
                new TracedEntry(REQUEST.getString("target"))
                                .setTrace(WillitConnectV2ControllerTestStrings.traceroute);


        when(tracer.trace(any(TracedEntry.class))).thenReturn(entry);

        mockMvc.perform(post("/v2/traceroute").contentType(MediaType
                .APPLICATION_JSON).content(REQUEST.toString()))
        .andExpect(jsonPath("$.trace",
                is(WillitConnectV2ControllerTestStrings.traceroute)))
        .andExpect(jsonPath("$.entry", is(REQUEST.get("target"))))
        .andExpect(status().isOk());
    }
}