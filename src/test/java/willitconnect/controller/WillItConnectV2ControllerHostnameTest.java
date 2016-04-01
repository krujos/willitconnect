package willitconnect.controller;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;
import willitconnect.service.EntryChecker;
import willitconnect.service.util.Connection;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class WillItConnectV2ControllerHostnameTest {

    private MockMvc mockMvc;
    static JSONObject REQUEST = new JSONObject().put("target", "example.com:80");

    @PrepareForTest(Connection.class)

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectV2Controller(
                        new EntryChecker(new RestTemplate()))).build();
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
                .andExpect(jsonPath("$.httpStatus", is(0)));
    }
}