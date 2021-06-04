-- ----------------------------
-- Alter Table operate_log
-- ----------------------------
ALTER TABLE `operate_log`
ADD COLUMN `operateObj` varchar(255) NOT NULL COMMENT '操作对象' AFTER `id`;

ALTER TABLE `operate_log`
ADD COLUMN `operateStatus` int(11) NOT NULL COMMENT '操作状态：1为成功，0为失败' AFTER `operateUserId`;

ALTER TABLE `operate_log`
ADD COLUMN `operateRaw` mediumtext NULL COMMENT '操作请求和响应原始数据' AFTER `operateStatus`;

ALTER TABLE `operate_log`
ADD COLUMN `operateTarget` varchar(255) NOT NULL COMMENT '操作目标' AFTER `operateDesc`;

ALTER TABLE `operate_log`
ADD COLUMN `projectId` int(11) NULL COMMENT '项目id' AFTER `id`,
ADD INDEX `operate_project_id`(`projectId`) USING BTREE,
ADD INDEX `operate_obj`(`operateObj`) USING BTREE;

ALTER TABLE `operate_log`
CHANGE COLUMN `operateDesc` `operateCodeText` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应 perm.perm_desc' AFTER `operateCode`,
ADD COLUMN `operateDesc` mediumtext NULL COMMENT '操作描述' AFTER `operateStatus`;

-- ----------------------------
-- Records of perm
-- ----------------------------
INSERT INTO `perm` VALUES (31, 'add_func', '创建函数', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (32, 'update_func', '更新函数', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (33, 'add_func_group', '添加函数分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (34, 'update_func_group', '更新函数分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (35, 'add_component', '创建自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (36, 'update-using-version_component', '升级使用中的自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);

-- ----------------------------
-- Records of r_role_perm
-- ----------------------------
INSERT INTO `r_role_perm` VALUES (48, 1, 31, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (49, 1, 32, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (50, 1, 33, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (51, 1, 34, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (52, 2, 31, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (53, 2, 32, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (54, 2, 33, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (55, 2, 34, NULL, NULL, NULL, NULL, 0);

INSERT INTO `r_role_perm` VALUES (56, 1, 35, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (57, 1, 36, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (58, 2, 35, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (59, 3, 36, NULL, NULL, NULL, NULL, 0);
