ALTER TABLE `project`
ADD COLUMN `isOffcial` int(11) NOT NULL DEFAULT '0' COMMENT '是否官方项目模板：0 为私有，1 为官方' AFTER `moduleCode`,
ADD COLUMN `offcialType` varchar(50) COMMENT '官方模板类型' AFTER `moduleCode`;