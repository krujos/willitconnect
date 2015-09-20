package willitconnect.controller.service;


import org.junit.Test;

public class HostMatcherTest {

    HostMatcher matcher = new HostMatcher();

    @Test
    public void itMatchesHost() {
        matcher.isHost("host");
    }
}
