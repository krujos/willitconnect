package willitconnect.model;

import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class CheckedEntryTest {

    @Test(expected = NullPointerException.class)
    public void cannotHaveANullEntry() {
        new CheckedEntry(null);
    }

    @Test
    public void isAValidHostName() {
        CheckedEntry e = new CheckedEntry("us-cdbr-iron-east-02.cleardb.net:3306");
        assertTrue(e.isValidHostname());
    }
}