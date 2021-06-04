-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `isOffline` int(11) DEFAULT 0 COMMENT '1代表下架操作，0表示部署操作';

-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `moduleCode` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '本次部署对应模块' AFTER `bindInfo`;

-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `appCode` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '本次部署对应应用' AFTER `bindInfo`;

-- ----------------------------
-- Alter Table release_version
-- ----------------------------
ALTER TABLE `release_version`
ADD COLUMN `fromPaasInfo` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '同步paas平台部署信息' AFTER `bindInfo`;
