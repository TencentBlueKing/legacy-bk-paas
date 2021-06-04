-- ----------------------------
-- Alter Table layout
-- ----------------------------
ALTER TABLE `layout`
ADD COLUMN `defaultCode` varchar(255) NOT NULL COMMENT '布局英文名称' AFTER `defaultName`;

-- ----------------------------
-- Alter Table layout_inst
-- ----------------------------
ALTER TABLE `layout_inst`
ADD COLUMN `layoutCode` varchar(255) NOT NULL COMMENT '布局英文名称' AFTER `showName`;

-- ----------------------------
-- Update `defaultCode`  of layout
-- ----------------------------
UPDATE `layout` SET `defaultCode` = 'emptyView' WHERE `id` = 1;
UPDATE `layout` SET `defaultCode` = 'sideView' WHERE `id` = 2;
UPDATE `layout` SET `defaultCode` = 'horizontalView' WHERE `id` = 3;
UPDATE `layout` SET `defaultCode` = 'complexView' WHERE `id` = 4;
