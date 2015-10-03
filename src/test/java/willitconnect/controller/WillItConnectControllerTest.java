package willitconnect.controller;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import willitconnect.model.CheckedEntry;
import willitconnect.service.VcapServicesChecker;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
public class WillItConnectControllerTest {

    private MockMvc mockMvc;

    @Mock
    VcapServicesChecker checker;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void resultsShouldReturnEmptyJsonWithNoServices() throws Exception {
        when(checker.getResults()).thenReturn(new ArrayList<>());

        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectController(checker)).build();

        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void resultsShouldContainOneServiceWithVcapServices() throws Exception{
        List<CheckedEntry> entryList = new ArrayList<>();
        entryList.add(new CheckedEntry("foo"));
        entryList.add(new CheckedEntry("bar"));

        when(checker.getResults()).thenReturn(entryList);
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectController(checker)).build();

        mockMvc.perform(get("/serviceresults").accept(MediaType
                .APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                // It's false because we default everything to false before
                // parsing
                .andExpect(jsonPath("$[0].canConnect", is(false)));
    }
}