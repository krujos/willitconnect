package willitconnect.controller.service.util;

import org.json.JSONObject;
import org.junit.Test;
import willitconnect.controller.model.CheckedEntry;
import willitconnect.controller.service.VcapServicesStrings;

import java.util.ArrayList;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class EntryConsumerTest {
    ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

    @Test
    public void itShouldFindOneHostnameToCheckInASimpleObject() {
        JSONObject services = new JSONObject("{ 'hostname': 'example.com' }");
        EntryConsumer consumer = new EntryConsumer(entries, services);
        consumer.accept("hostname");
        String shouldBeAHostName = entries.get(0).getEntry();
        
        assertThat(entries, hasSize(1));
        assertThat(shouldBeAHostName, is(equalTo("example.com")));
    }

    @Test
    public void itFindsAnObjectWithAHostnameInAnArray() {
        JSONObject services = new JSONObject(
                "{a:[{'hostname':'example.com'},'foo',{'hostname':'example.com'}]}");
        EntryConsumer consumer = new EntryConsumer(entries, services);
        consumer.accept("a");

        String shouldBeAHostName = entries.get(0).getEntry();
        assertThat(entries, hasSize(2));
        assertThat(shouldBeAHostName, is(equalTo("example.com")));
    }
    
    @Test
    public void itShouldFindOneHostnameToCheck() {
        EntryConsumer consumer =
                new EntryConsumer(
                        entries, new JSONObject(VcapServicesStrings.cleardb));
        consumer.accept("cleardb");

        String shouldBeAHostName = entries.get(0).getEntry();

        assertThat(entries, hasSize(1));
        assertThat(shouldBeAHostName, is(equalTo("us-cdbr-iron-east-02.cleardb.net")));
    }

    @Test
    public void itShouldBeInvalidIfAHostnameDoesNotHaveAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'example.com'}]}"));

        consumer.accept("a");

        CheckedEntry shouldNotBeValid = entries.get(0);
        assertFalse(shouldNotBeValid.isValid());
    }

    @Test
    public void itShouldBeValidIfTheHostnameHasAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'example:8212'}]}"));

        consumer.accept("a");

        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValid());
    }

    @Test
    public void itShouldBeValidIfTheFQDNHasAPot() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com:8212'}]}"));

        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValid());

    }

    @Test
    public void itShouldProduceAHostWithAPortWhenItIsPartOfTheKey() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com:8212'}]}"));

        consumer.accept("a");
        CheckedEntry shouldHavePort = entries.get(0);
        assertTrue(shouldHavePort.getEntry().matches(".*:\\d+"));
    }
//
//    @Test
//    public void itShouldProduceAHostWIthAPortWhenThePortIsAPeerToTheHostname() {
//        fail("nyi")
//    }
}
