SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for variable
-- ----------------------------
DROP TABLE IF EXISTS `variable`;
CREATE TABLE `variable`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `variableCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '变量标识',
  `variableName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '变量名称',
  `projectId` int(11) NOT NULL COMMENT '项目id',
  `pageCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '页面pageCode',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '变量说明',
  `valueType` int(11) NOT NULL DEFAULT 0 COMMENT '值类型',
  `defaultValueType` int(11) NOT NULL DEFAULT 0 COMMENT '默认值类型',
  `defaultValue` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '默认值',
  `effectiveRange` int(11) NOT NULL DEFAULT 0 COMMENT '生效范围',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_page_variable
-- ----------------------------
DROP TABLE IF EXISTS `r_page_variable`;
CREATE TABLE `r_page_variable`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目id',
  `variableId` int(11) NOT NULL COMMENT '变量id',
  `pageCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '页面pageCode',
  `useInfo` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '关联情况',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_func_variable
-- ----------------------------
DROP TABLE IF EXISTS `r_func_variable`;
CREATE TABLE `r_func_variable`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目id',
  `variableId` int(11) NOT NULL COMMENT '变量id',
  `funcCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '函数funcCode',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_variable_func
-- ----------------------------
DROP TABLE IF EXISTS `r_variable_func`;
CREATE TABLE `r_variable_func`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目id',
  `variableId` int(11) NOT NULL COMMENT '变量id',
  `funcCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '函数funcCode',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for r_variable_variable
-- ----------------------------
DROP TABLE IF EXISTS `r_variable_variable`;
CREATE TABLE `r_variable_variable`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目id',
  `variableId` int(11) NOT NULL COMMENT '变量id',
  `parentVariableId` int(11) NOT NULL COMMENT '父级变量Id',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Update perm data
-- ----------------------------
-- INSERT INTO `perm` VALUES (50, 'delete_variable', '删除变量', '2021-04-12 12:00:38', '2021-04-12 12:00:38', NULL, NULL, 0);
-- INSERT INTO `r_role_perm` VALUES (50, 1, 50, NULL, NULL, NULL, NULL, 0);
INSERT INTO `perm` (permCode, permDesc, createTime, updateTime, deleteFlag) VALUES ('delete_variable', '删除变量', '2021-04-12 12:00:38', '2021-04-12 12:00:38', 0);
INSERT INTO `r_role_perm` (roleId, permId, deleteFlag) VALUES (1, LAST_INSERT_ID(), 0);

SET FOREIGN_KEY_CHECKS = 1;
