<template>
  <el-row :gutter="20">
    <el-col :span="24">
            <div style="padding:10px;">
                <el-input placeholder="search ... (eg. nagios_service:techAlert)" v-model="searchTerm">
                    <el-button slot="append" icon="el-icon-search" @click="getInventoryList()"></el-button>
                </el-input>
            </div>
    </el-col>
      <el-col :span="24">
        <el-card class="box-card widget">
            <div slot="header" class="clearfix">
            <i class="el-icon-tickets"></i> <span >Equipements : {{inventoryList.count}}</span>
            <el-button-group style="float:right;">
                <el-button @click="getInventoryList()" size="mini" icon="el-icon-refresh"></el-button>
                <el-button size="mini" icon="el-icon-edit-outline"></el-button>
                <el-button size="mini" icon="el-icon-delete"></el-button>
            </el-button-group>
            </div>
            <div style="width:100%">
             <el-table :data="inventoryList.data"  v-loading="inventoryList.loading" style="width:100%;" height="300">
               <el-table-column prop="state" label="State" :formatter="formatState" width="60">
                 <template slot-scope="scope">
                   <i :class="getIconClass(scope.row.state)" />
                 </template>
               </el-table-column>
               <el-table-column prop="hostname" label="Hostname" width="120"></el-table-column>
               <el-table-column prop="services" label="Services" :formatter="formatServiceState" >
                 <template slot-scope="scope">
                   <el-tag v-for="item in scope.row.services" :key="item.name" :class="item.state" size="mini">
                     {{item.name}}
                   </el-tag>
                 </template>
               </el-table-column>
               <el-table-column label="" width="100">
                <template slot-scope="scope">
                    <el-button icon="el-icon-zoom-in" size="small"></el-button>
                </template>
            </el-table-column>
             </el-table>
            </div>
        </el-card>
      </el-col>
  </el-row>
</template>

<script>
import ChartMixin from './mixins/charts'

export default {
  mixins: [ChartMixin],
  data: function() {
    return {
      inventoryList: {
        loading: true,
        count:0
      },
      searchTerm: ""
    }
  },
  mounted: function() {
    this.getInventoryList();
  },
  methods: {
    test(scope) {
      console.log(scope);
    },
    getIconClass(state) {
      switch(state) {
        case 0:
         return 'el-icon-success';
        break;
        case 3:
          return 'el-icon-warning';
          break;
        case 2: 
          return 'el-icon-error';
          break;
      }

    },
    formatState(row, column) {
      return this.getStateLabel(row.state);
    },
    formatServiceState(row, column) {
      let val = "";
      row.services.map(function(element) {
        val += " " + element.name + ':' + element.state;
      });
      return val;
    },
    getInventoryList() {
      let term = this.searchTerm ? this.searchTerm : "*";
      this.inventoryList.loading = true;
      var self = this;

       this.getClient().search({
         index: "b827*,test*",
         body: {
           "aggs": {
            "hostname": {
              "terms": {
                "field": "nagios_hostname.keyword",
                "size": 100,
              },
              "aggs": {
                "nagios_states": {
                  "terms": {
                    "field": "nagios_service.keyword"
                  },
                  "aggs": {
                    "nagios_states_doc": {
                      "top_hits": {
                        "size": 1,
                        "sort": [{
                          "@timestamp": {
                            "order": "desc"
                          }
                        }]
                      }
                    }
                  }
                }
              }
            }
          },
          "query": {
            "bool": {
              "must": [
                {
                  "match_all": {}
                },
                {
                  "query_string": {
                    "query": term,
                    "analyze_wildcard": true,
                    "default_field": "*"
                  }
                }
              ]
            }
          }
         }
       }).then(function(resp) {

         let buckets = resp.aggregations.hostname.buckets;
         self.inventoryList.count = buckets.length;
         let hosts = buckets.map(function(element) {
            let servicesStates = [];
            let services = element.nagios_states.buckets.map(function(element) {
              let doc = element.nagios_states_doc.hits.hits[0];
              servicesStates.push(self.getStateCode(doc._source.nagios_state));
              return {
                name: element.key, 
                state: doc._source.nagios_state, 
                doc: doc
              }
            });
            return { hostname: element.key, services: services, state: Math.max.apply(Math,servicesStates)};
          });
          self.inventoryList.data = hosts;
          self.inventoryList.loading = false;

       });
    },
    getDetailInventory(element) {
      this.getClient().search({
         index: "*",
         body: {
           "aggs": {
              "nagios_states": {
                "terms": {
                  "field": "nagios_service.keyword"
                },
                "aggs": {
                  "nagios_states_doc": {
                    "top_hits": {
                      "size": 1,
                      "sort": [{
                        "@timestamp": {
                          "order": "desc"
                        }
                      }]
                    }
                  }
                }
              }
            },
            "query": {
              "bool": {
                "must": [
                  {
                    "match_all": {}
                  },
                  {
                    "query_string": {
                      "query": "nagios_hostname:" + element.hostname,
                      "analyze_wildcard": true,
                      "default_field": "*"
                    }
                  }
                ]
              }
            }
         }
      }).then(function(resp) {
        let buckets = resp.aggregations.nagios_states.buckets;
        element.push(buckets.map(function(element) {
          return { service:element.key, state: element.nagios_states_doc.hits.hits[0].nagios_state, doc: element.nagios_states_doc.hits.hits[0]}
        }));

      });
    }
  }

}
</script>


<style scoped>
i.el-icon-success {
  color:chartreuse;
  font-size: 1.8em;
}
i.el-icon-warning {
  color:rgb(248, 176, 42);
  font-size: 1.8em;
}

i.el-icon-error {
  color:rgb(248, 33, 26);
  font-size: 1.8em;
}
.el-tag {
  margin:1px;
}

.el-tag.CRITICAL {
  background-color: hsla(0,87%,69%,.1);
  border-color: hsla(0,87%,69%,.2);
  color: #f56c6c;
}

.el-tag.OK {
  background-color: rgba(103,194,58,.1);
  border-color: rgba(103,194,58,.2);
  color: #67c23a;
}

.el-tag.UNKNOWN {
  background-color: hsla(220,4%,58%,.1);
  border-color: hsla(220,4%,58%,.2);
  color: #909399;
}

.el-tag.WARNING {
  background-color: rgba(230,162,60,.1);
border-color: rgba(230,162,60,.2);
color: #e6a23c;
}
</style>

