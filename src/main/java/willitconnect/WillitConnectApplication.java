package willitconnect;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import willitconnect.controller.service.VcapServicesChecker;

@SpringBootApplication
public class WillItConnectApplication {
    private Logger log = Logger.getLogger(WillItConnectApplication.class);

    @Value("${VCAP_SERVICES}")
    private String vcapServices;

    public WillItConnectApplication() {
        log.info("VCAP_SERVICES = " + vcapServices);
        VcapServicesChecker.check(new JSONObject(vcapServices));
    }

    public static void main(String[] args) {
        SpringApplication.run(WillItConnectApplication.class, args);
    }
}

