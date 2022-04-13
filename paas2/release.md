Release Log
===============================
# 2.12.49
    - add: login support encrypt password

# 2.12.48
    - update: esb add invalid usernames for cmsi
    - update: esb add cache for db query
    - update: esb support disable mysql pool

# 2.12.47
    - update: esb update usermanage apis, for bk_login

# 2.12.46
    - update: esb add with_jwt_header=True for usermanage

# 2.12.45
    - update: esb update jobv3, sops, monitor_v3, usermanage, bk_login apidocs
    - update: esb cc add header Content-Type to backend

# 2.12.44
    - update: esb update cc, sops, bk-log, job, bkmonitor-v3, bk-docs-center apidocs

# 2.12.43
    - update: esb update cmsi, usermanage apidocs, update monitor_v3 apis

# 2.12.42
    - update: fix console page display

# 2.12.41
    - update: esb update cc confapis; esb update cmsi apidocs
    - update: esb update title/footer

# 2.12.40
    - bugfix: fix esb export api docs command

# 2.12.39
    - update: esb update channel is_hidden, add export_official_api_docs command, update api docs

# 2.12.38
    - update: esb update data confapis, jobv3/monitor_v3 apidocs

# 2.12.37
    - update: esb update  usermanage/sops/monitor_v3/jobv3/itsm/iam/gsekit/bscp confapis and apidocs

# 2.12.36
    - bugfix: console app logo get fail while is_display=false

# 2.12.35
    - update: esb update monitor_v3 confapis
    - bug: esb fix bk_login get_batch_users

# 2.12.33
    - bug: esb fix iam_delete_component

# 2.12.32
    - update: esb update data/iam confapis

# 2.12.31
    - update: esb update data confapis

# 2.12.30
    - update: esb update monitor_v3, nodeman confapis

# 2.12.29
    - update: esb update data confapis

# 2.12.28
    - update: esb update data v3_storekit confapis
    - update: esb jobv3 add api generate_local_file_upload_url
    - update: esb cc search_business add parameter biz_property_filter

# 2.12.27
    - update: esb update data/jobv3/sops confapis
    - update: esb add data module RESOURCECENTERAPI

# 2.12.26
    - update: esb update monitor_v3/jobv3/itsm/iam/cc confapis

# 2.12.25
    - update: esb udpate cc confapis to cc 3.9

# 2.12.24
    - update: esb update bk_log/bk_nodeman confapis

# 2.12.23
    - update: esb update jobv3/bk_log confapis
    - update: esb cc transfer_host_to_resourcemodule add parameter bk_module_id

# 2.12.22
    - bugfix: fix esb fs_list_users xss
    - update: esb add staff_status field for fs_list_users

# 2.12.21
    - bugfix: bkdialog js/css missing while do bind weixin

# 2.12.20
    - esb: support bk-api-authorization

# 2.12.19
    - esb: update esb cc confapis

# 2.12.18
    - esb: add get_weixin_config
    - paas: use get_weixin_config to fetch weixin config 

# 2.12.17
    - esb: update esb cc confapis
    - esb: esb management display component frequency configuration

# 2.12.16
    - esb: update esb bk_log apis

# 2.12.15
    - esb: update configuration components BKDATA

# 2.12.14
    - paas: rename env MENU_ITEM_BUFFET_HIDDEN to BK_ESB_MENU_ITEM_BUFFET_HIDDEN

# 2.12.13
    - add: Compatible with PaaS3.0
    - change: the max_length of the app logo field is changed to 500

# 2.12.12
    - esb: Compatible with PaaS3.0
    - esb: update configuration components CC, JOBV3, BKDATA, NODEMAN
    - esb: BKDATA add anew module:aiops
    - esb: supports returning SOPS's own error code

# 2.12.11
    - bugfix: paas app_log missing page div while pagination

# 2.12.10
    - esb: update cc/usermanage/bscp/bk_log apis
    - esb: add bk_apigateway/bk_paas3 to user-auth-unrequired wlist

# 2.12.9
    - bugfix: fix home page js 404

# 2.12.8
    - change: move to Github

# 2.12.7
    - add: EXTERNAL_THEME in console's settings for custom css

# 2.12.6
    - remove: artDialog / font-awesome, and update jquery references

# 2.12.5
    - add: support paas3

# 2.12.4
    - fix: renders the esb templates title according to the current edition

# 2.12.3
    - remove: support-files/pkgs useless files

# 2.12.2
    - update: esb support nation_code for send_sms/send_voice_msg

# 2.12.1
    - add bk_paas3 into iam valid clients for system bk_paas

# 2.12.0
    - merge ft_support_ce into enterprise, both ee/ce support in the same branch

# ce 2.11.71
    - feat: v1/agent/init api support active same agent ip with different port

# ce 2.11.70
    - feat: ignore inactive agent server when offline app
    - feat: v1/agent/init api support registering same agent ip with different port

# ce 2.11.69
    - bugfix: ignore tpapp in iam apply permission

# ce 2.11.68
    - bugfix: error page missing css/png

# ce 2.11.67
    - update: python framework version to newest in guide
    - add: esb add jobv3 apis
    - update: esb send_sms api support qcloud_sms_sign

# ce 2.11.66
    - update: repack

# ce 2.11.65
    - bugfix: esb sent mail attachment file name is compatible with unicode encoding

# ce 2.11.64
    - update: quick start doc

# ce 2.11.63
    - bugfix: esb sent mail attachment file name is garbled

# ce 2.11.62
    - bugfix: svn deploy fail

# ce 2.11.61
    - update: quick start docs
    - update: login plain css

# ce 2.11.60
    - remove: show more in ce home console page
    - update: ce home console page

# ce 2.11.59
    - update: ce home console page
    - update: ce quick start doc

# ce 2.11.58
    - update: change ce home console page

# ce 2.11.57
    - update: add user profile page

# ce 2.11.56
    - update: esb update data/monitor/sops confapis; hidden data/monitor apis

# ce 2.11.55
    - bugfix: change some links on ce home page

# ce 2.11.54
    - bugfix: remove i18n trans from login

# ce 2.11.53
    - bugfix: fix get app list error when app is only link

# ce 2.11.52
    - update: esb update cc apis; update cc search_module dest_path

# ce 2.11.51
    - fix: esb add uwsgi to requirements.txt

# ce 2.11.49
    - update: modify login logo v5 to v6

# ce 2.11.48
    - bugfix: fix download resource 404 in guide/newbe

# ce 2.11.47
    - bugfix: user has no permission to bind/unbind wx

# ce 2.11.46
    - update: merge enterprise into ft_support_ce

# ee 2.11.69
    - add: EXTERNAL_THEME in settings for custom css

# ee 2.11.68
    - update: esb update nodeman/jobv3 conf-apis

# ee 2.11.67
    - bugfix: the env priority of the user if higher than app.yml

# ee 2.11.66
    - update: esb add jobv3 callback_protocol apidocs

# ee 2.11.65
    - update: esb delete cc search_host, update cc apis
    - update: esb add jobv3 callback_protocol

# ee 2.11.64
    - fix: change app_code of console from bk_console to bk_paas

# ee 2.11.63
    - fix: fix esb status timeline error

# ee 2.11.62
    - update: esb update gse apis; esb add bscp to api-doc index

# ee 2.11.61
    - update: esb add bscp; esb add header for gsekit

# ee 2.11.60
    - update: esb add gsekit apis; esb update itsm/cc apis

# ee 2.11.59
    - bugfix: update paas_app_visiable.js

# ee 2.11.58
    - update: esb add jobv3 apis; esb send_sms support qcloud_sms_sign

# ee 2.11.57
    - bugfix: esb sent mail attachment file name is compatible with unicode encoding

# ee 2.11.56
    - bugfix: esb sent mail attachment file name is garbled

# ee 2.11.55
    - bugfix: svn deploy fail

# ee 2.11.54
    - update: esb update itsm/bkmonitor_v3 confapis

# ee 2.11.53
    - update: app env support chinese character

# ee 2.11.52
    - update: esb udpate data/sops/monitor confapis; hidden data/monitor apis

# ee 2.11.51
    - update: esb update cc/job/sops confapis

# ee 2.11.50
    - add: bk_iam search_instance support

# ee 2.11.49
    - update: esb update cc confapis; update cc search_module dest_path

# ee 2.11.48
    - update: esb update itsm confapis; add template var DATAV3_DATALABAPI_HOST for data
    - add: apigw add apigw-bkrepo.yaml

# ee 2.11.47
    - update: app visiable labels

# ee 2.11.46
    - update: support-files/templates

# 2.11.45
    - bugfix: user_center template missing
    - change: move default download resource into /download from /media

# 2.11.44
    - bugfix: /console/ page exclude permission check
    - add: docs link for paas
    - add: paas doc link in console
    - update: esb update data confapis, add gse config module
    - update: esb execute sync_data_at_deploy directly in on_migrate

# 2.11.43
    - bugfix: appengine conf template wrong
    - bugfix: developer center header meta wrong
    - bugfix: fix esb manager status.index error
    - update: esb update cc/iam confapis

# 2.11.42
    - bugfix: missing BK_USERMGR_HOST in paas/conf/settings_production
    - update: bk_iam to 1.0.9, remove dependency `six<1.15.0`

# 2.11.41
    - bugfix: support-files/templates esb conf settings_production
    - update: update the support-files/templates to newest

# 2.11.40
    - update: esb update cc confapis
    - update: update tpls

# 2.11.39
    - update: console license expire ahead notice days configurable

# 2.11.38
    - update: esb update data confapis

# 2.11.37
    - add: support upload and deploy saas from backend

# 2.11.36
    - update: esb add module v3_datalab/v3_queryengine for data
    - update: esb udpate nodeman confapis

# 2.11.35
    - update: format all codes with black

# 2.11.34
    - upgrade: bk-iam from 1.0.4 to 1.0.8

# 2.11.33
    - bugfix: fix console healthz fail

# 2.11.32
    - bugfix: fix healthz fail

# 2.11.31
    - bugfix: iam fetch_instance return display_name

# 2.11.30
    - remove: developers from app info page
    - upgrade: iam to 1.0.4

# 2.11.29

    - bugfix: fix esb sops apidocs display
    - update: esb update iam confapis

# 2.11.28
    - bugfix: fix some html/css/js bugs, part 2

# 2.11.27
    - bugfix: fix some html/css/js bugs

# 2.11.26
    - add: /metrics for paas/login/console

# 2.11.25
    - add: iam app creator permission apply auto

# 2.11.24
    - update: esb update cc/iam confapis, cc delete_cloud_area use POST method
    - update: apigw update apigw-bcs-app.yaml

# 2.11.23
    - bugfix: esb update iam confapis

# 2.11.22
    - bugfix: app migration conflict

# 2.11.21
    - update: apigw update bcs-app/bcs_cc/paas-cd yaml

# 2.11.20
    - update: esb update cc confapis

# 2.11.19
    - update: esb fix jobv3 component

# 2.11.18
    - update: esb support jobv3 apis

# 2.11.17
    - update: esb support restful apis
    - update: esb update ITSM/MONITOR/LOG_SEARCH system name
    - update: esb update data/nodeman/iam confapis

# 2.11.16
    - remove: iam_resource_owner from app

# 2.11.15
    - bugfix: /login/metadata/website template wrong

# 2.11.14
    - add: /login/metadata/website

# 2.11.13
    - update: esb use ssm api to verify access-token

# 2.11.12
    - bugfix: iam generate apply url fail

# 2.11.11
    - update: esb status support es7

# 2.11.10
    - add: app log search support es7

# 2.11.9
    - add: app deploy env support bk_iam_v3 vars

# 2.11.8
    - update: iam model json

# 2.11.7
    - update bk_iam whl to 0.0.5
# 2.11.5
    - merge enterprise changes

# 2.11.3
    - fix: iam permission wrong

# 2.11.2
    - fix: iam callback fail

# 2.11.1
    - add: support iam v3

# 2.10.51
    - update: esb update data confapis; support jwt for data

# 2.10.50
    - update: esb support restful apis
    - update: esb update ITSM/MONITOR/LOG_SEARCH system name
    - update: esb update data/nodeman confapis

# 2.10.48
    - update: esb update bk_log apis

# 2.10.47
    - update: esb update cc/monitor_v3 apis

# 2.10.46
    - update: esb send_voice_msg receiver keep in order
    - update: esb update nodeman/cc apis

# 2.10.45
    -update: esb update cc apis
    -fix: fix esb fs_list_users jsonp

# 2.10.44
    -update: esb update data apis

# 2.10.43
    - update: esb add usermanage fs_list_users

# 2.10.42
    - update: esb support data algorithm module
    - update: esb fix cc apis

# 2.10.41
    - update: esb support data datacube module
    - update: esb update cc apis

# 2.10.40
    - update: support git branch/tag deploy

# 2.10.39
    - update: esb update sops/usermanage apis

# 2.10.38
    - bugfix: smart admin deploy info permission

# 2.10.37
    - update: esb update nodeman/usermange apis

# 2.10.36
    - update: esb fix nodeman.yaml

# 2.10.35
    - update: esb udpate cc/nodeman apis
    - update: esb use model to access paas-app to get app-secret
    - update: esb update cmsi icons

# 2.10.34
    - update: update esb cc apis

# 2.10.33
    - bugfix: paas log search diy time parse fail

# 2.10.32
    - update: esb add jwt to nodeman
    - update: esb update monitor_v3 apis

# 2.10.31
    - add: console profile support modify qq

# 2.10.30
    - fix: esb fix cc search_biz_inst_topo request method

# 2.10.29
    - add: esb add iam/bk_docs_center apis
    - update: esb update cc/data apis

# 2.10.28
    - add: paas v2 api get_app_info support blueking-language=en

# 2.10.27
    - update: update esb system/doc_category handle
    - bugfix: esb fix sync_channel error when system not exist

# 2.10.26
    - bugfix: get_user from usermgr wx_userid/chname empty

# 2.10.25
    - add: apigw add paas-cd.yaml
    - add: esb add system bk_log apis
    - update: esb update itsm/nodeman/job apis

# 2.10.24
    - update: esb update cc apidocs
    - update: update apigw bcs_api.yaml

# 2.10.23
    - update: add job operate_process apiperm for bk_monitorv3

# 2.10.22
    - add: esb add monitor_v3

# 2.10.21
    - bugfix: app name_en in list

# 2.10.20
    - update: esb add cache for getting secrets

# 2.10.19
    - update: connect consul by localhost

# 2.10.18
    - update: change login form

# 2.10.17
    - update: console open iam/usermgr default max
    - update: paas change env BK_IAM_HOST to BK_IAM_INNER_HOST

# 2.10.16
    - update: add cache for login

# 2.10.15
    - update: login css/js

# 2.10.14
    - update: esb set some system response_encoding to utf-8

# 2.10.13
    - update: esb update cc confapis
    - add: apigw add apigw-bcs-app.yaml

# 2.10.12
    - add: login multiple domain support

# 2.10.11
    - add: login support oauth2

# 2.10.10
    - add: login support oauth2

# 2.10.9
    - update: esb update data confapis

# 2.10.8
    - bugfix: console open bk_iam_app fail

# 2.10.6
    - update: esb update cc/itsm/data confapis

# 2.10.5
    - merged ee_2.10

# 2.9.46
    - fix bug: only_plain_xframe_options_exempt when post with wrong password
    - cherrypick: add login dialog /plain/
    - update: esb 针对 JOB/GSE，去除对GSE复合业务ID的处理，GSE复合业务ID当做云区域ID
    - update esb itsm/cc confapis

# 2.9.45
    - add: support login dialog /plain/, bugfix

# 2.9.44
    - add: support login dialog /plain/

# 2.9.43
    - update: esb update cc/monitor confapis

# 2.9.42
    - bugfix: console window title name en

# 2.9.41
    - update: esb update data confapis; esb set cc search_host is_deprecated

# 2.9.40
    - bugfix: iam/usermgr logo error in console
# 2.9.39
    - bugfix: fix i18n

# 2.9.38
    - bugfix: 修正smart/app相同页面打开权限申请问题

# 2.9.37
    - update: esb guide [use-components] use cc search_business as example

# 2.9.36
    - update: esb update cc/esb apis

# 2.9.35
    - update: esb update usermanage confapis

# 2.9.34
    - update: bk_iam / bk_usermgr as dock app on console

# 2.9.33
    - fix: esb log_search fix confapi yaml
    - update: esb itsm update confapi docs

# 2.9.31
    - add: esb add job get_public_script_list api
    - add: esb update cc/itsm/log_search/data confapis

# 2.9.30
    - bugfix: remove debug code of app_visiable

# 2.9.29
    - update: esb add itsm/log_search confapis

# 2.9.28
    - update: esb remove cc v2 apis

# 2.9.27
    - update: app/saas visiable labels query logical
# 2.9.26
    - add: app/saas visiable labels

# 2.9.25
    - update: esb update usermanage confapis

# 2.9.24
    - add: esb add usermanage 4 new jsonp apis

# 2.9.23
    - merge ee_2.5 into branch enterprise

# 2.9.22
    - update: esb add DATAV3_BKSQL_HOST to template
    - update: esb update sops apidocs

# 2.9.21
    - update: esb update data/nodeman confapis

# 2.9.20
    - add: esb support jwt for sops
    - add: esb add api get_api_public_key
    - update: esb use ConcurrentLogHandler as log handler
    - fix: fix display problems when esb documents are zoomed

# 2.9.19
    - add: esb api batch apply

# 2.9.18
    - add audit log for app/smart create/delete
    - fix bug: login cookie language code

# 2.9.17
    - add: default saas logos

# 2.9.16
    - fix: unbind wx_userid

# 2.9.15
    - update: change wx_id to wx_userid
    - update: esb cc confapis

# 2.9.14
    - fix bug: bind wx

# 2.9.13
    - esb: update gse apidocs

# 2.9.12
    - paas: fix bug fetch data from iam

# 2.9.11
    - esb: sync enterprise esb
    - esb: update confapis for data/sops/usermanage

# 2.9.10
    - paas: fix bug get app_info with developers

# 2.9.9
    - console: get app developers from iam
    - console: remove statistics by developer

# 2.9.8
    - fix i18n

# 2.9.7
    - deploy result 500 html escape
    - add app.yml name_en/introduction_en support

# 2.9.6
    - remove: secure cookie for https

# 2.9.5
    - add: add secure for cookie: bk_token & session
    - add: autocomplete="off" for password

# 2.9.4
    - add: login bk_token will be expired if the user is inactive for 2 hours

# 2.9.3
    - delete: get_all_user/get_batch_user api [breaking change]

# 2.9.2
    - update: iam apply url update

# 2.9.1
    - add: login support username/phone/email

# 2.9.0
    - update: login to usermgr, with custom_login

# 2.8.43
    - fix: bk data translation

# 2.8.42
    - update: app translation
    - fix: esb send_mail fail, convert smtp_pwd to str

# 2.8.41
    - update: esb use apidocs to manage all bk_paas/bk_login/cc/job apidocs

# 2.8.40
    - fix: paas/esb fix some translation; fix saas: data description translation

# 2.8.39
    - add: esb add cc find_instance_association and other 3 apis, job get_step_instance_status api
    - update: apigw update apigw-bcs_api.yaml

# 2.8.38
    - add: login bk_token will be expired if the user is inactive for 2 hours

# 2.8.37
    - update: login /get_all_user refactor

# 2.8.36
    - update: esb update data/sops confapis

# 2.8.35
    - update: esb transfer Blueking-Timezone to backend api
    - update: esb udpate esb get_systems/get_components label

# 2.8.34
    - update: refactor login

# 2.8.32
    - add: app_token for tpapp

# 2.8.31
    - bugfix: iam apply page img load fail

# 2.8.30
    - update: iam init json files

# 2.8.29
    - add: iam init json files

# 2.8.28
    - console: update change_password url
    - login: update login index page, display usermgr error message, add forget password

# 2.8.27
    - console: fix reset user password url

# 2.8.26
    - console: profile change to usermanager

# 2.8.25
    - update: esb bklogin apis change get_all_users/get_batch_users backend to usermanage
    - update: esb update usermanage confapis

# 2.8.24
    - update: login api change backend to usermanager

# 2.8.23
    - update: esb support return permission

# 2.8.22
    - update: login/paas/console support iam

# 2.8.21
    - add: console open application support new tab and desktop
    - change: console change bk_cc to bk_cmdb

# 2.8.20
    - add: esb add api send_msg/get_msg_type, get_systems/get_components v2

# 2.8.18
    - bugfix: update download resource python's doc url

# 2.8.16
    - bugfix: appengine /apps/init url mismatch

# 2.8.15
    - feature: support init app framework for app and download app project code

# 2.8.14
    - update: esb update data/usermanage confapis

# 2.8.12
    - update: esb update data yaml

# 2.8.11
    - bugfix: add ruamel and some other packages to pkgs, for apigw

# 2.8.10
    - bugfix: add python-consul into pkgs, for appengine
    - update: python newbie guide docs

# 2.8.9
    - update: esb update data yaml

# 2.8.8
    - update: esb update data yaml

# 2.8.7
    - update: esb update cc/monitor apidocs
    - update: esb update doc weixin_component_guide.md

# 2.8.6
   - update: change get_app_poll_task api return

# 2.8.5
   - update: esb fix fta imap bug
   - update: esb update monitor/data confapis
   - update: apigw udpate apigw-bcs_cc.yaml

# 2.8.4
    - update: add apigw to projects.yaml

# 2.8.3
    - bugfix: fix upstream conflicts between app test and prod environment

# 2.8.2
    - bugfix: deploy pkgs
    - update: engine delete / smart select deply servers

# 2.8.1
    - upgrade: framework to newest
    - fix on_migration

# 2.8.0
    - add: support choose target servers while deploying app to production env

# 2.7.20
    - update: esb udpate job/sops confapis
    - update: esb cmsi send_voice_msg support tencentcloud api

# 2.7.19
    - update: update monitor/sops/data confapis
    - update: update job apidocs

# 2.7.18
    - add: projects.yml
    - remove useless files

# 2.7.17
    - update: upgrade bk-icon-1.1 to bk-icon-2.0 for paas/esb
    - add: add usermanage apis to esb

# 2.7.16
    - update: fix a lot of issues, most are front-end change

# 2.7.15
    - add: app.yml support env setction for app_env_var

# 2.7.14
    - bugfix: esb data meta yaml config error

# 2.7.13
    - add: esb add data v3 apis
    - update: esb update cc/sops confapis config

# 2.7.12
    - update: esb update cc confapis
    - bugfix: ceph check is applied fail

# 2.7.11
    - update: settings.HTTP_SCHEMA support

# 2.7.10
    - update: py3 framework

# 2.7.9
    - update: gunicorn to 19.9.0
    - add: python3 framework newbie

# 2.7.8
    - update: esb support parameter bk_supplier_account for gse
    - update: update monitor apis

# 2.7.7
    - update: esb support monitor apis resposne status_code is not 200
    - update: esb support get apidoc from markdown file for bkapis
    - update: esb add job import_job api, update some cc/job/approval apidocs

# 2.7.6
    - add: python3 framework for resource download

# 2.7.5
    - update: add tag as extra field for api/v2/app_info

# 2.7.4
    - bugfix: ceph rgw apply


# 2.7.3
    - update: ESB 更新 sops 组件文档
    - update: ESB 更新 CC 组件处理逻辑，支持 code/message 响应内容

# 2.7.2
    - update: ESB 更新 cc.yaml，添加一个组件
    - update: ESB CMSI/send_mail 组件支持附件 attachments

# 2.7.1
    - add: ESB 添加 approval 系统 3 个API

# 2.7.0
    - add: esb sdk in framework support py3, esb sdk add 1 cc apis, some sops apis
    - fix: esb v1 bk_login/get_user support bk_username
    - update: esb cmsi/send_weixin support WeChat app account
    - add: paas support ceph
    - update: login remove role manager entry

# 2.6.35
    - add: esb add cc api get_mainline_object_topo

# 2.6.34
    - bugfix: esb some channel edit error
    - update: esb udpate some cc apis translation

# 2.6.33
    - add: esb add nodeman api, update sops yaml, add X-Bkapi-Request-Id to headers

# 2.6.32
    - update: esb support HTTP method PUT/PATCH/DELETE for confapis

# 2.6.31
    - update: esb remove copyright

# 2.6.30
    - update: esb add param task_name for job fast_execute_script

# 2.6.29
    - update: esb update monitor/nodeman yaml and apidocs

# 2.6.28
    - update: fix app name translation
# 2.6.27
    - bugfix: BlueKing Desktop cc/job name show wrong
# 2.6.25
    - add: esb add sops some apis by sops.yaml, job add get_job_instance_global_var_value api

# 2.6.24
    - update: esb cc/cc v2 apis use self.host to access cc api

# 2.6.23
    - add: esb add cc host lock apis

# 2.6.22
    - add: esb add job get_os_account, get_script_list, get_script_detail api
    - update: update paas/media/framework.tar.gz

# 2.6.21
    - add: esb add monitor apidocs
    - bugfix: data api, same path different method api route logic fix

# 2.6.20
    - bugfix: update esb api url for developer
    - update: esb change verifiction logic for cmdb superadmin

# 2.6.19
    - update: support verify app can use superadmin for cc

# 2.6.18
    - update: login v2 api return, add "result" field

# 2.6.17
    - remove: some fields in admin page, for security reason

# 2.6.15
    - add: add monitor apis

# 2.6.14
    - update: esb add bk_supplier_account in headers for cc apis

# 2.6.13
    - add: esb add nodeman apis

# 2.6.9:
    - add: 桌面应用窗口提供返回上一页\刷新当前页面\复制当前页面链接等功能

# 2.6.7:
    - add: git仓库初始化添加连接超时设置、
    - remove: 移出微信企业号相关设置

# 2.6.6:
    - bugfix: update esb cc.yaml, fix clone_host_property dest path

# 2.6.5:
    - bugfix: HOST_CC/HOST_JOB support https port
# 2.6.4:
    - add: 统一角色管理支持删除
    - 初始化开发框架适配更新java开发框架
    - 支持用户自行选择是否初始化开发框架的代码
    - git密码支持特殊字符、git、svn用户名和密码存储时不进行转义，显示时再转义

# 2.6.3:
    - add: change wallpaper

# 2.6.2:
    - update: merge enterprise

# 2.6.1:
    - fix: https port

# 2.6.0:
    - update: https support

# 2.5.40
    - update: gse.yaml dest_path remove namespace

# 2.5.39
    - update: esb update add_new_component doc

# 2.5.38
    - update: esb update gse_component request protocol

# 2.5.37
    - bugfix: esb some error format should use format_prompt function

# 2.5.36
    - update: update esb gse.yaml

# 2.5.35:
    - update framework.tar.gz to add bk_api_ver desc for sdk
    - add get_operation_log to cc.py in sdk

# 2.5.34:
    - update: esb udpate data.yaml

# 2.5.33:
    - bugfix: app env page name strip wrong

# 2.5.32:
    - add: esb add gse confapis
    - update: esb support system-dev.yaml confapis

# 2.5.31:
    - update: esb udpate data.yaml
>>>>>>> enterprise

# 2.5.30:
    - update: esb update error msg when interface is not json format

# 2.5.29:
    - esb set response encoding to utf-8 for cc v2

# 2.5.28:
    - fix: cc yaml config one api path fix
    - update: cc yaml add get_operate_log api

# 2.5.27:
    - fix: cc api not support bk_supplier_account in path
    - update: update cc apidocs

# 2.5.26:
    - update: esb add app_code in headers to sops

# 2.5.25
    - update: update esb data.yaml

# 2.5.24
    - update: update esb data api host

# 2.5.23
    - update: update sdk in framework to add some apis
    - update: update esb cc add_host_to_resource doc

# 2.5.21
    - bugfix: login xss

# 2.5.20
    - add: esb add job operate_process api

# 2.5.19
    -add: esb add cc apidocs

# 2.5.17
    - add: weixin h5 and weixin mini program framework

# 2.5.15
    - bugfix: sops create_task param error fix

# 2.5.14
    - add: esb add sops query_task_count

# 2.5.13
    - update: db migrate normalization

# 2.5.12
    - add: api development template

# 2.5.11
    - update: esb cc v2 search_host: add param bk_biz_id

# 2.5.9
    - add: esb add sops apis
    - update: esb update cc get_app_agent_status api

# 2.5.8
    - add: esb support confapi for cc/data
    - add: esb add bk_monitor apis

# 2.5.6
    - update: java framework update

# 2.5.5
    - bugfix: saas upload settings is_use_celery
    - add: esb add 3 data trt api

# 2.5.1
    - add: esb add cicdkit apis

# 2.5.0
    - add: 支持java saas安装包作为s-mart应用上传部署

# 2.4.70
    - update: add version to path for esb assets

# 2.4.69
    - add: esb add 1 data modelflow api
    - add: esb add 1 job api

# 2.4.67
    - bugfix: login/paas xss security
    - update: desktop console remove flash

# 2.4.65
    - add: esb add 1 data dataflow api
    - add: esb add 2 cc apis
    - bugfix: fix cc search_xxx doc

# 2.4.63
    - add: esb add 1 data dataflow api
    - bugfix: esb apiMethod desc fix in hcp.tar.gz

# 2.4.62
    - add: esb add 4 data modelflow apis
    - add: esb add 1 data dataflow api
    - update: esb update paas/login api translation
    - update: set open_paas_framework default_bk_api_ver to v2

# 2.4.61
    - update: esb cc add_host_to_resource add param bk_biz_id
    - fix: esb get_proc_result apidoc fix
    - add: add some data api

# 2.4.58
    - update: change desc esb to api gateway

# 2.4.55
    - add: esb test_send_mail_with_smtp script
    - update: esb smtp support tls config
    - update: esb add Bk-Username to header for buffet components
    - update: framework.tar.gz update

# 2.4.54
    - bugfix: esb sync system data error

# 2.4.53
    - update: merge ee_normalization to enterprise
    - update: build_new.sh set one '-not -path' to '*components/generic*'

# 2.4.52
    - add: esb add some data apis
    - add: esb guide for custom conf manage
    - update: esb support data system request param files

# 2.4.49
    - add: esb add some data apis

# 2.4.48
    - update: license interface param update

# 2.4.47
    - bugfix: esb job one component config error

# 2.4.45
    - esb revert custom apis conf manage

# 2.4.43
    - esb api normalization

# 2.4.38

- add:
    - login customize support

# 2.4.31
- add:
    - 1. esb gse cacheapi 2 new components
    - 2. esb cc 2 new components
    - 3. esb cc v3 3 new components
- update:
    - 1. esb remove gse bk_cloud_id convertion

# 2.4.30
- bugfix:
    - fixbug login page "BlueKing Desktop" link error

# 2.4.29
- add:
    - esb add 3 new data api
    - esb add 2 new daga api

# 2.4.27
- update:
    - esb add params for a cc component

# 2.4.25
- new:
    - username support underline

# 2.4.23
- new:
    - esb add 2 new data components

# 2.4.22
- new:
    - esb add 2 new cc components

- update:
    - esb bk_login role desc in doc

# 2.4.20
- bugfix:
    - fix i18n bugs
    - fix wechat bind bugs

# 2.4.19
- bugfix:
    - fix i18n bugs

# 2.4.18
- bugfix:
    - guide weixin page error and docs display en when lang is zh-hans

# 2.4.17
- add:
    - 支持接入企业内部ladp登录

# 2.4.16
- add:
    - 新版登录页面

# 2.4.15
- add:
    - SaaS 自定义容器内存大小 - 使用gevent启动celery进程

# 2.4.14
- add:
    - 登录模块支持标准运维&作业平台的审计员角色

# 2.4.13
- bugfix:
    - fix data set host bug and add one data api

# 2.4.12
- bugfix:
    - fix i18n bugs

# 2.4.10
- bugfix:
    - fix i18n bugs

# 2.4.9
- bugfix:
    - fix most i18n bugs

# 2.4.8
- bugfix:
    - fix i18n bugs

# 2.4.6
- update:
    - change esb metis_menu dir

# 2.4.5
- update:
    - upgrade supervisor pypi pkg in support-files/pkgs

# 2.4.3
- update:
    - merge ee_i18n breanch into enterprise

# 2.4.2
- update:
    - fix i18n bugs

# 2.4.1
- update:
    - esb doc support i18n

# 2.4.0
- update:
    - support i18n

# 2.3.19
- add:
    - ESB 增加部分 data 接口

# 2.3.17
- add:
    - ESB 传递 Blueking-Language 给后端接口

# 2.3.16
- update:
    - ESB 增加部分 data 系统接口

# 2.3.15
- bugfix:
    - 移除无关信息

# 2.3.14
- bugfix:
    - 移除无关信息

# 2.3.13
- bugfix:
    - 修复微信绑定配置带80端口的paas_domain导致微信校验不通过bug

# 2.3.12
- bugfix:
    - console health error

# 2.3.11
- update:
    - update support-files

# 2.3.10
- bugfix:
    - ESB: 查询 es 去掉 .keyword 关键词
           ESB 配置模版中更新 GSE 的主机地址表示
           修复系统实时运行数据展示时，时间选择条滑到左端时，数据异常的问题

# 2.3.8
- bugfix:
    - ESB: 系统及通道超时时间，页面输入过大数据时无法保存bug修复
           send_weixin 等通道部分敏感配置，密文显示

# 2.3.7
- bugfix:
    - ESB: 修复微信组件配置使用文档显示问题
    - PaaS: 修复桌面个人中心管理员审批表格显示问题

# 2.3.5
- update:
    - ESB: JOB gse_proc_operate 更新参数

# 2.3.4
- bugfix:
    - ESB: 修复在通道管理页面，新增系统时，新增系统在系统选择器中显示错误问题
           修复在通道管理页面，连续打开新增系统系统按钮时，第二次打开，页面按钮无响应问题
           调整自助接入组件，结果中result的默认值由False为None

# 2.3.3
- bugfix:
    - PaaS: 修复用户统一角色管理显示问题

# 2.3.2
- bugfix:
    - ESB 支持当系统存在通道时，更新系统部分配置

# 2.3.1
- 新增：
    - esb 新增 CC 以下接口: add_app，del_app，edit_app，add_module，del_module，enter_ip，update_host_info，del_host_in_app

# 2.3.0

- 新增:
    - 企业版 v1.2
    - PaaS: 平台角色管理
    - PaaS: 微信用户绑定
    - ESB: 调整fta部分组件/新增部分databus api/新增data api组件/

- 优化:
    - 日志错误码统一处理
    - /healthz/ 接口统一
    - rabbitmq 支持域名/部署高可用
    - esb部署启动进程数自动适配cpu核数
    - 去除 enterprise 特例组件

- bugfix:
    - 1.1前端部分bug修正
    - ESB 通道管理中，改变所属组件系统时，对应组件代号联动错误

# 2.2.18
- 新增:
    - 添加查询应用信息api
    - 新增组件权限申请驳回后再次申请功能
- bugfix:
    - 外链应用创建URL加强校验
    - 修复开发者中心应用统计上字下图不一致问题
    - 修复桌面右键菜单重叠问题
    - 加强导入用户信息的校验
- 优化:
    - 应用市场搜索逻辑优化
    - 统计分析涉及到的时间选择汉化
    - 去除敏感信息

# 2.2.15
- 更新:
    - esb fta 组件不验证用户及应用

# 2.2.14
- 更新:
    - esb 新增fta一个组件，更新cc/gse部分组件参数或文档

# 2.2.13
- bugfix:
    - esb 针对测试缺陷的修复

# 2.2.12
- bugfix:
    - esb bk_login 需要的 bk_token 未传递

# 2.2.11
- 新增：
    - ESB 新增 send_weixin 组件
    - ESB 新增 data 系统部分组件配置

# 2.2.10
-  更新:
    - ESB自助接入组件支持 GET 请求传递列表参数

# 2.2.9
- 更新:
    - 更新Java版开发框架

# 2.2.8
- 更新：
    - ESB 自助接入组件，支持将用户传入的部分 headers 传递给后端接口

# 2.2.7
- 新增:
    - 新增 esb_costom_comps_upgrade.sh

# 2.2.6
- 新增:
    - 新增应用访问量数据统计

# 2.2.5
- 新增:
    - 部署环境变量新增 BK_CC_HOST / BK_JOB_HOST

# 2.2.4
- bugfix:
    - 桌面修复由于未有版本信息而出现500问题

# 2.2.2
- 更新：
    - 更新开发样例

# 2.2.1
- 更新：
    - ESB 更新 gse proc 组件文档

- bugfix:
    - ESB 修复 gse 获取结果中文编码问题

# 2.2.0

- 新增
    - java开发框架支持
    - 自定义环境变量
    - 证书相关功能

# 2.1.26

- 新增：
    - ESB 新增 CC ProcConfigManage 两个组件

# 2.1.25

- 新增：
    - ESB 新增 GSE 进程管理组件

# 2.1.24

- bugfix:
    - ESB data 系统调整一个组件配置

# 2.1.23

- 优化:
   - 修改 django settings 中 TIME_ZONE 设置

# 2.1.22

- 新增:
    - ESB 添加数据库连接池

# 2.1.20

- bugfix:
    - 修复企业版测试报告相关问题

# 2.1.19

- bugfix:
    - fix bug of log search for es5.4

# 2.1.18

- bugfix:
    - 修正开发框架错误页面
- 新增:
    - data相关组件

# 2.1.17

- 新增
    - 组件job接口更新

# 2.1.16

- 优化
    - 去除 s-mart 应用数据库信息展示/修改(安全考虑)

# 2.1.15

- 优化
    - 增加healthz接口
      http://${PAAS_DOMAIN}/healthz/           paas
      http://${PAAS_DOMAIN}/console/healthz/   console
      http://${PAAS_DOMAIN}/login/healthz/     login
      http://${PAAS_DOMAIN}/v1/healthz         appengine [注意不要带斜杠]


# 2.1.14

- bugfix
    - 修复saas设置桌面信息bug

# 2.1.13

- bugfix
    - s-mart内置应用设定分类更新失败

# 2.1.12

- 优化
    - 组件校验兼容两套模式

# 2.1.11

- 优化
    - 修正模板配置, 修正部分bug

# 2.1.10

- 新增
    - 用户角色/权限, 应用分类

- 优化
    - 代码重构

# 2.1.7

- 优化
    - esb优化文档展示
- 新增
    - 组件权限功能
- bugfix
    - esb适配是安装uwsgi

# 2.1.5

- 新增
    - 新增gcloud接口
    - esb: cc_api / 优化文档展现
- 优化
    - 1. 更新部署模板文件

# 2.1.4

- 新增
    - 1. s-mart市场, 更改展现及增加测试环境
    - 2. 增加开发样例内置saas

- 优化
    - 1. 按照交付规范提供安装包

# 2.0.2

- 优化
    - 1. 平台日志: 单个文件大小限制10M(esb日志100M), 自动rotate, 不删除历史日志
    - 2. 平台日志: 脚本拼装PAAS_LOGGING_DIR, 通过环境变量PAAS_LOGGING_DIR控制平台日志落地路径(script-uwsgi.ini-program)

# 2.0.1

2017-04-14

- 优化
    - 1. 文档优化, 按照交付规范改造


# 2.0.0

2017-03-13

- 新增
    - 1. 支持自定义目录安装
    - 2. 使用gevent部署ESB
    - 3. 2.0升级3.0 原有应用迁移脚本
    - 4. agent宕机重启后, 批量启动所有应用

- 优化
    - 1. ESB-增加超时设置
    - 2. ESB访问JOB时需要加证书验证, 证明ESB合法性

- bugfix

    - 1. 用户管理里面，邮箱支持点.
    - 2. 用户密码支持特殊字符，长度调整到20位
    - 3. 开发者中心服务器信息页面显示问题
    - 4. 应用列表，下架状态显示问题

# 1.0.0

2016-10-10

第一个可用版本, 包含PaaS基础包

- 新增
    - 1. 增加celery支持
    - 2. 增加内置SaaS, 支持上传部署

- 优化:
    - 1. 优化前端展现
    - 2. 变更安装脚本, 支持路径配置

- bugfix
    - 1. bug修复, 文档优化, FAQ 丰富

