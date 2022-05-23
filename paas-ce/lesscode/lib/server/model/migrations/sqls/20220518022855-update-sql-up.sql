/* Replace with your SQL commands */

ALTER TABLE `func` 
ADD COLUMN `apiId` int(11) NULL DEFAULT NULL COMMENT 'Api Id' AFTER `funcCode`,
ADD COLUMN `apiHeader` json NULL COMMENT 'Api header 的值' AFTER `apiId`,
ADD COLUMN `apiQuery` json NULL COMMENT 'Api query 的值' AFTER `apiHeader`,
ADD COLUMN `apiBody` json NULL COMMENT 'Api body 的值' AFTER `apiQuery`;

DROP TABLE IF EXISTS `api_category`;
CREATE TABLE `api_category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类名称',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '项目id',
  `versionId` int(11) NULL DEFAULT NULL COMMENT '版本id',
  `order` int(11) NULL DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`),
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

DROP TABLE IF EXISTS `api`;
CREATE TABLE `api`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  `projectId` int(11) NULL DEFAULT NULL COMMENT '项目id',
  `versionId` int(11) NULL DEFAULT NULL COMMENT '版本id',
  `categoryId` int(11) NULL DEFAULT NULL COMMENT '分类 id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '名称',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标识',
  `systemApiId` int(11) NULL DEFAULT NULL COMMENT '系统内置api id',
  `method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'api方法',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'api url',
  `summary` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `header` json NULL COMMENT '请求头配置',
  `query` json NULL COMMENT '请求 Query 参数配置',
  `body` json NULL COMMENT '请求 Body 参数配置',
  PRIMARY KEY (`id`),
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;
