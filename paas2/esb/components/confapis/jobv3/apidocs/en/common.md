## Common Fields and Conventions

#### global_var

| Fields |  Type  | **Required** | **Description** |
|-------------|------------|--------|------------|
| id          |  long     | no   | Global variables ID . If id is empty, then name is used as the unique identifier |
| name        |  string   | no   | Global variables name                                         |
| description |  string   | no   | Global variables description |
| type        |  int      | no   | Global variables types |
| required    |  int      | no   | Is this variable required |
| value       |  string   | no   | Values of global variables of String, Ciphertext, Namespace, and Array types |
| server      |  object   | no   | Value of global variable of Host type |

#### server
| Fields             | Type | **Required** | **Description** |
|-----------------------|-------|--------|------------|
| ip_list               | array | no   | Static IP list, see ip for definition |
| dynamic_group_list    | array | no   | Dynamic grouping list, see dynamic_group for definition |
| topo_node_list        | array | no   | Dynamic topo node list, see topo_node for definition |

#### ip
| Fields   | Type | **Required** | **Description** |
|-------------|---------|--------|---------|
| bk_cloud_id |  int    | yes | BK-Net ID   |
| ip          |  string | yes  | IP Address |

#### dynamic_group

| Fields | Type   | **Required** | **Description**       |
| ------ | ------ | ------------ | --------------------- |
| id     | string | yes          | CMDB Dynamic Group ID |

#### topo_node

| Fields        |  Type  | **Required** | **Description** |
|------------------|--------|--------|------------|
| id               | long   | yes  | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API |
| node_type        | string | yes  | Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module", "set" |

#### account 
| Fields |  Type  | **Required** | **Description** |
|-------|--------|--------|------------|
| id    | long   | no   | Account ID |
| name  | string | no   | Account name |
