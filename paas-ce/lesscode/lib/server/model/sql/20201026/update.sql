SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for r_comp_favourite
-- ----------------------------
DROP TABLE IF EXISTS `r_comp_favourite`;
CREATE TABLE `r_comp_favourite`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `comp_id`(`compId`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组件收藏关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `r_comp_share` MODIFY COLUMN `id` int(11) NOT NULL AUTO_INCREMENT;
