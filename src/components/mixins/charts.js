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
        getStateCode(stateLabel) {
          let stateCode = "";
          switch(stateLabel) {
            case "UP":
            case "OK":
              stateCode = 0;
            break;
            case "UNKNOWN":
              stateCode = 3;
            break;
            case "CRITICAL":
            case "DOWN":
              stateCode = 2;
            break;
          }
          return stateCode;
        },
        getStateLabel(stateCode) {
          let stateLabel = "";

          switch(stateCode) {
            case 0:
              stateLabel = "OK";
            break;
            case 2:
              stateLabel = "CRITICAL";
            break;
            case 3:
              stateLabel = "UNKNOWN";
            break;
          }
          return stateLabel;
        },
        getClient() {
          return Elasticsearch.Client({
            host: process.env.ES_HOST,
            // log: 'trace'
          });

        }
    }
}