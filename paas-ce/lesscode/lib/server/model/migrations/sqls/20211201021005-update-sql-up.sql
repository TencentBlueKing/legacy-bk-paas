/* Replace with your SQL commands */
ALTER TABLE `page`
ADD COLUMN `pageType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '页面类型' AFTER `pageCode`;