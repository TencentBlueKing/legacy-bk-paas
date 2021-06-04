-- ----------------------------
-- Table structure for r_comp_share
-- ----------------------------
DROP TABLE IF EXISTS `r_comp_share`;
CREATE TABLE `r_comp_share`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `sourceProjectId` int(11) NOT NULL COMMENT '源项目id，project 表主键',
  `targetProjectId` int(11) NOT NULL COMMENT '目标项目id，project 表主键',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `source_project_id`(`sourceProjectId`) USING BTREE,
  INDEX `target_project_id`(`targetProjectId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组件共享关联表' ROW_FORMAT = Dynamic;

DROP TABLE IF EXISTS `r_func_func`;
CREATE TABLE `r_func_func`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentFuncCode` varchar(255) NOT NULL COMMENT 'func 表 Code',
  `funcCode` varchar(255) NOT NULL COMMENT 'func 表 Code',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `parentFuncCode`(`parentFuncCode`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '函数与函数关联表' ROW_FORMAT = Dynamic;
