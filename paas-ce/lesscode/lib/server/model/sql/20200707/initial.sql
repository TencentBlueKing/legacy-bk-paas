SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comp
-- ----------------------------
DROP TABLE IF EXISTS `comp`;
CREATE TABLE `comp`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件 id，全局唯一，（要和上传的 config.js 中的 type 一致，自定义组件的标签名）',
  `compName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件名称',
  `compPath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件存放路径（单机部署即服务器目录地址，多机部署即 S3 地址）',
  `belongProjectId` int(11) NOT NULL COMMENT '标识自定义组件属于哪个项目',
  `categoryId` int(11) NOT NULL COMMENT 'category 表主键',
  `latestVersionId` int(11) NOT NULL COMMENT '自定义组件的最新版本 id',
  `isPublic` int(11) NOT NULL DEFAULT 0 COMMENT '是否公开：0 为公开，1 为不公开',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '自定义组件状态：0 为已发布，1 为已下架',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_id`(`categoryId`) USING BTREE,
  INDEX `latest_version_id`(`latestVersionId`) USING BTREE,
  INDEX `belongProjectId`(`belongProjectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '自定义组件表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comp
-- ----------------------------
-- INSERT INTO `comp` VALUES (1, 'x-script', 'x-script', '/a/b/c', 4, 1, 2, 0, 0, '2020-06-02 16:43:06', '2020-06-03 02:18:13', NULL, NULL, 0);
-- INSERT INTO `comp` VALUES (2, 'x-table', 'x-table', '/q/w/e', 5, 1, 1, 0, 0, '2020-06-02 16:43:06', '2020-06-03 02:18:14', NULL, NULL, 0);

-- ----------------------------
-- Table structure for comp_category
-- ----------------------------
DROP TABLE IF EXISTS `comp_category`;
CREATE TABLE `comp_category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组件分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comp_category
-- ----------------------------
-- INSERT INTO `comp_category` VALUES (1, '默认分类', '2020-06-03 12:00:04', '2020-06-03 12:00:04', NULL, NULL, 0);
-- INSERT INTO `comp_category` VALUES (2, 'a/b/c/d', '2020-07-20 21:42:41', '2020-07-20 21:42:41', 'admin', NULL, 0);

-- ----------------------------
-- Table structure for func
-- ----------------------------
DROP TABLE IF EXISTS `func`;
CREATE TABLE `func`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '函数名字，项目下唯一',
  `funcParams` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数参数，逗号分隔字符串',
  `funcBody` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数内容',
  `funcGroupId` int(11) NOT NULL COMMENT 'function_group 表主键',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `funcSummary` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数简介',
  `funcType` int(11) NULL DEFAULT NULL COMMENT '函数模板类型',
  `funcMethod` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '远程函数方法',
  `funcApiData` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '远程函数数据体',
  `publicFlag` int(1) UNSIGNED ZEROFILL NULL DEFAULT 0 COMMENT '是否公开',
  `funcApiUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '远程函数URL',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  `order` int(11) NULL DEFAULT NULL COMMENT '排序',
  `remoteParams` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '回调函数参数，逗号分隔字符串',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 207 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '函数表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of func
-- ----------------------------
INSERT INTO `func` VALUES (192, 'getMockData', '', 'return this.$http.get(\"/data/getMockData\").then((res) => {\r\n    const data = JSON.stringify(res)\r\n    alert(data)\r\n    return res.data\r\n})', 1, '2020-07-23 23:08:55', '2020-07-23 23:18:17', '', '', '获取mock数据', 0, 'GET', '', 0, '', 0, NULL, NULL);
INSERT INTO `func` VALUES (193, 'getApiData', 'res', 'const data = res.data || []\r\nreturn data', 1, '2020-07-23 23:08:56', '2020-07-23 23:12:35', '', '', '远程函数，获取数据', 1, 'get', '', 0, 'api/data/getMockData', 0, NULL, 'res');

-- ----------------------------
-- Table structure for func_group
-- ----------------------------
DROP TABLE IF EXISTS `func_group`;
CREATE TABLE `func_group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '函数文件夹名称',
  `parentId` int(11) NOT NULL DEFAULT -1 COMMENT '父 group 节点的 id，无父节点即为 -1',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `order` int(11) NULL DEFAULT NULL COMMENT '排序',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 224 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '函数分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of func_group
-- ----------------------------
INSERT INTO `func_group` VALUES (1, '默认分类', -1, '2020-07-23 23:08:08', '2020-07-23 23:08:28', '', NULL, 1, 0);

-- ----------------------------
-- Table structure for operate_log
-- ----------------------------
DROP TABLE IF EXISTS `operate_log`;
CREATE TABLE `operate_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operateCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应 perm.perm_code',
  `operateDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应 perm.perm_desc',
  `operateUserId` int(11) NOT NULL COMMENT 'user 表主键',
  `operateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `operate_user_id`(`operateUserId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '页面的 targetData（JSON 串）',
  `sourceCode` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '页面源代码',
  `previewImg` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '缩略图base64',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '项目状态：0 为正常，1 为私有，2 为删除',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '页面表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for perm
-- ----------------------------
DROP TABLE IF EXISTS `perm`;
CREATE TABLE `perm`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `permDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of perm
-- ----------------------------
INSERT INTO `perm` VALUES (1, 'create_project', '创建项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (2, 'update_project', '更新项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (3, 'delete_project', '删除项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (4, 'copy_project', '复制项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (5, 'download_project', '下载项目源码', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (6, 'create_page', '创建页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (7, 'update_page', '更新页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (8, 'delete_page', '删除页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (9, 'copy_page', '复制页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (10, 'download_page', '下载页面源码', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (11, 'preview_page', '预览页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (12, 'offline_component', '下架自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (13, 'online_component', '上线自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (14, 'public_component', '公开自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (15, 'private_component', '私有自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (16, 'update_component', '更新自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (17, 'view_component', '查看项目中的自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (18, 'view_component_category', '查看自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (19, 'add_component_category', '添加自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (20, 'update_component_category', '更新自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (21, 'delete_component_category', '删除自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (22, 'add_user', '添加项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (23, 'update_user', '更新项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (24, 'delete_user', '删除项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `projectCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '项目 ID 即英文名称',
  `projectName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '项目名称',
  `projectDesc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '项目简介',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '项目状态：0 为正常，1 为私有',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project
-- ----------------------------
-- INSERT INTO `project` VALUES (1, '1', 'test', 'test', 0, '2020-07-23 23:06:41', '2020-07-23 23:06:41', NULL, NULL, 0);

-- ----------------------------
-- Table structure for r_favourite
-- ----------------------------
DROP TABLE IF EXISTS `r_favourite`;
CREATE TABLE `r_favourite`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT 'user 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`userId`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of r_favourite
-- ----------------------------
-- INSERT INTO `r_favourite` VALUES (2, 1, 5, NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for r_page_func
-- ----------------------------
DROP TABLE IF EXISTS `r_page_func`;
CREATE TABLE `r_page_func`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `funcId` int(11) NOT NULL COMMENT 'function 表主键',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_project_comp
-- ----------------------------
DROP TABLE IF EXISTS `r_project_comp`;
CREATE TABLE `r_project_comp`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `compId` int(11) NOT NULL COMMENT 'component 表主键',
  `useVersionId` int(11) NOT NULL COMMENT '当前使用的自定义组件的版本 id',
  `pageIds` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '[]' COMMENT 'page 表主键的集合',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `page_id`(`pageIds`) USING BTREE,
  INDEX `category_id`(`compId`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE,
  INDEX `useVersionId`(`useVersionId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目使用的自定义组件关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of r_project_comp
-- ----------------------------
-- INSERT INTO `r_project_comp` VALUES (1, 4, NULL, NULL, NULL, NULL, 1, 1, '[1, 2]', 0);
-- INSERT INTO `r_project_comp` VALUES (2, 4, NULL, NULL, NULL, NULL, 2, 3, '[1]', 0);

-- ----------------------------
-- Table structure for r_project_func_group
-- ----------------------------
DROP TABLE IF EXISTS `r_project_func_group`;
CREATE TABLE `r_project_func_group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `funcGroupId` int(11) NOT NULL COMMENT 'function 表主键',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE,
  INDEX `r_project_func_group_ibfk_2`(`funcGroupId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 207 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目/函数关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of r_project_func_group
-- ----------------------------
-- INSERT INTO `r_project_func_group` VALUES (207, 1, NULL, NULL, 'admin', NULL, 1, 0);

-- ----------------------------
-- Table structure for r_project_page
-- ----------------------------
DROP TABLE IF EXISTS `r_project_page`;
CREATE TABLE `r_project_page`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE,
  INDEX `page_id`(`pageId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目/页面关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_role_perm
-- ----------------------------
DROP TABLE IF EXISTS `r_role_perm`;
CREATE TABLE `r_role_perm`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL COMMENT 'role 表主键',
  `permId` int(11) NOT NULL COMMENT 'perm 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `perm_id`(`roleId`) USING BTREE,
  INDEX `operate_id`(`permId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色/权限关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of r_role_perm
-- ----------------------------
INSERT INTO `r_role_perm` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (2, 1, 2, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (3, 1, 3, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (4, 1, 4, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (5, 1, 5, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (6, 1, 6, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (7, 1, 7, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (8, 1, 8, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (9, 1, 9, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (10, 1, 10, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (11, 1, 11, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (12, 1, 12, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (13, 1, 13, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (14, 1, 14, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (15, 1, 15, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (16, 1, 16, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (17, 1, 17, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (21, 1, 18, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (22, 1, 19, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (23, 1, 20, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (24, 2, 5, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (25, 2, 6, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (26, 2, 7, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (27, 2, 8, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (28, 2, 9, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (29, 2, 10, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (30, 2, 11, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (31, 2, 12, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (32, 2, 13, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (33, 2, 14, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (34, 2, 15, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (35, 2, 16, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (36, 2, 17, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (37, 3, 11, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (38, 1, 21, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (39, 1, 22, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (40, 1, 23, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (41, 1, 24, NULL, NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for r_user_project_role
-- ----------------------------
DROP TABLE IF EXISTS `r_user_project_role`;
CREATE TABLE `r_user_project_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT 'user 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `roleId` int(11) NOT NULL COMMENT 'role 表主键',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`userId`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE,
  INDEX `role_id`(`roleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户/项目/角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of r_user_project_role
-- ----------------------------
-- INSERT INTO `r_user_project_role` VALUES (6, 1, 8, NULL, NULL, 'admin', NULL, 1, 0);
-- INSERT INTO `r_user_project_role` VALUES (7, 1, 9, NULL, NULL, 'admin', NULL, 1, 0);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色 ID',
  `roleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `role_id`(`roleCode`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'root', '超级管理员', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, 0);
INSERT INTO `role` VALUES (2, 'developer', '开发者', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, 0);
INSERT INTO `role` VALUES (3, 'viewer', '预览者', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '系统的用户名（内部版为企业微信，外部版为注册的用户名）',
  `qq` int(11) NULL DEFAULT NULL COMMENT 'QQ 账号（外部版）',
  `wx` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '微信账号（外部版）',
  `bk` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '企业版/社区版账号（外部版）',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for version
-- ----------------------------
DROP TABLE IF EXISTS `version`;
CREATE TABLE `version`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `componentId` int(11) NOT NULL COMMENT 'component 表的主键',
  `version` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本号',
  `versionLog` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本日志',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `component_id`(`componentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '自定义组件版本表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of version
-- ----------------------------
-- INSERT INTO `version` VALUES (1, 1, '0.0.1', '初始化', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, 0);
-- INSERT INTO `version` VALUES (2, 1, '0.0.2', '修复 bug', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, 0);
-- INSERT INTO `version` VALUES (3, 2, '0.0.1', '初始化 x-table', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;
