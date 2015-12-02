package willitconnect.config;

import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import willitconnect.service.VcapServicesChecker;

@Configuration
public class VcapServicesCheckerConfig {

    @Bean
    VcapServicesChecker vcapServicesChecker() {
        String vcapServices = System.getenv("VCAP_SERVICES");
        if (null == vcapServices)
                vcapServices = "{}";
        return VcapServicesChecker.checkVcapServices(
                new JSONObject(vcapServices));
    }
}
