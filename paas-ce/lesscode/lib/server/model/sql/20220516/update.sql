ALTER TABLE `release_version`
ADD COLUMN `fromProjectVersion` varchar(255) NULL COMMENT '来源于的应用版本' AFTER `isOffline`;
