import cpuUsage from './cpuUsage';
import moment from "moment";

export default {
    extends: cpuUsage,
    methods: {
        getData() {
            let self = this;
            this.getClient().search({
                index: "test*",
                body: {
                    "_source": ["km_disk_volume_used_percent","nagios_epoch"],
                    "sort": [{"@timestamp": {"order":"asc"}}],
                    "query" : {
                        "bool": {
                            "must": [
                            { 
                                "term": { "nagios_service.keyword": "Disk Space - C:"}
                            },
                            {
                                "term": {"nagios_hostname": self.hostName}
                            }]
                        }
                    }
                }
            }).then(function(resp) {
                self.data.datasets[0].label = 'Disk Usage'
                resp.hits.hits.map(function(element) {
                    let label = element._source[Object.keys(element._source)[0]];
                    self.data.labels.push(moment.unix(element._source.nagios_epoch).format('llll'));
                    let value = parseFloat(element._source.km_disk_volume_used_percent.slice(0,-1));
                    self.data.datasets[0].data.push(value);
                });
                self.data.loaded = true;
            });
        }
    }
}