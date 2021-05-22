-- ----------------------------
-- Alter Table r_page_route
-- ----------------------------
ALTER TABLE `r_page_route`
ADD COLUMN `redirect` int(11) NULL COMMENT '跳转 route' AFTER `pageId`;