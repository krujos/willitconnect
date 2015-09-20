package willitconnect.controller.service;


import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static willitconnect.controller.service.HostMatcher.isHost;

public class HostMatcherTest {
    @Test
    public void itMatchesHost() {
        assertTrue(isHost("host"));
    }

    @Test
    public void itMatchesUpperCaseHost() {
        assertTrue(isHost("HOST"));
    }

    @Test
    public void itMatchesMixedCaseHost() {
        assertTrue(isHost("HosT"));
    }

    @Test
    public void itMatchesHostname() {
        assertTrue(isHost("hostname"));
    }

    @Test
    public void itMatchesMixedCaseHostname() {
        assertTrue(isHost("HostName"));
    }

    @Test
    public void itDoesNOtMatchFoo() {
        assertFalse(isHost("foo"));
    }

    @Test
    public void itDoesNotMatchEmptyString() {
        assertFalse(isHost(""));
    }
}
