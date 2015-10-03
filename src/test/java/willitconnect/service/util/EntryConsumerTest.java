package willitconnect.service.util;

import org.json.JSONObject;
import org.junit.Test;
import willitconnect.model.CheckedEntry;
import willitconnect.service.VcapServicesStrings;

import java.util.ArrayList;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class EntryConsumerTest {
    ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

    @Test
    public void itShouldFindOneHostnameToCheckInASimpleObject() {
        JSONObject services = new JSONObject("{ 'hostname': 'example.com:1212' }");
        EntryConsumer consumer = new EntryConsumer(entries, services);
        consumer.accept("hostname");
        String shouldBeAHostName = entries.get(0).getEntry();
        
        assertThat(entries, hasSize(1));
        assertThat(shouldBeAHostName, is(equalTo("example.com:1212")));
    }

    @Test
    public void itFindsAnObjectWithAHostnameInAnArray() {
        JSONObject services = new JSONObject(
                "{a:[{'hostname':'example.com:1000'},'foo'," +
                        "{'hostname':'example2.com:1000'}]}");
        EntryConsumer consumer = new EntryConsumer(entries, services);
        consumer.accept("a");

        String shoudlBeExampleDotCom = entries.get(0).getEntry();
        assertThat(entries, hasSize(2));
        assertThat(shoudlBeExampleDotCom, is(equalTo("example.com:1000")));
    }
    
    @Test
    public void itShouldFindTwoHostnamesToCheck() {
        EntryConsumer consumer =
                new EntryConsumer(
                        entries, new JSONObject(VcapServicesStrings.cleardb));
        consumer.accept("cleardb");

        String shouldBeAHostName = entries.get(0).getEntry();

        assertThat(entries, hasSize(2));
        assertThat(shouldBeAHostName,
                is(equalTo("us-cdbr-iron-east-02.cleardb.net:3306")));
    }

    @Test
    public void itShouldBeInvalidIfAHostnameDoesNotHaveAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'example.com'}]}"));

        consumer.accept("a");

        CheckedEntry shouldNotBeValid = entries.get(0);
        assertFalse(shouldNotBeValid.isValidHostname());
    }

    @Test
    public void itShouldBeValidIfTheHostnameHasAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'example:8212'}]}"));

        consumer.accept("a");

        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValidHostname());
    }

    @Test
    public void itShouldBeValidIfTheFQDNHasAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com:8212'}]}"));

        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValidHostname());

    }

    @Test
    public void itShouldProduceAHostWithAPortWhenItIsPartOfTheKey() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com:8212'}]}"));

        consumer.accept("a");
        CheckedEntry shouldHavePort = entries.get(0);
        assertTrue(shouldHavePort.getEntry().matches(".*:\\d+"));
    }

    @Test
    public void itShouldProduceAHostWIthAPortWhenThePortIsAPeerToTheHostname() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com', " +
                        "'port': 3210}]}"));

        consumer.accept("a");
        CheckedEntry shouldHavePort = entries.get(0);
        String port = getPort(shouldHavePort);
        assertEquals(port, "3210");
        assertTrue(shouldHavePort.getEntry().matches(".*:\\d+"));
        assertTrue(shouldHavePort.isValidHostname());
    }

    private String getPort(CheckedEntry shouldHavePort) {
        return shouldHavePort.getEntry().substring(shouldHavePort.getEntry()
                .length() - 4);
    }

    @Test
    public void itGetsThePortCorrectlyWhenItsAString() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'hostname':'foo.example.com', " +
                        "'port': '3210'}]}"));

        consumer.accept("a");
        CheckedEntry shouldHavePort = entries.get(0);
        String port = getPort(shouldHavePort);
        assertEquals(port, "3210");
        assertTrue(shouldHavePort.getEntry().matches(".*:\\d+"));
        assertTrue(shouldHavePort.isValidHostname());
    }

    @Test
    public void itShouldAcceptAUrl() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'url':'http://foo.example.com:3210'}]}"));
        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValidHostname());
        String entry = shouldBeValid.getEntry();
        String port = entry.substring(entry.length() - 4);
        assertEquals("3210", port);
    }

    @Test
    public void itShouldAcceptAUrlWithoutAPort() {
        EntryConsumer consumer  = new EntryConsumer(entries,
                new JSONObject("{a:[{'url':'http://foo.example.com'}]}"));
        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);
        assertTrue(shouldBeValid.isValidHostname());
        String entry = shouldBeValid.getEntry();
        String port = entry.substring(entry.length() - 2);
        assertEquals("80", port);
    }

    @Test
    public void itHandlesAMySQLUri() {
        EntryConsumer consumer = new EntryConsumer(
                entries, new JSONObject(
                "{a: [{'uri': 'mysql://bcecef672208bf:fd270135@us-cdbr-iron" +
                        "-east-02.cleardb" +
                        ".net:3306/ad_d0a5bca8ed4c8e2?reconnect=true'}]}"));

        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);
    }

    @Test
    public void itHandlesASyslogUrl() {
        EntryConsumer consumer = new EntryConsumer(
                entries, new JSONObject(
                "{a: [{'syslog_drain_url': 'syslog://papertrailapp.com:12434'}]}"));

        consumer.accept("a");
        CheckedEntry shouldBeValid = entries.get(0);

    }

}
