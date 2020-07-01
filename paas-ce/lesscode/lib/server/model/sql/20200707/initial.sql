/*
 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : lesscode

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 22/06/2020 19:57:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comp
-- ----------------------------
DROP TABLE IF EXISTS `comp`;
CREATE TABLE `comp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `compCode` varchar(255) NOT NULL COMMENT '自定义组件 id，全局唯一，（要和上传的 config.js 中的 type 一致，自定义组件的标签名）',
  `compName` varchar(255) NOT NULL COMMENT '自定义组件名称',
  `compPath` varchar(255) NOT NULL COMMENT '自定义组件存放路径（单机部署即服务器目录地址，多机部署即 S3 地址）',
  `belongProjectId` int NOT NULL COMMENT '标识自定义组件属于哪个项目',
  `categoryId` int NOT NULL COMMENT 'category 表主键',
  `latestVersionId` int NOT NULL COMMENT '自定义组件的最新版本 id',
  `isPublic` int NOT NULL DEFAULT '0' COMMENT '是否公开：0 为公开，1 为不公开',
  `status` int NOT NULL DEFAULT '0' COMMENT '自定义组件状态：0 为已发布，1 为已下架',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `category_id` (`categoryId`),
  KEY `latest_version_id` (`latestVersionId`),
  KEY `belongProjectId` (`belongProjectId`),
  CONSTRAINT `comp_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `comp_category` (`id`),
  CONSTRAINT `comp_ibfk_3` FOREIGN KEY (`latestVersionId`) REFERENCES `version` (`id`),
  CONSTRAINT `comp_ibfk_4` FOREIGN KEY (`belongProjectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='自定义组件表';

-- ----------------------------
-- Records of comp
-- ----------------------------
BEGIN;
INSERT INTO `comp` VALUES (1, 'x-script', 'x-script', '/a/b/c', 4, 1, 2, 0, 0, '2020-06-02 16:43:06', '2020-06-03 02:18:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `comp` VALUES (2, 'x-table', 'x-table', '/q/w/e', 5, 1, 1, 0, 0, '2020-06-02 16:43:06', '2020-06-03 02:18:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for comp_category
-- ----------------------------
DROP TABLE IF EXISTS `comp_category`;
CREATE TABLE `comp_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='组件分类表';

-- ----------------------------
-- Records of comp_category
-- ----------------------------
BEGIN;
INSERT INTO `comp_category` VALUES (1, '默认分类', '2020-06-03 12:00:04', '2020-06-03 12:00:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for func
-- ----------------------------
DROP TABLE IF EXISTS `func`;
CREATE TABLE `func` (
  `id` int NOT NULL AUTO_INCREMENT,
  `funcName` varchar(255) NOT NULL COMMENT '函数名字，项目下唯一',
  `funcParams` tinytext COMMENT '函数参数，逗号分隔字符串',
  `funcBody` mediumtext COMMENT '函数内容',
  `funcGroupId` int NOT NULL COMMENT 'function_group 表主键',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `funcGroupId` (`funcGroupId`),
  CONSTRAINT `func_ibfk_1` FOREIGN KEY (`funcGroupId`) REFERENCES `func_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='函数表';

-- ----------------------------
-- Records of func
-- ----------------------------
BEGIN;
INSERT INTO `func` VALUES (1, 'clearData', NULL, NULL, 1, '2020-06-03 11:19:58', '2020-06-03 11:19:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `func` VALUES (2, 'clearData', NULL, NULL, 1, '2020-06-03 11:26:06', '2020-06-03 15:28:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for func_group
-- ----------------------------
DROP TABLE IF EXISTS `func_group`;
CREATE TABLE `func_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) NOT NULL COMMENT '函数文件夹名称',
  `parentId` int NOT NULL DEFAULT '-1' COMMENT '父 group 节点的 id，无父节点即为 -1',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='函数分类表';

-- ----------------------------
-- Records of func_group
-- ----------------------------
BEGIN;
INSERT INTO `func_group` VALUES (1, '默认方法', -1, '2020-06-03 12:00:16', '2020-06-03 17:29:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `func_group` VALUES (2, '公开方法', -1, '2020-06-03 12:00:16', '2020-06-03 15:19:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `func_group` VALUES (3, 'hiei1-group1', -1, '2020-06-03 12:00:16', '2020-06-03 15:29:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `func_group` VALUES (4, 'hiei1-group1', -1, '2020-06-03 15:21:28', '2020-06-03 15:21:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for operate_log
-- ----------------------------
DROP TABLE IF EXISTS `operate_log`;
CREATE TABLE `operate_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operateCode` varchar(255) NOT NULL COMMENT '对应 perm.perm_code',
  `operateDesc` varchar(255) NOT NULL COMMENT '对应 perm.perm_desc',
  `operateUserId` int NOT NULL COMMENT 'user 表主键',
  `operateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operate_user_id` (`operateUserId`),
  CONSTRAINT `operate_log_ibfk_1` FOREIGN KEY (`operateUserId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作日志表';

-- ----------------------------
-- Records of operate_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) NOT NULL,
  `content` mediumtext NOT NULL COMMENT '页面的 targetData（JSON 串）',
  `sourceCode` mediumtext NOT NULL COMMENT '页面源代码',
  `status` int NOT NULL DEFAULT '0' COMMENT '项目状态：0 为正常，1 为私有，2 为删除',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='页面表';

-- ----------------------------
-- Records of page
-- ----------------------------
BEGIN;
INSERT INTO `page` VALUES (1, 'hiei1-page1', '[{\"componentId\":\"grid-23275ecf\",\"name\":\"grid\",\"type\":\"render-grid\",\"tabPanelActive\":\"props\",\"renderProps\":{\"margin-horizontal\":{\"type\":\"number\",\"val\":0},\"margin-vertical\":{\"type\":\"number\",\"val\":0},\"slots\":{\"type\":\"column\",\"val\":[{\"span\":1,\"children\":[{\"componentId\":\"button-c2ead190\",\"tabPanelActive\":\"props\",\"name\":\"button\",\"type\":\"bk-button\",\"renderProps\":{\"title\":{\"type\":\"string\",\"val\":\"hello world\",\"tips\":\"原生 html title 属性\"},\"size\":{\"type\":\"string\",\"val\":\"normal\",\"options\":[\"small\",\"normal\",\"large\"],\"tips\":\"按钮尺寸\"},\"theme\":{\"type\":\"string\",\"val\":\"default\",\"options\":[\"default\",\"primary\",\"success\",\"warning\",\"danger\"],\"tips\":\"按钮类型、主题\"},\"disabled\":{\"type\":\"boolean\",\"val\":false},\"slots\":{\"name\":\"text\",\"type\":\"text\",\"val\":\"基础按钮\"}},\"renderStyles\":{\"display\":\"inline-block\"},\"renderEvents\":{}}],\"width\":\"100%\"}]}},\"renderStyles\":{},\"renderEvents\":{}}]', '<template>\n    <section class=\"container\">\n        <div class=\"bk-layout-row grid-23275ecf\">\n            <div class=\"bk-layout-col\" style=\"width: 100%\">\n                <bk-button\n                    title=\"hello world\"\n                    size=\"normal\"\n                    theme=\"default\"\n                    :disabled=\"false\"\n                    class=\"bk-layout-component button-c2ead190\"\n                >\n                    基础按钮\n                </bk-button>\n            </div>\n        </div>\n    </section>\n</template>\n\n<script>\n    export default {}\n</script>\n<style lang=\"css\">\n    .container {\n        margin: 10px;\n    }\n    .bk-layout-row {\n        display: flex;\n    }\n    .bk-layout-row:after {\n        display: block;\n        clear: both;\n        content: \'\';\n        font-size: 0;\n        height: 0;\n        visibility: hidden;\n    }\n    .bk-layout-col {\n        float: left;\n        position: relative;\n        min-height: 1px;\n    }\n    .bk-form-radio {\n        margin-right: 20px;\n    }\n    .bk-form-checkbox {\n        margin-right: 20px;\n    }\n    /* 还原 bk-button 组件的 vertical-align 样式 */\n    .bk-layout-col button.bk-button {\n        vertical-align: baseline;\n    }\n    /* 每个组件之间默认外边距 5px */\n    .bk-layout-component {\n        margin: 5px;\n    }\n\n    .button-c2ead190 {\n        display: inline-block;\n    }\n</style>', 0, '2020-06-03 12:00:29', '2020-06-03 12:00:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `page` VALUES (2, 'hiei1-page2', 'aaa', 'bbb', 0, '2020-06-03 12:00:29', '2020-06-03 12:00:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `page` VALUES (3, 'jack1-page1', '111', '222', 0, '2020-06-03 12:00:29', '2020-06-03 12:00:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for perm
-- ----------------------------
DROP TABLE IF EXISTS `perm`;
CREATE TABLE `perm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permCode` varchar(255) NOT NULL,
  `permDesc` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COMMENT='权限表';

-- ----------------------------
-- Records of perm
-- ----------------------------
BEGIN;
INSERT INTO `perm` VALUES (1, 'create_project', '创建项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (2, 'update_project', '更新项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (3, 'delete_project', '删除项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (4, 'copy_project', '复制项目', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (5, 'download_project', '下载项目源码', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (6, 'create_page', '创建页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (7, 'update_page', '更新页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (8, 'delete_page', '删除页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (9, 'copy_page', '复制页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (10, 'download_page', '下载页面源码', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (11, 'preview_page', '预览页面', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (12, 'offline_component', '下架自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (13, 'online_component', '上线自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (14, 'public_component', '公开自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (15, 'private_component', '私有自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (16, 'update_component', '更新自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (17, 'view_component', '查看项目中的自定义组件', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (18, 'view_component_category', '查看自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (19, 'add_component_category', '添加自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (20, 'update_component_category', '更新自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (21, 'delete_component_category', '删除自定义组件的分类', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (22, 'add_user', '添加项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (23, 'update_user', '更新项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `perm` VALUES (24, 'delete_user', '删除项目成员', '2020-06-03 12:00:38', '2020-06-03 12:00:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `projectCode` varchar(255) NOT NULL COMMENT '项目 ID 即英文名称',
  `projectName` varchar(255) NOT NULL COMMENT '项目名称',
  `projectDesc` varchar(255) DEFAULT NULL COMMENT '项目简介',
  `status` int NOT NULL DEFAULT '0' COMMENT '项目状态：0 为正常，1 为私有，2 为删除',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='项目表';

-- ----------------------------
-- Records of project
-- ----------------------------
BEGIN;
INSERT INTO `project` VALUES (4, 'hiei1', 'hieiproject1', NULL, 0, '2020-06-03 12:00:46', '2020-06-03 12:00:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `project` VALUES (5, 'jack1', 'jackproject1', 'descsdsd', 0, '2020-06-03 12:00:46', '2020-06-03 14:28:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `project` VALUES (6, 'hiei2', 'hieiproject2', NULL, 0, '2020-06-03 12:00:46', '2020-06-03 12:00:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for r_favourite
-- ----------------------------
DROP TABLE IF EXISTS `r_favourite`;
CREATE TABLE `r_favourite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT 'user 表主键',
  `projectId` int NOT NULL COMMENT 'project 表主键',
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`),
  KEY `project_id` (`projectId`),
  CONSTRAINT `r_favourite_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `r_favourite_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='项目收藏表';

-- ----------------------------
-- Records of r_favourite
-- ----------------------------
BEGIN;
INSERT INTO `r_favourite` VALUES (2, 1, 5);
COMMIT;

-- ----------------------------
-- Table structure for r_project_comp
-- ----------------------------
DROP TABLE IF EXISTS `r_project_comp`;
CREATE TABLE `r_project_comp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL COMMENT 'project 表主键',
  `compId` int NOT NULL COMMENT 'component 表主键',
  `useVersionId` int NOT NULL COMMENT '当前使用的自定义组件的版本 id',
  `pageIds` varchar(255) NOT NULL DEFAULT '[]' COMMENT 'page 表主键的集合',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `page_id` (`pageIds`),
  KEY `category_id` (`compId`),
  KEY `project_id` (`projectId`),
  KEY `useVersionId` (`useVersionId`),
  CONSTRAINT `r_project_comp_ibfk_2` FOREIGN KEY (`compId`) REFERENCES `comp` (`id`),
  CONSTRAINT `r_project_comp_ibfk_3` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `r_project_comp_ibfk_4` FOREIGN KEY (`useVersionId`) REFERENCES `version` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='项目使用的自定义组件关联表';

-- ----------------------------
-- Records of r_project_comp
-- ----------------------------
BEGIN;
INSERT INTO `r_project_comp` VALUES (1, 4, 1, 1, '[1, 2]');
INSERT INTO `r_project_comp` VALUES (2, 4, 2, 3, '[1]');
COMMIT;

-- ----------------------------
-- Table structure for r_project_func_group
-- ----------------------------
DROP TABLE IF EXISTS `r_project_func_group`;
CREATE TABLE `r_project_func_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL COMMENT 'project 表主键',
  `funcGroupId` int NOT NULL COMMENT 'function 表主键',
  PRIMARY KEY (`id`),
  KEY `project_id` (`projectId`),
  KEY `r_project_func_group_ibfk_2` (`funcGroupId`),
  CONSTRAINT `r_project_func_group_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `r_project_func_group_ibfk_2` FOREIGN KEY (`funcGroupId`) REFERENCES `func_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='项目/函数关联表';

-- ----------------------------
-- Records of r_project_func_group
-- ----------------------------
BEGIN;
INSERT INTO `r_project_func_group` VALUES (5, 4, 1);
INSERT INTO `r_project_func_group` VALUES (6, 4, 4);
COMMIT;

-- ----------------------------
-- Table structure for r_project_page
-- ----------------------------
DROP TABLE IF EXISTS `r_project_page`;
CREATE TABLE `r_project_page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL COMMENT 'project 表主键',
  `pageId` int NOT NULL COMMENT 'page 表主键',
  PRIMARY KEY (`id`),
  KEY `project_id` (`projectId`),
  KEY `page_id` (`pageId`),
  CONSTRAINT `r_project_page_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `r_project_page_ibfk_2` FOREIGN KEY (`pageId`) REFERENCES `page` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='项目/页面关联表';

-- ----------------------------
-- Records of r_project_page
-- ----------------------------
BEGIN;
INSERT INTO `r_project_page` VALUES (2, 4, 1);
INSERT INTO `r_project_page` VALUES (3, 4, 2);
INSERT INTO `r_project_page` VALUES (4, 5, 3);
COMMIT;

-- ----------------------------
-- Table structure for r_role_perm
-- ----------------------------
DROP TABLE IF EXISTS `r_role_perm`;
CREATE TABLE `r_role_perm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL COMMENT 'role 表主键',
  `permId` int NOT NULL COMMENT 'perm 表主键',
  PRIMARY KEY (`id`),
  KEY `perm_id` (`roleId`),
  KEY `operate_id` (`permId`),
  CONSTRAINT `r_role_perm_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  CONSTRAINT `r_role_perm_ibfk_2` FOREIGN KEY (`permId`) REFERENCES `perm` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COMMENT='角色/权限关联表';

-- ----------------------------
-- Records of r_role_perm
-- ----------------------------
BEGIN;
INSERT INTO `r_role_perm` VALUES (1, 1, 1);
INSERT INTO `r_role_perm` VALUES (2, 1, 2);
INSERT INTO `r_role_perm` VALUES (3, 1, 3);
INSERT INTO `r_role_perm` VALUES (4, 1, 4);
INSERT INTO `r_role_perm` VALUES (5, 1, 5);
INSERT INTO `r_role_perm` VALUES (6, 1, 6);
INSERT INTO `r_role_perm` VALUES (7, 1, 7);
INSERT INTO `r_role_perm` VALUES (8, 1, 8);
INSERT INTO `r_role_perm` VALUES (9, 1, 9);
INSERT INTO `r_role_perm` VALUES (10, 1, 10);
INSERT INTO `r_role_perm` VALUES (11, 1, 11);
INSERT INTO `r_role_perm` VALUES (12, 1, 12);
INSERT INTO `r_role_perm` VALUES (13, 1, 13);
INSERT INTO `r_role_perm` VALUES (14, 1, 14);
INSERT INTO `r_role_perm` VALUES (15, 1, 15);
INSERT INTO `r_role_perm` VALUES (16, 1, 16);
INSERT INTO `r_role_perm` VALUES (17, 1, 17);
INSERT INTO `r_role_perm` VALUES (21, 1, 18);
INSERT INTO `r_role_perm` VALUES (22, 1, 19);
INSERT INTO `r_role_perm` VALUES (23, 1, 20);
INSERT INTO `r_role_perm` VALUES (24, 2, 5);
INSERT INTO `r_role_perm` VALUES (25, 2, 6);
INSERT INTO `r_role_perm` VALUES (26, 2, 7);
INSERT INTO `r_role_perm` VALUES (27, 2, 8);
INSERT INTO `r_role_perm` VALUES (28, 2, 9);
INSERT INTO `r_role_perm` VALUES (29, 2, 10);
INSERT INTO `r_role_perm` VALUES (30, 2, 11);
INSERT INTO `r_role_perm` VALUES (31, 2, 12);
INSERT INTO `r_role_perm` VALUES (32, 2, 13);
INSERT INTO `r_role_perm` VALUES (33, 2, 14);
INSERT INTO `r_role_perm` VALUES (34, 2, 15);
INSERT INTO `r_role_perm` VALUES (35, 2, 16);
INSERT INTO `r_role_perm` VALUES (36, 2, 17);
INSERT INTO `r_role_perm` VALUES (37, 3, 11);
INSERT INTO `r_role_perm` VALUES (38, 1, 21);
INSERT INTO `r_role_perm` VALUES (39, 1, 22);
INSERT INTO `r_role_perm` VALUES (40, 1, 23);
INSERT INTO `r_role_perm` VALUES (41, 1, 24);
COMMIT;

-- ----------------------------
-- Table structure for r_user_project_role
-- ----------------------------
DROP TABLE IF EXISTS `r_user_project_role`;
CREATE TABLE `r_user_project_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT 'user 表主键',
  `projectId` int NOT NULL COMMENT 'project 表主键',
  `roleId` int NOT NULL COMMENT 'role 表主键',
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`),
  KEY `project_id` (`projectId`),
  KEY `role_id` (`roleId`),
  CONSTRAINT `r_user_project_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `r_user_project_role_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `r_user_project_role_ibfk_3` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='用户/项目/角色关联表';

-- ----------------------------
-- Records of r_user_project_role
-- ----------------------------
BEGIN;
INSERT INTO `r_user_project_role` VALUES (1, 1, 4, 1);
INSERT INTO `r_user_project_role` VALUES (2, 2, 5, 1);
INSERT INTO `r_user_project_role` VALUES (3, 1, 6, 1);
INSERT INTO `r_user_project_role` VALUES (4, 2, 4, 2);
INSERT INTO `r_user_project_role` VALUES (5, 3, 4, 3);
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleCode` varchar(255) NOT NULL COMMENT '角色 ID',
  `roleName` varchar(255) NOT NULL COMMENT '角色名称',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `role_id` (`roleCode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES (1, 'root', '超级管理员', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `role` VALUES (2, 'developer', '开发者', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `role` VALUES (3, 'viewer', '预览者', '2020-06-03 12:00:59', '2020-06-03 12:00:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '系统的用户名（内部版为企业微信，外部版为注册的用户名）',
  `qq` int DEFAULT NULL COMMENT 'QQ 账号（外部版）',
  `wx` varchar(255) DEFAULT NULL COMMENT '微信账号（外部版）',
  `bk` varchar(255) DEFAULT NULL COMMENT '企业版/社区版账号（外部版）',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'hieiwang', NULL, NULL, NULL, '2020-06-03 12:01:08', '2020-06-03 12:01:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user` VALUES (2, 'jack', NULL, NULL, NULL, '2020-06-03 12:01:08', '2020-06-03 12:01:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user` VALUES (3, 'view_a', NULL, NULL, NULL, '2020-06-03 12:01:08', '2020-06-03 12:01:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for version
-- ----------------------------
DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `id` int NOT NULL AUTO_INCREMENT,
  `componentId` int NOT NULL COMMENT 'component 表的主键',
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `versionLog` mediumtext NOT NULL COMMENT '版本日志',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `col1` varchar(255) DEFAULT NULL COMMENT '预留字段1',
  `col2` varchar(255) DEFAULT NULL COMMENT '预留字段2',
  `col3` varchar(255) DEFAULT NULL COMMENT '预留字段3',
  `col4` varchar(255) DEFAULT NULL COMMENT '预留字段4',
  `col5` varchar(255) DEFAULT NULL COMMENT '预留字段5',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `component_id` (`componentId`),
  CONSTRAINT `version_ibfk_1` FOREIGN KEY (`componentId`) REFERENCES `comp` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='自定义组件版本表';

-- ----------------------------
-- Records of version
-- ----------------------------
BEGIN;
INSERT INTO `version` VALUES (1, 1, '0.0.1', '初始化', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `version` VALUES (2, 1, '0.0.2', '修复 bug', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `version` VALUES (3, 2, '0.0.1', '初始化 x-table', '2020-06-03 12:01:16', '2020-06-03 12:01:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
