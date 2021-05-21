-- MySQL dump 10.14  Distrib 5.5.64-MariaDB, for Linux (x86_64)
--
-- Host: gamedb.appdb0.blueking.db    Database: bkapp-visual-6bo
-- ------------------------------------------------------
-- Server version	5.7.20-tmysql-3.1.5-log
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL COMMENT '自定义组件 id，全局唯一，（要和上传的 config.js 中的 type 一致，自定义组件的标签名）',
  `name` varchar(255) NOT NULL COMMENT '自定义组件名称',
  `displayName` varchar(255) NOT NULL COMMENT '自定义组件中文名称',
  `categoryId` int(11) NOT NULL COMMENT '自定义组件分类',
  `belongProjectId` int(11) NOT NULL COMMENT '自定义组件所属项目',
  `isPublic` int(11) NOT NULL DEFAULT '0' COMMENT '是否公开：0 为公开，1 为不公开',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '自定义组件状态：0 为已发布，1 为已下架',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='自定义组件表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comp_category`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comp_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `belongProjectId` int(11) NOT NULL COMMENT '所属项目',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  `order` int(11) NOT NULL COMMENT '排序索引',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='组件分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `func`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `func` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `funcName` varchar(255) NOT NULL COMMENT '函数名字，项目下唯一',
  `funcParams` text COMMENT '函数参数，逗号分隔字符串',
  `funcBody` longtext COMMENT '函数内容',
  `funcGroupId` int(11) NOT NULL COMMENT 'function_group 表主键',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `funcSummary` text COMMENT '函数简介',
  `funcType` int(11) DEFAULT NULL COMMENT '函数模板类型',
  `funcMethod` varchar(255) DEFAULT NULL COMMENT '远程函数方法',
  `withToken` int(11) DEFAULT '0' COMMENT '远程方法是否携带Token',
  `funcApiData` mediumtext COMMENT '远程函数数据体',
  `publicFlag` int(1) unsigned zerofill DEFAULT '0' COMMENT '是否公开',
  `funcApiUrl` varchar(255) DEFAULT NULL COMMENT '远程函数URL',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  `order` int(11) DEFAULT NULL COMMENT '排序',
  `remoteParams` text COMMENT '回调函数参数，逗号分隔字符串',
  `funcCode` varchar(255) NOT NULL COMMENT '函数项目下唯一code',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='函数表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `func_group`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `func_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) NOT NULL COMMENT '函数文件夹名称',
  `parentId` int(11) NOT NULL DEFAULT '-1' COMMENT '父 group 节点的 id，无父节点即为 -1',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `order` int(11) DEFAULT NULL COMMENT '排序',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='函数分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `layout`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `layout` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `defaultPath` varchar(30) NOT NULL COMMENT '默认路由',
  `defaultName` varchar(30) NOT NULL COMMENT '布局中文名称',
  `defaultCode` varchar(255) NOT NULL COMMENT '布局英文名称',
  `type` varchar(20) NOT NULL COMMENT '布局类型',
  `code` longtext COMMENT '模板源码',
  `defaultContent` longtext NOT NULL COMMENT '默认targetData',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `createUser` varchar(255) DEFAULT NULL,
  `updateUser` varchar(255) DEFAULT NULL,
  `deleteFlag` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='平台布局模板表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `layout_inst`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `layout_inst` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext NOT NULL COMMENT '布局的targetData',
  `layoutId` int(11) NOT NULL COMMENT 'layout 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `routePath` varchar(255) DEFAULT NULL COMMENT '布局路由路径',
  `isDefault` int(11) NOT NULL DEFAULT '0' COMMENT '是否默认空模板：1为是，0为否',
  `showName` varchar(30) NOT NULL COMMENT '布局展示名称',
  `layoutCode` varchar(255) NOT NULL COMMENT '布局英文名称',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `createUser` varchar(255) DEFAULT NULL,
  `updateUser` varchar(255) DEFAULT NULL,
  `deleteFlag` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目模板表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operate_log`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operate_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) DEFAULT NULL COMMENT '项目id',
  `operateObj` varchar(255) NOT NULL COMMENT '操作对象',
  `operateCode` varchar(255) NOT NULL COMMENT '对应 perm.perm_code',
  `operateCodeText` varchar(255) NOT NULL COMMENT '对应 perm.perm_desc',
  `operateTarget` varchar(255) NOT NULL COMMENT '操作目标',
  `operateUserId` int(11) NOT NULL COMMENT 'user 表主键',
  `operateStatus` int(11) NOT NULL COMMENT '操作状态：1为成功，0为失败',
  `operateDesc` longtext COMMENT '操作描述',
  `operateRaw` longtext COMMENT '操作请求和响应原始数据',
  `operateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `operate_user_id` (`operateUserId`) USING BTREE,
  KEY `operate_project_id` (`projectId`) USING BTREE,
  KEY `operate_obj` (`operateObj`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='操作日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `page`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageName` varchar(255) NOT NULL,
  `pageCode` varchar(255) NOT NULL COMMENT '页面 ID 即英文名称',
  `lifeCycle` mediumtext NOT NULL COMMENT '页面的生命周期',
  `content` longtext COMMENT '页面的 targetData（JSON 串）',
  `sourceCode` longtext COMMENT '页面源代码',
  `previewImg` longtext COMMENT '缩略图base64',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '项目状态：0 为正常，1 为私有，2 为删除',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='页面表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `perm`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permCode` varchar(255) NOT NULL,
  `permDesc` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `projectCode` varchar(255) NOT NULL COMMENT '项目 ID 即英文名称',
  `projectName` varchar(255) NOT NULL COMMENT '项目名称',
  `projectDesc` varchar(255) DEFAULT NULL COMMENT '项目简介',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '项目状态：0 为正常，1 为私有',
  `appCode` varchar(100) DEFAULT NULL COMMENT '绑定蓝鲸应用名称',
  `moduleCode` varchar(100) DEFAULT NULL COMMENT '绑定应用模块名称',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_comp_favourite`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_comp_favourite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `comp_id` (`compId`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='组件收藏关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_comp_share`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_comp_share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `sourceProjectId` int(11) NOT NULL COMMENT '源项目id，project 表主键',
  `targetProjectId` int(11) NOT NULL COMMENT '目标项目id，project 表主键',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `source_project_id` (`sourceProjectId`) USING BTREE,
  KEY `target_project_id` (`targetProjectId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='组件共享关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_favourite`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_favourite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT 'user 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id` (`userId`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目收藏表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_func_func`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_func_func` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentFuncCode` varchar(255) NOT NULL COMMENT 'func 表 Code',
  `funcCode` varchar(255) NOT NULL COMMENT 'func 表 Code',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `parentFuncCode` (`parentFuncCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='函数与函数关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_page_comp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_page_comp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `compId` int(11) NOT NULL COMMENT 'comp 表主键',
  `versionId` int(11) NOT NULL COMMENT 'version 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE,
  KEY `page_id` (`pageId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='页面组件关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_page_func`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_page_func` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `funcId` int(11) NOT NULL COMMENT 'function 表主键',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_page_route`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_page_route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `routeId` int(11) NOT NULL COMMENT 'route 表主键',
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `layoutId` int(11) NOT NULL COMMENT 'layout_inst 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`),
  KEY `page_id` (`pageId`) USING BTREE,
  KEY `route_id` (`routeId`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='页面路由关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_project_comp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_project_comp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `compId` int(11) NOT NULL COMMENT 'component 表主键',
  `useVersionId` int(11) NOT NULL COMMENT '当前使用的自定义组件的版本 id',
  `pageIds` varchar(255) NOT NULL DEFAULT '[]' COMMENT 'page 表主键的集合',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `page_id` (`pageIds`) USING BTREE,
  KEY `category_id` (`compId`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE,
  KEY `useVersionId` (`useVersionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目使用的自定义组件关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_project_func_group`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_project_func_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `funcGroupId` int(11) NOT NULL COMMENT 'function 表主键',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE,
  KEY `r_project_func_group_ibfk_2` (`funcGroupId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目/函数关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_project_page`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_project_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `pageId` int(11) NOT NULL COMMENT 'page 表主键',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE,
  KEY `page_id` (`pageId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='项目/页面关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_role_perm`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_role_perm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL COMMENT 'role 表主键',
  `permId` int(11) NOT NULL COMMENT 'perm 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `perm_id` (`roleId`) USING BTREE,
  KEY `operate_id` (`permId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色/权限关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `r_user_project_role`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_user_project_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL COMMENT 'user 表主键',
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `updateTime` datetime DEFAULT NULL COMMENT '创建时间',
  `createTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `roleId` int(11) NOT NULL COMMENT 'role 表主键',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id` (`userId`) USING BTREE,
  KEY `project_id` (`projectId`) USING BTREE,
  KEY `role_id` (`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户/项目/角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `release_version`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `release_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `releaseType` varchar(20) DEFAULT NULL COMMENT '发布类型',
  `env` varchar(10) DEFAULT NULL COMMENT '部署环境',
  `version` varchar(40) DEFAULT NULL COMMENT '版本号',
  `projectId` int(11) NOT NULL COMMENT '所属项目',
  `codeUrl` varchar(255) DEFAULT NULL COMMENT '项目源码存放路径',
  `status` varchar(20) DEFAULT NULL COMMENT '当前状态',
  `accessUrl` varchar(60) DEFAULT NULL COMMENT '访问url',
  `errorMsg` text COMMENT '程序报错信息',
  `currentStep` varchar(20) DEFAULT NULL COMMENT '当前运行阶段',
  `deployId` varchar(50) DEFAULT NULL COMMENT 'v3部署关联id',
  `bindInfo` varchar(100) DEFAULT NULL COMMENT '绑定应用和模块名称',
  `fromPaasInfo` text COMMENT '同步paas平台部署信息',
  `appCode` varchar(40) NOT NULL COMMENT '本次部署对应应用',
  `moduleCode` varchar(40) NOT NULL COMMENT '本次部署对应模块',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  `isOffline` int(11) DEFAULT '0' COMMENT '1代表下架操作，0表示部署操作',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='版本部署表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleCode` varchar(255) NOT NULL COMMENT '角色 ID',
  `roleName` varchar(255) NOT NULL COMMENT '角色名称',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `role_id` (`roleCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `route`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentId` int(11) NOT NULL DEFAULT '-1' COMMENT '父 route 节点的 id，无父节点即为 -1',
  `path` varchar(255) NOT NULL COMMENT '路由路径',
  `order` int(11) DEFAULT '1' COMMENT '排序',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路由表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `token`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL COMMENT 'token',
  `appCode` varchar(255) NOT NULL COMMENT 'appCode',
  `expiresTime` datetime DEFAULT NULL COMMENT '过期时间',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `tokenUser` varchar(255) DEFAULT NULL COMMENT 'token 生成人',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='token';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '系统的用户名（内部版为企业微信，外部版为注册的用户名）',
  `qq` int(11) DEFAULT NULL COMMENT 'QQ 账号（外部版）',
  `wx` varchar(255) DEFAULT NULL COMMENT '微信账号（外部版）',
  `bk` varchar(255) DEFAULT NULL COMMENT '企业版/社区版账号（外部版）',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `version`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `componentId` int(11) NOT NULL COMMENT 'component 表的主键',
  `componentDest` varchar(255) NOT NULL COMMENT '自定义组件路径',
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `versionLog` longtext NOT NULL COMMENT '版本日志',
  `description` varchar(255) NOT NULL COMMENT '组件描述',
  `isLast` int(11) NOT NULL COMMENT '是否是最新版本，0历史版本，1最新版本',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `component_id` (`componentId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='自定义组件版本表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-25 11:09:06
