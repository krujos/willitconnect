package willitconnect;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import willitconnect.service.VcapServicesChecker;

@SpringBootApplication
public class WillItConnectApplication {
    private Logger log = Logger.getLogger(WillItConnectApplication.class);

    //Wherein we break encapsulation rules to make testing easy
    public static String vcapServices = System.getenv("VCAP_SERVICES");

    public WillItConnectApplication() {
        log.info("VCAP_SERVICES = " + vcapServices);
        if (null != vcapServices) {
            VcapServicesChecker.parse(new JSONObject(vcapServices));
            VcapServicesChecker.check();
            log.info("Finished checking VCAP_SERVICES");
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(WillItConnectApplication.class, args);
    }
}

