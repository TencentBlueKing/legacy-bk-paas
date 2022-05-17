/* Replace with your SQL commands */

ALTER TABLE `func_group` 
ADD COLUMN `projectId` int(11) NULL COMMENT '项目id' AFTER `id`,
ADD COLUMN `versionId` int(11) NULL COMMENT '版本id' AFTER `projectId`;

ALTER TABLE `func` 
ADD COLUMN `projectId` int(11) NULL COMMENT '项目id' AFTER `id`,
ADD COLUMN `versionId` int(11) NULL COMMENT '版本id' AFTER `funcGroupId`;
