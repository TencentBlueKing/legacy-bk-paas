ALTER TABLE `token` 
ADD COLUMN `refreshToken` varchar(255) NULL COMMENT 'refreshToken' AFTER `deleteFlag`,
ADD COLUMN `refreshTime` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '刷新token时间' AFTER `refreshToken`;