-- ----------------------------
-- Table structure for project_version
-- ----------------------------
DROP TABLE IF EXISTS `project_version`;
CREATE TABLE `project_version`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT '项目ID',
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '项目版本',
  `versionLog` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '版本日志',
  `createUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updateTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `deleteFlag` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '项目版本表' ROW_FORMAT = DYNAMIC;


ALTER TABLE `r_project_page`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_page_route`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_page_func`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_project_func_group`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_func_func`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `layout_inst`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `variable`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_variable_variable`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_variable_func`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_page_variable`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_func_variable`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `r_page_comp`
ADD COLUMN `projectVersionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `projectId`;

ALTER TABLE `page_template`
ADD COLUMN `versionId` int(11) NULL COMMENT 'project_version 表主键' AFTER `belongProjectId`;
