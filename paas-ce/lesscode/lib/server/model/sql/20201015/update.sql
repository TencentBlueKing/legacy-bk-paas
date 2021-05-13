-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `fromPaasInfo` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '同步paas平台部署信息' AFTER `bindInfo`;
