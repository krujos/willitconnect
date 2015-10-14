package willitconnect.controller;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import willitconnect.model.CheckedEntry;
import willitconnect.service.VcapServicesChecker;
import willitconnect.service.util.Connection;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class WillItConnectControllerTest {

    private MockMvc mockMvc;

    @Mock
    VcapServicesChecker checker;

    @PrepareForTest(Connection.class)

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(
                new WillItConnectController(checker)).build();
    }

    @Test
    public void resultsShouldReturnEmptyJsonWithNoServices() throws Exception {
        when(checker.getConnectionResults()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/serviceresults").accept(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void resultsShouldContainOneServiceWithVcapServices() throws Exception{
        List<CheckedEntry> entryList = new ArrayList<>();
        entryList.add(new CheckedEntry("foo"));
        entryList.add(new CheckedEntry("bar"));

        when(checker.getConnectionResults()).thenReturn(entryList);

        mockMvc.perform(get("/serviceresults").accept(MediaType
                .APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                // It's false because we default everything to false before
                // parsing
                .andExpect(jsonPath("$[0].canConnect", is(false)));
    }

    @Test
    public void itSavesAProxy() throws Exception {
        mockMvc.perform(put("/proxy")
                .param("proxy", "proxy.example.com:80")
                .param("proxyType", "http")
        ).andExpect(status().isOk());

        verify(checker).setProxy("proxy.example.com:80", "http");
    }
}