/* Replace with your SQL commands */
ALTER TABLE `project_version`
ADD COLUMN `archiveFlag` int(11) NULL DEFAULT 0 COMMENT '是否归档' AFTER `updateTime`;