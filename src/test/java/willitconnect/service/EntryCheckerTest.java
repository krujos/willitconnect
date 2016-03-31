package willitconnect.service;

import org.junit.Test;
import willitconnect.model.CheckedEntry;

import static org.junit.Assert.assertTrue;

public class EntryCheckerTest {

    @Test
    public void itShouldCheckAURL() throws Exception {
        CheckedEntry entry = new CheckedEntry("http://pivotal.io");
        EntryChecker checker = new EntryChecker();
        entry = checker.check(entry, null, 0, null);
        assertTrue(entry.canConnect());
    }
}