package willitconnect.controller.service;

import org.json.JSONObject;
import org.junit.Test;
import willitconnect.controller.model.CheckedEntry;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
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
        JSONObject vcapServices = new JSONObject();
        checker.check(vcapServices);
    }

    @Test
    public void itShouldFindOnehostnameToCheck() {
        List<CheckedEntry> shouldBeAHostName = checker.check(new JSONObject(vcapServices));
        assertThat(shouldBeAHostName, hasSize(1));
    }

}
