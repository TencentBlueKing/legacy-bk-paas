/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
$(function(){
	// $("#app-list").sortable({
	// 	placeholder: "ui-state-highlight"
	// });

	// $( "#app-list" ).sortable({
	// 	containment: ".app-list",
	// 	stop: function () {
	// 		$("#app-list .app-list-item").removeClass("state-edit");
	// 		// $("#app-list").sortable("disable");
	// 		// 获取当前应用的排序
	// 		app_code_list = [];
	// 		$(".app-list-item").each(function(){
	// 			var app_code = $(this).attr('app_code');
	// 			app_code_list.push(app_code);
	// 		});
	// 		var url = site_url + 'console/user/app/';
	// 		$.post(url,{
	// 			'apps': JSON.stringify(app_code_list),
	// 		}, function(data){
	// 		}, 'json')
	// 		isSortable = false
	// 	}
	// });
	var appList = $('#app-list')
	new Sortable(appList[0], {
		group: 'shared', // set both lists to same group
		animation: 150,
		onStart: function () {
			appList.addClass('running')
		},
		onEnd: function () {
			// 获取当前应用的排序
			app_code_list = [];
			$(".app-list-item").each(function(){
				var app_code = $(this).attr('app_code');
				app_code_list.push(app_code);
			});
			var url = site_url + 'console/user/app/';
			$.post(url,{
				'apps': JSON.stringify(app_code_list),
			}, function(data){
			}, 'json')
			isSortable = false
			appList.removeClass('running')
		}
	});

	// tooltip
	tippy('.tooltip-icon', {
        content: function (reference) {
			const text = reference.getAttribute('tip-content');
			return text;
		}
	});
	
	tippy('.drag-icon', {
        content: '长按可拖拽自定义位置',
    });

	//  加载更多 start
	$(".loadMore .load-text").on("click", function(){
		$(this).hide();
		$(".loading").show();
		$(".app-list-item .item").each(function(){
			var img_url = $(this).attr('img_url');
			$(this).attr('src', img_url);
		})
		$(".app-list-item").css('display', '');
		$(".loading").hide();
		$(".loadMore").hide();
	})
})
