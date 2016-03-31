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
import willitconnect.model.CheckedEntry;
import willitconnect.service.EntryChecker;
import willitconnect.service.util.Connection;

import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class WillItConnectV2ControllerTest {
    private MockMvc mockMvc;

    static JSONObject REQUEST = new JSONObject().put("target", "https://pivotal.io");
    @Mock
    private EntryChecker entryChecker;

    @PrepareForTest(Connection.class)

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectV2Controller(entryChecker)).build();
    }

    @Test
    public void itShouldConnectToAUrl() throws Exception {
        CheckedEntry entry = new CheckedEntry(REQUEST.getString("target"));
        entry.setCanConnect(true);

        when(entryChecker.check(any(CheckedEntry.class))).thenReturn(entry);
        mockMvc.perform(get("/v2/willitconnect")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(REQUEST.toString()))
                .andExpect(jsonPath("$.canConnect", is(true)))
                .andExpect(jsonPath("$.entry", is(REQUEST.get("target"))));
    }
}