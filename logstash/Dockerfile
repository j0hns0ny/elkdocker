ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash:${ELK_VERSION}

# Download JDBC connector for Logstash
RUN curl -L --output "mysql-connector-java-8.0.28.tar.gz" "https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.28.tar.gz" \
    && tar -xf "mysql-connector-java-8.0.28.tar.gz" "mysql-connector-java-8.0.28/mysql-connector-java-8.0.28.jar" \
    && mv "mysql-connector-java-8.0.28/mysql-connector-java-8.0.28.jar" "mysql-connector-java-8.0.28.jar" \
    && rm -r "mysql-connector-java-8.0.28" "mysql-connector-java-8.0.28.tar.gz"

HEALTHCHECK --interval=240s --timeout=120s --retries=5 \
  CMD curl -s -XGET 'http://127.0.0.1:9600'

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
