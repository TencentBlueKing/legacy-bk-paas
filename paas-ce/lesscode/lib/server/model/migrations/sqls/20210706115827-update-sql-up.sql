/* Replace with your SQL commands */
ALTER TABLE `page`
ADD COLUMN `activeTime` datetime(0) DEFAULT NULL COMMENT '最后活跃时间' AFTER `updateUser`;

ALTER TABLE `page`
ADD COLUMN `activeUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '最后活跃用户' AFTER `activeTime`;