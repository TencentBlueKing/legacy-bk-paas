SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for layout
-- ----------------------------
DROP TABLE IF EXISTS `layout`;
CREATE TABLE `layout`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '模板源码',
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deleteFlag` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '平台布局模板表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of layout
-- ----------------------------
INSERT INTO `layout` VALUES (1, '<router-view :key=\"$route.path\"></router-view>', NULL, NULL, NULL, NULL, 0);


-- ----------------------------
-- Table structure for layout_inst
-- ----------------------------
DROP TABLE IF EXISTS `layout_inst`;
CREATE TABLE `layout_inst`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '模板源码',
  `layoutId` int(11) NOT NULL COMMENT 'layout 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `routePath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '布局路由路径',
  `isDefault` int(11) NOT NULL DEFAULT 0 COMMENT '是否默认空模板：1为是，0为否',
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deleteFlag` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '项目模板表' ROW_FORMAT = Dynamic;


-- ----------------------------
-- Alter Table r_page_route
-- ----------------------------
ALTER TABLE `r_page_route`
ADD COLUMN `layoutId` int(11) NOT NULL COMMENT 'layout_inst 表主键' AFTER `pageId`;
