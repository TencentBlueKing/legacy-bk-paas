CREATE INDEX category_id ON comp (categoryId);
CREATE INDEX belong_project_id ON comp (belongProjectId);

CREATE INDEX belong_project_id ON comp_category (belongProjectId);

CREATE INDEX func_group_id ON func (funcGroupId);

CREATE INDEX layout_id ON layout_inst (layoutId);
CREATE INDEX project_id ON layout_inst (projectId);

CREATE INDEX project_id ON r_func_func (projectId);
CREATE INDEX func_code ON r_func_func (funcCode);

CREATE INDEX variable_id ON r_func_variable (variableId);
CREATE INDEX project_id ON r_func_variable (projectId);
CREATE INDEX func_code ON r_func_variable (funcCode);

CREATE INDEX comp_id ON r_page_comp (compId);
CREATE INDEX version_id ON r_page_comp (versionId);

CREATE INDEX page_id ON r_page_func (pageId);
CREATE INDEX project_id ON r_page_func (projectId);
CREATE INDEX func_id ON r_page_func (funcId);

CREATE INDEX layout_id ON r_page_route (layoutId);

CREATE INDEX variable_d ON r_page_variable (variableId);
CREATE INDEX project_id ON r_page_variable (projectId);
CREATE INDEX page_code ON r_page_variable (pageCode);

CREATE INDEX variable_id ON r_variable_func (variableId);
CREATE INDEX project_id ON r_variable_func (projectId);
CREATE INDEX func_code ON r_variable_func (funcCode);

CREATE INDEX variable_id ON r_variable_variable (variableId);
CREATE INDEX project_id ON r_variable_variable (projectId);
CREATE INDEX variable_d ON r_variable_variable (parentVariableId);

CREATE INDEX project_id ON release_version (projectId);

CREATE INDEX parent_id ON route (parentId);

CREATE INDEX project_id ON variable (projectId);
