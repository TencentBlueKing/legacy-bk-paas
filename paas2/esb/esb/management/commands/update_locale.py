# -*- coding: utf-8 -*-
import re
import os
import copy
import json
from optparse import make_option

from django.conf import settings
from django.core.management.base import BaseCommand

from common.base_utils import read_file

import logging

logger = logging.getLogger(__name__)

BASE_DIR = settings.BASE_DIR


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option("--force", action="store_true", dest="force", help="Force update locale file"),
        make_option("--parse", action="store_true", dest="parse", help="only parse and print translation info"),
    )

    def handle(self, *args, **options):
        self.force = options["force"]
        self.parse = options.get("parse")

        client = TranslationClient()
        client.parse_translation_info()
        self.translation_info = client.translation_info

        if self.parse:
            logger.info("%s", json.dumps(self.translation_info))
            return

        self.update_locale_zh_hans()
        self.update_locale_en()

    def update_locale_zh_hans(self):
        zh_hans_fpath = os.path.join(BASE_DIR, "locale/locale_api/zh_Hans/LC_MESSAGES/django.po")
        new_content = self._get_new_content_for_locale(zh_hans_fpath)
        writelines_file(new_content, zh_hans_fpath)

    def update_locale_en(self):
        en_fpath = os.path.join(BASE_DIR, "locale/locale_api/en/LC_MESSAGES/django.po")

        new_content = self._get_new_content_for_locale(en_fpath, is_en=True)
        writelines_file(new_content, en_fpath)

    def _get_new_content_for_locale(self, path, is_en=False):
        content = read_file(path)
        content = content.splitlines()
        new_content = []
        for index, line in enumerate(content):
            # 空行和注释，直接添加到新文档
            if not line or line.startswith("#"):
                new_content.append(line)
                continue
            # 不是一个 msg 起始部分，直接跳过
            if not line.startswith("msgid"):
                continue
            # 处理一个 msg
            msgid = []
            msgstr = []
            for line in content[index:]:
                if not line:
                    break
                elif line.startswith("msgid"):
                    is_msgid = True
                    msgid.append(line)
                elif line.startswith("msgstr"):
                    is_msgid = False
                    msgstr.append(line)
                elif is_msgid:
                    msgid.append(line)
                else:
                    msgstr.append(line)
            msgid_str = self._get_msg_str(msgid)
            msgstr_str = self._get_msg_str(msgstr)
            new_content.extend(msgid)

            if is_en:
                msgstr = self._get_msgstr_for_en(msgid_str, msgstr_str, msgstr)
            else:
                msgstr = self._get_msgstr_for_zh_hans(msgid_str, msgstr_str, msgstr)
            new_content.extend(msgstr)
        return new_content

    def _get_msgstr_for_en(self, msgid_str, msgstr_str, msgstr):
        new_msgstr_str = self.translation_info.get(msgid_str)
        if not new_msgstr_str or msgstr_str == new_msgstr_str:
            return msgstr
        else:
            if self.force:
                logger.info("msgstr changed for msgid: %s\nmsgstr: %s -> %s", msgid_str, msgstr_str, new_msgstr_str)
                return ['msgstr "%s"' % new_msgstr_str]
            else:
                logger.warning("msgstr change for msgid: %s\nmsgstr: %s -> %s", msgid_str, msgstr_str, new_msgstr_str)
                return msgstr

    def _get_msgstr_for_zh_hans(self, msgid_str, msgstr_str, msgstr):
        if msgid_str and msgstr_str and msgstr_str != msgid_str:
            raise Exception("msgid msgstr not equal, please check\nmsgid: %s\nmsgstr: %s" % (msgid_str, msgstr_str))
        if msgstr_str:
            return msgstr
        else:
            return ['msgstr "%s"' % msgid_str]

    def _get_msg_str(self, msg):
        msg = copy.copy(msg)
        msg[0] = re.sub("^(msgid|msgstr) ", "", msg[0])
        msg = map(eval, msg)
        return "".join(msg)


class TranslationClient(object):
    def __init__(self):
        self.original_api_doc_path = settings.ORIGINAL_API_DOC_PATH
        self.translation_info = {}

    def parse_translation_info(self):
        self.parse_job_translation_info()
        # self.parse_gse_translation_info()
        # self.parse_bkpaas_translation_info()
        # self.parse_cc_translation_info()

    def parse_job_translation_info(self):
        ignore_files = [
            "README.md",
            "execute_job_ext.md",
            "get_agent_status.md",
        ]
        file_list = self.get_doc_file_list(os.path.join(self.original_api_doc_path, "job"), ignore_files)
        for file_path in file_list:
            content = read_file(file_path)

            func_name_obj = re.search(r"\* +功能名称 +([\S]+) +(.*)", content)
            if func_name_obj:
                func_name = func_name_obj.group(1).strip()
                func_name_en = func_name_obj.group(2).strip()
                self.add_translation_info(func_name, func_name_en)
            else:
                logger.warning(u"component has no 功能名称 translation, file_path: %s", file_path)

            func_desc_obj = re.search(r"\* +中文：(.*)", content)
            func_desc_en_obj = re.search(r"\* +英文：(.*)", content)
            if func_desc_obj and func_desc_en_obj:
                func_desc = func_desc_obj.group(1).strip()
                func_desc_en = func_desc_en_obj.group(1).strip()
                self.add_translation_info(func_desc, func_desc_en)
            else:
                logger.warning(u"component has no 中文/英文 translation, file_path: %s", file_path)

            content = content.splitlines()
            for index, line in enumerate(content):
                line = line.strip()
                if not line.startswith("|"):
                    continue
                line = line.split("|")
                line = [x.strip() for x in line if x.strip()]
                if len(line) >= 5:
                    self.add_translation_info(line[3], line[4])

    def parse_gse_translation_info(self):
        include_files = [
            "get_agent_status.md",
            "get_agent_info.md",
        ]
        file_list = self.get_doc_file_list(
            os.path.join(self.original_api_doc_path, "gse"), include_files=include_files
        )
        for file_path in file_list:
            content = read_file(file_path)

            func_name_obj = re.search(r"# +(.*)", content)
            func_name_en_obj = re.search(r"\* English Label: *(.*)", content)
            if func_name_obj and func_name_en_obj:
                func_name = func_name_obj.group(1).strip()
                func_name_en = func_name_en_obj.group(1).strip()
                self.add_translation_info(func_name, func_name_en)
            else:
                logger.warning(u"component has no [#/English Label] translation, file_path: %s", file_path)

            func_desc_obj = re.search(r"\* +中文：(.*)", content)
            func_desc_en_obj = re.search(r"\* +英文：(.*)", content)
            if func_desc_obj and func_desc_en_obj:
                func_desc = func_desc_obj.group(1).strip()
                func_desc_en = func_desc_en_obj.group(1).strip()
                self.add_translation_info(func_desc, func_desc_en)
            else:
                logger.warning(u"component has no 中文/英文 translation, file_path: %s", file_path)

            content = content.splitlines()
            for index, line in enumerate(content):
                line = line.strip()
                if not line.startswith("|"):
                    continue
                line = line.split("|")
                line = [x.strip() for x in line if x.strip()]
                if len(line) >= 5:
                    self.add_translation_info(line[3], line[4])

    def parse_cc_translation_info(self):
        include_files = [
            "host_custom_api.md",
            "host_delete.md",
            "host_relation.md",
            "host_search.md",
            "host_update.md",
            "object_biz.md",
            "object_module.md",
            "object_set.md",
        ]
        file_list = self.get_doc_file_list(os.path.join(self.original_api_doc_path, "cc"), include_files=include_files)
        for file_path in file_list:
            content = read_file(file_path)
            content = content.splitlines()
            content = [line.strip() for line in content if line.strip()]
            for index, line in enumerate(content):
                if line.startswith("###"):
                    func_name_obj = re.search(r"### +(.*)", line)
                    func_name_en_obj = re.search(r"\* *English Label: *(.*)", content[index + 1])
                    if func_name_obj and func_name_en_obj:
                        func_name = func_name_obj.group(1).strip()
                        func_name_en = func_name_en_obj.group(1).strip()
                        self.add_translation_info(func_name, func_name_en)
                    else:
                        logger.warning(u"component has no [###/English Label] translation, file_path: %s", file_path)
                    continue
                elif line.startswith("* 中文："):
                    func_desc_obj = re.search(r"\* *中文：(.*)", line)
                    func_desc_en_obj = re.search(r"\* *English *：*(.*)", content[index + 1])
                    if func_desc_obj and func_desc_en_obj:
                        func_desc = func_desc_obj.group(1).strip()
                        func_desc_en = func_desc_en_obj.group(1).strip()
                        self.add_translation_info(func_desc, func_desc_en)
                    else:
                        logger.warning(u"component has no 中文/英文 translation, file_path: %s", file_path)
                    continue
                elif not line.startswith("|"):
                    continue
                line = line.split("|")
                line = [x.strip() for x in line if x.strip()]
                if len(line) >= 6:
                    self.add_translation_info(line[4], line[5])

    def parse_bkpaas_translation_info(self):
        ignore_files = [
            "README.md",
        ]
        file_list = self.get_doc_file_list(os.path.join(self.original_api_doc_path, "paas"), ignore_files=ignore_files)
        for file_path in file_list:
            content = read_file(file_path)

            func_name_obj = re.search(r"# +(.*)", content)
            func_name_en_obj = re.search(r"\* English Label: *(.*)", content)
            if func_name_obj and func_name_en_obj:
                func_name = func_name_obj.group(1).strip()
                func_name_en = func_name_en_obj.group(1).strip()
                self.add_translation_info(func_name, func_name_en)
            else:
                logger.warning(u"component has no [#/English Label] translation, file_path: %s", file_path)

            func_desc_obj = re.search("- +中文：(.*)", content)
            func_desc_en_obj = re.search("- +英文：(.*)", content)
            if func_desc_obj and func_desc_en_obj:
                func_desc = func_desc_obj.group(1).strip()
                func_desc_en = func_desc_en_obj.group(1).strip()
                self.add_translation_info(func_desc, func_desc_en)
            else:
                logger.warning(u"component has no 中文/英文 translation, file_path: %s", file_path)

            content = content.splitlines()
            for index, line in enumerate(content):
                line = line.strip()
                if not line.startswith("|"):
                    continue
                line = line.split("|")
                line = [x.strip() for x in line if x.strip()]
                if len(line) >= 5:
                    self.add_translation_info(line[3], line[4])
                elif len(line) >= 4:
                    self.add_translation_info(line[2], line[3])

    def add_translation_info(self, msg, msg_en):
        if msg in self.translation_info and self.translation_info[msg] != msg_en:
            logger.warning("msgid has diff translation, msgid: %s", msg)
            return
        self.translation_info[msg] = msg_en

    def get_doc_file_list(self, path, ignore_files=[], include_files=[]):
        """
        :Note: if include_files is not empty, filename should in it
        """
        file_list = []
        for current_folder, folders, files in os.walk(path):
            for filename in files:
                if (
                    not filename.endswith(".md")
                    or filename in ignore_files
                    or (include_files and filename not in include_files)
                ):
                    continue
                file_list.append(os.path.join(current_folder, filename))
        return sorted(file_list)


def writelines_file(content, path):
    content = "\n".join(content)
    content = "%s\n" % content
    with open(path, "w") as fp:
        fp.write(content)
