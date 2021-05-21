-- ----------------------------
-- Alter Table page
-- ----------------------------
ALTER TABLE `func`
ADD COLUMN `funcCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '函数项目下唯一code' AFTER `remoteParams`;
