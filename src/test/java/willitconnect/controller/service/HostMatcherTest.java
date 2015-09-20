package willitconnect.controller.service;


import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class HostMatcherTest {

    HostMatcher matcher = new HostMatcher();

    @Test
    public void itMatchesHost() {
        assertTrue(matcher.isHost("host"));
    }
}
