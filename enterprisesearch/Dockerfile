ARG ELK_VERSION

# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/enterprise-search/enterprise-search:${ELK_VERSION}

HEALTHCHECK --interval=240s --timeout=120s --retries=5 \
  CMD curl -s -XGET 'http://127.0.0.1:3002'

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
