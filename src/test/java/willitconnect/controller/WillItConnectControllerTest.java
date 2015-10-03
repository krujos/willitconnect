package willitconnect.controller;

import org.json.JSONObject;
import org.junit.After;
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

    VcapServicesChecker checker;

    @After
    public void tearDown() {
        //TODO stop exposing the implementation of services checker.
        checker.getResults().clear();
    }
    @Test
    public void resultsShouldReturnEmptyJsonWithNoServices() throws Exception {

        checker = VcapServicesChecker.checkVcapServices(new JSONObject());
        
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectController(checker)).build();

        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void resultsShouldContainOneServiceWithVcapServices() throws Exception{

        checker = VcapServicesChecker.checkVcapServices(
                new JSONObject(VcapServicesStrings.cleardb));

        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectController(checker)).build();

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