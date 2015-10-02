package willitconnect.controller;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import willitconnect.service.VcapServicesChecker;
import willitconnect.service.VcapServicesStrings;

import java.util.ArrayList;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class WillItConnectControllerTest {

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        VcapServicesChecker.results = new ArrayList<>();

        mockMvc = MockMvcBuilders.standaloneSetup(
                    new WillItConnectController())
                .build();
    }

    @Test
    public void resultsShouldReturnEmptyJsonWithNoServices() throws Exception {
        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void resultsShouldContainOneServiceWithVcapServices() throws Exception{

        VcapServicesChecker.parse(
                new JSONObject(VcapServicesStrings.cleardb));

        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}