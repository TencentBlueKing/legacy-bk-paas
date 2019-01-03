/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function(){
  // 编辑
  $('#user_env_table').on('click','.env_edit_btn',function(){
    var curRecord = $(this).closest('.env_record');
    curRecord.addClass('env_edit_status');
    curRecord.find('input').removeAttr('disabled');
    curRecord.find('select').removeAttr('disabled');
    var envName = curRecord.find('.env_name').val();
    var envVal = curRecord.find('.env_val').val();
    var envMode = curRecord.find('.env_mode').val();
    var envIntro = curRecord.find('.env_intro').val();
    //保存旧值
    curRecord.attr('data-old-name',envName);
    curRecord.attr('data-old-val',envVal);
    curRecord.attr('data-old-intro',envIntro);
    curRecord.attr('data-old-mode',envMode);
    return false;
  });

  // 取消编辑
  $('#user_env_table').on('click','.env_cancel_btn',function(){
    var curRecord = $(this).closest('.env_record');
    curRecord.removeClass('env_edit_status');

    curRecord.find('input').attr('disabled','disabled');
    curRecord.find('select').attr('disabled','disabled');

    //显示旧值
    var oldName = curRecord.attr('data-old-name');
    var oldVal = curRecord.attr('data-old-val');
    var oldIntro = curRecord.attr('data-old-intro');
    var oldMode = curRecord.attr('data-old-mode');

    if (oldName || oldVal || oldIntro || oldMode){
      var envName = curRecord.find('.env_name').val(oldName);
      var envVal = curRecord.find('.env_val').val(oldVal);
      var envIntro = curRecord.find('.env_intro').val(oldIntro);
      var envMode = curRecord.find('.env_mode').val(oldMode);
    }else{
      curRecord.remove();
    }

    return false;
  });

  // 保存
  $('#user_env_table').on('click','.env_save_btn',function(){

    var btn_obj = $(this);
    var curRecord = $(this).closest('.env_record');
    var envIntro = curRecord.find('.env_intro').val();
    var envName = curRecord.find('.env_name').val();
    var envVal = curRecord.find('.env_val').val();
    var envMode = curRecord.find('.env_mode').val();
    var recordId = curRecord.find('.env_id').val();

    if (!envName){
      art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: '请输入变量名'}).time(1);
      curRecord.find('.env_name').focus();
      return false;
    }
    if (!envVal){
      art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: '请输入变量值'}).time(1);
      curRecord.find('.env_val').focus();
      return false;
    }
    if (!envIntro){
      art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: '请输入说明'}).time(1);
      curRecord.find('.env_intro').focus();
      return false;
    }

    var request_data = {
      name: envName,
      value: envVal,
      intro: envIntro,
      mode: envMode,
    }

    var app_code = $("#app_code").val()
    var url = site_url + 'app/' + app_code + '/env/';
    type = "POST";
    if (recordId) {
      request_data["id"] = recordId
      type = "PUT"
      url = url + recordId + "/";
    }
    console.log("it the type:" + type)
    console.log(request_data )
    // 有记录id则进行修改
    var request = $.ajax({
      url: url,
      type: type,
      data: request_data,
      // contentType: 'application/json',
      success: function(data) {
          if (data.result){
            art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: '保存成功'}).time(1);
            curRecord.find('input').attr('disabled','disabled');
            curRecord.find('select').attr('disabled','disabled');
            curRecord.removeClass('env_edit_status');

            curRecord.find('.env_id').val(data.id);
          }else{
            art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message}).time(1);
          }
      },
      fail: function(request,msg,error) {
          art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: "保存失败!"}).time(1);
      }
    })

    return false;
  });

  // 添加变量 - 按钮
  $('.env_add_btn').on('click',function(){
    var mode_choices_html = $("#mode_choices_html").html();

    var tpl = [
      '<tr class="env_record env_edit_status">',
      '<input  type="hidden" class="env_id" disabled value="" />',
      '    <td>',
      '       <div class="env_key_box">',
      '           <input class="form-control env_name" value="" placeholder="请输入变量名"/>',
      '           <span class="env_prefix">BKAPP_</span>',
      '        </div>',
      '    </td>',
      '    <td>',
      '        <input class="form-control env_val" value="" placeholder="请输入变量值">',
      '    </td>',
      '    <td>',
      mode_choices_html,
      '    </td>',
      '    <td>',
      '       <input class="form-control env_intro" value="" placeholder="请输入说明">' ,
      '    </td>',
      '    <td>',
      '    <button type="button" class="btn-info btn-xs env_save_btn">保存</button>',
      '       <button type="button" class="btn-xs env_cancel_btn">取消</button> ',
      '  <a href="#" title="编辑" class="dev_env_opera env_edit_btn"><span aria-hidden="true" class="glyphicon glyphicon-edit"></span></a>',
      '  <a href="#" title="删除" class="dev_env_opera env_del_btn"><span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span></a>',
      '    </td>',
      '</tr>'
    ].join('');
    $('#no_record_row').hide();
    $('#user_env_table').append($(tpl));

    return false;
  });

  // 删除变量
  $('#user_env_table').on('click','.env_del_btn',function(){
    var curRecord = $(this).closest('.env_record');
    var recordId = curRecord.find('.env_id').val();
    console.log(recordId);
    if (recordId){

      var app_code = $("#app_code").val()
      var url = site_url + 'app/' + app_code + '/env/' + recordId + '/';

      art.dialog({
        title: "删除确认",
        width: 340,
        icon: 'question',
        lock: true,
        content: "<div class='t_s14'>"+"您确定删除该环境变量吗?"+"</div>",
        ok: function(){
          art.dialog({id: 'bktips', width: 300,icon: 'warning',lock: true,content: "正在进行删除操作，请稍后..."})

          $.ajax({
            url: url,
            type: "DELETE",
            success: function(data){
              art.dialog({id: 'bktips'}).close();
              if(data.result){
                art.dialog({id: 'bktips', width: 300,icon: 'succeed',lock: true,content: data.message}).time(1);
                curRecord.remove();
              }else{
                art.dialog({id: 'bktips', width: 300,icon: 'error',lock: true,content: data.message}).time(1);
              }
            }
          })

        },
        cancel: function(){},
        okVal: "确定",
        cancelVal: "取消"
      });

    }

  });

});
