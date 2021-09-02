/* Replace with your SQL commands */
ALTER TABLE `page`
MODIFY COLUMN `pageName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '页面名称' AFTER `id`;

ALTER TABLE `project`
MODIFY COLUMN `projectName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '项目名称' AFTER `projectCode`;

ALTER TABLE `func_group`
MODIFY COLUMN `groupName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '分类名称' AFTER `id`;

ALTER TABLE `comp_category`
MODIFY COLUMN `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '分类名称' AFTER `id`;
