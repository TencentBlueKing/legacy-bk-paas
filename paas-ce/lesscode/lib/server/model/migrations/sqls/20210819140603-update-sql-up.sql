/* Replace with your SQL commands */-- ----------------------------
-- Table structure for func_market
-- ----------------------------
DROP TABLE IF EXISTS `func_market`;
CREATE TABLE `func_market`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数名字，项目下唯一',
  `funcParams` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数参数，逗号分隔字符串',
  `funcBody` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数内容',
  `funcType` int(11) NULL DEFAULT NULL COMMENT '函数模板类型',
  `funcMethod` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '远程函数方法',
  `funcApiUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '远程函数URL',
  `remoteParams` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '回调函数参数，逗号分隔字符串',
  `funcApiData` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '远程函数数据体',
  `funcSummary` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '函数简介',
  `withToken` int(11) NULL DEFAULT 0 COMMENT '远程方法是否携带Token',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '函数市场' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for r_project_func_market
-- ----------------------------
DROP TABLE IF EXISTS `r_project_func_market`;
CREATE TABLE `r_project_func_market`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcMarketId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `projectFuncId` int(11) NOT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`),
  INDEX `函数市场id`(`funcMarketId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for platform_admin
-- ----------------------------
DROP TABLE IF EXISTS `platform_admin`;
CREATE TABLE `platform_admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '系统的用户名（内部版为企业微信，外部版为注册的用户名）',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of platform_admin
-- ----------------------------
INSERT INTO `platform_admin` VALUES (1, 'admin', '2021-08-19 21:25:37', '2021-08-19 21:25:37', 'admin', 'admin', 0);

-- ----------------------------
-- Records of func_market
-- ----------------------------
INSERT INTO `func_market` VALUES (1,'validateForm','','// 这里的 dynamicForm 需要替换成表单容器组件 ref 属性的值\r\nreturn this.$refs[\'dynamicForm\'].validate().then(validator => {\r\n    // 进行业务处理\r\n    alert(\'验证成功！\')\r\n}, validator => {\r\n    // 显示第一个出错位置\r\n    alert(validator.content)\r\n})\r\n',0,'get','','','','如果需要对页面中的表单容器进行校验，可以使用本函数。注意：函数中的 dynamicForm 需要替换成表单容器组件 ref 属性的值，页面中每个 form 的 ref 值需要唯一。',0,'2021-08-23 14:50:06','2021-08-27 02:31:06','admin','admin',0);