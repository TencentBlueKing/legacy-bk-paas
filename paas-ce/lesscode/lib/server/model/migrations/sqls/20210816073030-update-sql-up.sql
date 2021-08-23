CREATE TABLE `page_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `templateName` varchar(255) NOT NULL,
  `templateCode` varchar(255) COMMENT '模板 ID 即英文名称',
  `content` longtext COMMENT '模板的 targetData（JSON 串）',
  `previewImg` longtext COMMENT '缩略图base64',
  `isOffcial` int(11) NOT NULL DEFAULT '0' COMMENT '是否官方模板：0 为私有，1 为官方',
  `offcialType` varchar(50) COMMENT '官方模板类型',
  `categoryId` int(11) NOT NULL DEFAULT '0' COMMENT '分类id',
  `belongProjectId` int(11) COMMENT '所属项目',
  `parentId` int(11) COMMENT '父级id',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最新更新时间',
  `createUser` varchar(255) DEFAULT NULL COMMENT '创建人，默认当前用户',
  `updateUser` varchar(255) DEFAULT NULL COMMENT '更新人，默认当前用户',
  `deleteFlag` int(11) DEFAULT '0' COMMENT '是否删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='page模板表';

CREATE TABLE `page_template_category` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='模板分类表';

CREATE TABLE `api_migration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='api-migration记录表';