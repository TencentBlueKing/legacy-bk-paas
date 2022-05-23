/* Replace with your SQL commands */

CREATE TABLE `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) NOT NULL COMMENT 'project 表主键',
  `name` varchar(255) NOT NULL COMMENT '文件名',
  `url` varchar(255) NOT NULL COMMENT '访问地址',
  `mime` varchar(255) DEFAULT NULL COMMENT 'mime类型',
  `ext` varchar(255) DEFAULT NULL COMMENT '后缀名',
  `size` int(11) DEFAULT NULL COMMENT '存储大小',
  `status` varchar(255) DEFAULT NULL COMMENT '上传状态，ready | uploading | success | fail',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createUser` varchar(255) DEFAULT NULL,
  `updateUser` varchar(255) DEFAULT NULL,
  `deleteFlag` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
