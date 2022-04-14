ALTER TABLE `func_group` 
ADD COLUMN `projectId` int(11) NULL COMMENT '项目id' AFTER `id`,
ADD COLUMN `versionId` int(11) NULL COMMENT '版本id' AFTER `projectId`;

ALTER TABLE `func` 
ADD COLUMN `projectId` int(11) NULL COMMENT '项目id' AFTER `id`,
ADD COLUMN `funcGroupName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '函数分类名' AFTER `funcGroupId`,
ADD COLUMN `versionId` int(11) NULL COMMENT '版本id' AFTER `funcGroupName`;