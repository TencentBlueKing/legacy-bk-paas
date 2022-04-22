ALTER TABLE `page`
ADD COLUMN `formId` int(11) NULL COMMENT '关联form表id' AFTER `pageType`;

ALTER TABLE `page`
ADD COLUMN `flowId` int(11) NULL COMMENT '关联flow表id' AFTER `pageType`;

ALTER TABLE `page`
ADD COLUMN `nocodeType` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'nocode页面类型：FORM/FLOW/FORM_MANAGE/FLOW_MANAGE' AFTER `pageType`;

DROP TABLE IF EXISTS `flow`;
CREATE TABLE `flow`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目ID',
  `versionId` int(11) NULL COMMENT 'VersionId',
  `flowName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `content` longtext COMMENT '第一个数据源节点的json',
  `dataSourceIds` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '关联数据表Id,逗号分隔',
  `itsmId` int(11) NULL COMMENT '关联itsm的流程Id',
  `createUser` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `deleteFlag` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '流程表' ROW_FORMAT = DYNAMIC;

DROP TABLE IF EXISTS `form`;
CREATE TABLE `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目ID',
  `versionId` int(11) NULL COMMENT 'VersionId',
  `content` longtext COMMENT '关联表单的json',
  `dataSourceId` int(11) NULL COMMENT '关联数据表Id',
  `createUser` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `deleteFlag` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '表单表' ROW_FORMAT = DYNAMIC;