ALTER TABLE `release_version`
ADD COLUMN `mobileUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '移动端首页路径' AFTER `codeUrl`;
