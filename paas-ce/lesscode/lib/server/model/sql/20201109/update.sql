-- ----------------------------
-- Records of perm
-- ----------------------------
INSERT INTO `perm` VALUES (25, 'delete_component', '删除自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (26, 'delete_func_group', '删除函数分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (27, 'delete_func', '删除函数', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (28, 'delete_member', '删除成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (29, 'add_member', '添加成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);
INSERT INTO `perm` VALUES (30, 'edit_member', '编辑成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, 0);

-- ----------------------------
-- Records of r_role_perm
-- ----------------------------
INSERT INTO `r_role_perm` VALUES (42, 1, 25, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (43, 1, 26, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (44, 1, 27, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (45, 1, 28, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (46, 1, 29, NULL, NULL, NULL, NULL, 0);
INSERT INTO `r_role_perm` VALUES (47, 1, 30, NULL, NULL, NULL, NULL, 0);
UPDATE r_role_perm SET deleteFlag = 1 WHERE roleId = 2 AND permId = 8;
