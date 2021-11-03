-- ----------------------------
-- Table structure for data_table_modify_record
-- ----------------------------
DROP TABLE IF EXISTS `data_table_modify_record`;
CREATE TABLE `data_table_modify_record`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tableId` int(11) NULL DEFAULT NULL COMMENT '数据表 Id',
  `projectId` int(11) NULL DEFAULT 0 COMMENT '项目Id',
  `sql` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '记录每次提交要执行的sql',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `projectId`(`projectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for data_table
-- ----------------------------
DROP TABLE IF EXISTS `data_table`;
CREATE TABLE `data_table`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tableName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '表名',
  `projectId` int(11) NULL DEFAULT 0 COMMENT '项目Id',
  `columns` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '字段json',
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '表备注',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `projectId`(`projectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for preview_db
-- ----------------------------
DROP TABLE IF EXISTS `preview_db`;
CREATE TABLE `preview_db`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '项目ID',
  `dbName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'db 名称',
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '预览使用数据库的用户名',
  `passWord` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '预览使用数据库的密码',
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `projectId`(`projectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

ALTER TABLE `project` 
ADD COLUMN `isEnableDataSource` int(11) NULL DEFAULT 0 COMMENT '是否开启数据源，1代表已开启' AFTER `isOffcial`;
