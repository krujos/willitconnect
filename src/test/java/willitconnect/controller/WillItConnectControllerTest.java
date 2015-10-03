package willitconnect.controller;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import willitconnect.service.VcapServicesChecker;
import willitconnect.service.VcapServicesStrings;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class WillItConnectControllerTest {

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(
                    new WillItConnectController()).build();
    }

    @After
    public void tearDown() {

    }

    @Test
    public void resultsShouldReturnEmptyJsonWithNoServices() throws Exception {
        //TODO Temporary until we inject checkers
        VcapServicesChecker.checkVcapServices(new JSONObject()).getResults().clear();
        
        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void resultsShouldContainOneServiceWithVcapServices() throws Exception{

        VcapServicesChecker.checkVcapServices(
                new JSONObject(VcapServicesStrings.cleardb));

        byte[] res = mockMvc.perform(get("/serviceresults").accept(MediaType
                .APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                // It's false because we default everything to false before
                // parsing
                .andExpect(jsonPath("$[0].canConnect", is(false)))
                .andReturn().getResponse().getContentAsByteArray();
    }
}