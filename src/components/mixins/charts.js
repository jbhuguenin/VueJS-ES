import Elasticsearch from 'elasticsearch'

export default {
    methods: {
        getCoulourState(state) {
            let color = "";
      
            switch(state) {
              case "UP":
                color = "#42f47d";
              break;
              case "OK":
                color = "#80f442";
              break;
              case "UNKNOWN":
                color = "grey";
              break;
              case "CRITICAL":
                color = "#f4bc42";
              break;
              case "DOWN":
                color = "#f48c42";
              break;
            }
            return color;
        },
        getClient() {
          return Elasticsearch.Client({
            host: process.env.ES_HOST,
            // log: 'trace'
          });

        }
    }
}