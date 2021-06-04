SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for comp_category
-- ----------------------------
DROP TABLE IF EXISTS `comp_category`;
CREATE TABLE `comp_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `belongProjectId` int NOT NULL COMMENT '所属项目',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='组件分类表';


-- ----------------------------
-- Alter Table page
-- ----------------------------
ALTER TABLE `page`
ADD COLUMN `pageCode` varchar(255) NOT NULL COMMENT '页面 ID 即英文名称' AFTER `pageName`;


-- ----------------------------
-- Table structure for route
-- ----------------------------
DROP TABLE IF EXISTS `route`;
CREATE TABLE `route` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` int NOT NULL DEFAULT '-1' COMMENT '父 route 节点的 id，无父节点即为 -1',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路由路径',
  `order` int DEFAULT '1' COMMENT '排序',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='路由表';


-- ----------------------------
-- Table structure for r_page_route
-- ----------------------------
DROP TABLE IF EXISTS `r_page_route`;
CREATE TABLE `r_page_route` (
  `id` int NOT NULL AUTO_INCREMENT,
  `routeId` int NOT NULL COMMENT 'route 表主键',
  `pageId` int NOT NULL COMMENT 'page 表主键',
  `projectId` int NOT NULL COMMENT 'project 表主键',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int DEFAULT NULL COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`),
  INDEX `page_id` (`pageId`) USING BTREE,
  INDEX `route_id` (`routeId`) USING BTREE,
  INDEX `project_id` (`projectId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='页面路由关联表';


-- ----------------------------
-- Alter Table project
-- ----------------------------
ALTER TABLE `project`
ADD COLUMN `moduleCode` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '绑定应用模块名称' AFTER `status`;


-- ----------------------------
-- Alter Table project
-- ----------------------------
ALTER TABLE `project`
ADD COLUMN `appCode` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '绑定蓝鲸应用名称' AFTER `status`;


-- ----------------------------
-- Table structure for release_version
-- ----------------------------
DROP TABLE IF EXISTS `release_version`;
CREATE TABLE `release_version` (
  `id` int NOT NULL AUTO_INCREMENT,
  `releaseType` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '发布类型',
  `env` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '部署环境',
  `version` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '版本号',
  `projectId` int NOT NULL COMMENT '所属项目',
  `codeUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '项目源码存放路径',
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '当前状态',
  `currentStep` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '当前运行阶段',
  `bindInfo` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '绑定应用和模块名称',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='版本部署表';


-- ----------------------------
-- Table structure for r_page_comp
-- ----------------------------
DROP TABLE IF EXISTS `r_page_comp`;
CREATE TABLE `r_page_comp`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `versionId` int(11) NOT NULL COMMENT 'version 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `createTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_id`(`projectId`) USING BTREE,
  INDEX `page_id`(`pageId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '页面组件关联表' ROW_FORMAT = Dynamic;


-- ----------------------------
-- Table structure for comp
-- ----------------------------
DROP TABLE IF EXISTS `comp`;
CREATE TABLE `comp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件 id，全局唯一，（要和上传的 config.js 中的 type 一致，自定义组件的标签名）',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件名称',
  `displayName` varchar(255) NOT NULL COMMENT '自定义组件中文名称',
  `categoryId` int NOT NULL COMMENT '自定义组件分类',
  `belongProjectId` int NOT NULL COMMENT '自定义组件所属项目',
  `isPublic` int NOT NULL DEFAULT '0' COMMENT '是否公开：0 为公开，1 为不公开',
  `status` int NOT NULL DEFAULT '0' COMMENT '自定义组件状态：0 为已发布，1 为已下架',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='自定义组件表';


-- ----------------------------
-- Table structure for version
-- ----------------------------
DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentId` int NOT NULL COMMENT 'component 表的主键',
  `componentDest` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '自定义组件路径',
  `version` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本号',
  `versionLog` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '版本日志',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '组件描述',
  `isLast` int NOT NULL COMMENT '是否是最新版本，0历史版本，1最新版本',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `component_id` (`componentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='自定义组件版本表';


-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `deployId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT 'v3部署关联id' AFTER `currentStep`;


-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `errorMsg` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '程序报错信息' AFTER `status`;


-- ----------------------------
-- Alter Table release-version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `accessUrl` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '访问url' AFTER `status`;
