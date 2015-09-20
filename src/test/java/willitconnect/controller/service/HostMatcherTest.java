package willitconnect.controller.service;


import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class HostMatcherTest {

    HostMatcher matcher = new HostMatcher();

    @Test
    public void itMatchesHost() {
        assertTrue(matcher.isHost("host"));
    }

    @Test
    public void itMatchesUpperCaseHost() {
        assertTrue(matcher.isHost("HOST"));
    }

    @Test
    public void itMatchesMixedCaseHost() {
        assertTrue(matcher.isHost("HosT"));
    }

    @Test
    public void itMatchesHostname() {
        assertTrue(matcher.isHost("hostname"));
    }

    @Test
    public void itMatchesMixedCaseHostname() {
        assertTrue(matcher.isHost("HostName"));
    }

    @Test
    public void itDoesNOtMatchFoo() {
        assertFalse(matcher.isHost("foo"));
    }
}
