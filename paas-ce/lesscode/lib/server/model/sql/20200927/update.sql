-- ----------------------------
-- Alter Table r_page_route
-- ----------------------------
ALTER TABLE `r_page_route`
MODIFY COLUMN `deleteFlag` int(11) NULL DEFAULT 0 COMMENT '是否删除，1代表已删除' AFTER `updateUser`;
