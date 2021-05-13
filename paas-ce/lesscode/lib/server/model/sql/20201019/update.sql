-- ----------------------------
-- Alter Table layout_inst
-- ----------------------------
ALTER TABLE `layout_inst`
ADD COLUMN `showName` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '布局展示名称' AFTER `isDefault`;

-- ----------------------------
-- Alter Table layout_inst
-- ----------------------------
ALTER TABLE `layout_inst`
ADD COLUMN `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '布局的targetData' AFTER `id`;

-- ----------------------------
-- Table structure for layout
-- ----------------------------
DROP TABLE IF EXISTS `layout`;
CREATE TABLE `layout`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `defaultPath` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '默认路由',
  `defaultName` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '布局中文名称',
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '布局类型',
  `code` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '模板源码',
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deleteFlag` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '平台布局模板表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of layout
-- ----------------------------
INSERT INTO `layout` VALUES (1, '/', '空白布局', 'empty', '', NULL, NULL, 'admin', 'admin', 0);
INSERT INTO `layout` VALUES (2, '/left-right', '侧边导航布局', 'left-right', '', NULL, NULL, 'admin', 'admin', 0);
INSERT INTO `layout` VALUES (3, '/top-bottom', '横向型导航布局', 'top-bottom', NULL, NULL, NULL, 'admin', 'admin', 0);
INSERT INTO `layout` VALUES (4, '/complex', '复合型导航布局', 'complex', NULL, NULL, NULL, 'admin', 'admin', 0);
