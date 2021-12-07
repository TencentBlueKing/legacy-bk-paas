/* Replace with your SQL commands */
ALTER TABLE `page`
ADD COLUMN `pageType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '页面类型：PC 或 MOBILE' AFTER `pageCode`;

ALTER TABLE `layout`
ADD COLUMN `layoutType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '布局模板类型：PC 或 MOBILE' AFTER `id`;