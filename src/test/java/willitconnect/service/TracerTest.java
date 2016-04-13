package willitconnect.service;

import org.junit.Test;
import willitconnect.model.TracedEntry;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;

public class TracerTest {

    TracedEntry te = new TracedEntry("http://example.com");

    Tracer tracer = new Tracer();


    @Test
    public void itShouldAddOutputToTheTracedEntry() {
        TracedEntry returnedTE = tracer.trace(te, e -> Collections.emptyList());
        assertThat(returnedTE.getTrace(), is(notNullValue()));
    }

    @Test
    public void itCallsTracerouteWithTheEntry() {
        final boolean[] isCalled = {false};
        class ProcessValidator implements ProcessExecutor {
            @Override
            public List<String> execute(String[] command) {
                assertThat(command, is(equalTo(
                        new String[]{"traceroute", "http://example.com"})));
                isCalled[0] = true;
                return Collections.emptyList();
            }
        };

        tracer.trace(te, new ProcessValidator());
        assertThat(isCalled[0], is(true));
    }
}