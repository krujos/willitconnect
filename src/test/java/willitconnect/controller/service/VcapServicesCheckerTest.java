package willitconnect.controller.service;

import org.json.JSONObject;
import org.junit.Test;
import willitconnect.controller.model.CheckedEntry;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

public class VcapServicesCheckerTest {

    String vcapServices="{'cleardb': [{'credentials': " +
            "{" +
                "'hostname':'us-cdbr-iron-east-02.cleardb.net'," +
                "'jdbcUrl': 'jdbc:mysql://us-cdbr-iron-east-02.cleardb.net/ad_d0a5bca8ed4c8e2?user=bcecef672208bf\u0026password=fd270135'," +
                "'name': 'ad_d0a5bca8ed4c8e2'," +
                "'password': 'fd270135'," +
                "'port': '3306'," +
                "'uri': 'mysql://bcecef672208bf:fd270135@us-cdbr-iron-east-02.cleardb.net:3306/ad_d0a5bca8ed4c8e2?reconnect=true'," +
                "'username': 'bcecef672208bf'" +
            "}," +
            "'label': 'cleardb'," +
            "'name': 'hellodb'," +
            "'plan': 'spark'," +
            "'tags': ['Data Stores','Data Store','relational','mysql']" +
            "}]}";
    VcapServicesChecker checker = new VcapServicesChecker();


    @Test(expected = NullPointerException.class)
    public void itShouldComplainAboutNullVcapServices() {
        checker.check(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void itShouldComplainAboutEmptyVcapServices() {
        JSONObject services = new JSONObject();
        checker.check(services);
    }

    @Test
    public void itShouldFindOneHostnameToCheckInASimpleObject() {
        JSONObject services = new JSONObject("{ 'hostname': 'example.com' }");

        List<CheckedEntry> shouldBeAHostName =
                checker.check(services);

        assertThat(shouldBeAHostName, hasSize(1));
        assertThat(shouldBeAHostName.get(0).getEntry(),
                is(equalTo("example.com")));
    }

    @Test
    public void itFindsAnObjectWithAHostnameInAnArray() {
        JSONObject services = new JSONObject(
            "{a:[{'hostname':'example.com'},'foo',{'hostname':'example.com'}]}");

        List<CheckedEntry> shouldBeAHostName =
                checker.check(services);

        assertThat(shouldBeAHostName, hasSize(2));
        assertThat(shouldBeAHostName.get(0).getEntry(),
                is(equalTo("example.com")));
    }
    @Test
    public void itShouldFindOneHostnameToCheck() {
        List<CheckedEntry> shouldBeAHostName = checker.check(new JSONObject(vcapServices));
        assertThat(shouldBeAHostName, hasSize(1));
        assertThat(shouldBeAHostName.get(0).getEntry(),
                is(equalTo("us-cdbr-iron-east-02.cleardb.net")));
    }

}
