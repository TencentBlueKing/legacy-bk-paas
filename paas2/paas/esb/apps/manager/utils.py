# -*-coding:utf-8 -*-
import os

import markdown
from markdown.extensions.headerid import HeaderIdExtension


def md2html(name):
    app_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(app_dir, "templates/manager/mdfiles", "%s.md" % name)
    with open(file_path) as fp:
        md_content = unicode(fp.read(), "utf-8")
        html_content = markdown.markdown(
            md_content,
            extensions=[
                "tables",
                "attr_list",
                "fenced_code",
                HeaderIdExtension(level=1),
                "markdown.extensions.codehilite",
                "markdown.extensions.toc",
            ],
        )
    return html_content
