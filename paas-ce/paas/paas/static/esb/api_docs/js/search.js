/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
function screenWidth () {
    var lWidth = window.innerWidth;
    var contentMain = document.querySelector('#js_container_box');
    contentMain.style.display = '';
}

var vue = new Vue({
    el: '#newVue',
    data: function() {
        return {
            searchText: '',
            searchResult: [],
            allModule: [],
            descriptionUrl: UrlMaker.make('index'),
            showSearchDom: true,
            fiexd: false
        };
    },
    created: function() {
        var self = this;
        window.screenWidth();
        // 优化DOM渲染顺序
        this.$nextTick(function() {
            var textNode = this.$refs.content;
            var mainContent = document.querySelector('#js_container_box');
            textNode.style.display = "";
            mainContent.style.display = '';
            document.addEventListener('click', function() {
                self.searchResult = [];
                self.showSearchDom = true;
            })
            // 监听滚动条，调整fixe布局
            window.onscroll = function() {
                var scrollHeight = document.documentElement.scrollTop;
                if (scrollHeight === 0) {
                    self.fiexd = false;
                    return;
                }
                self.fiexd = true;
            }
        })
        this.getAllModule();
    },
    methods: {
        openPrompt: function(e) {
            if (this.showSearchDom) {
                this.searchKeyWord(e);
            } else {
                this.searchResult = [];
            }
            this.showSearchDom = !this.showSearchDom;
        },
        selectPrompt: function(obj) {
            var url = UrlMaker.make('api_doc', {system_name: obj.system_name, api_name: obj.name});
            this.searchText = obj.name;
            this.searchResult = [];
            window.open(url);
        },
        searchKeyWord: function(e) {
            if (!this.searchText && e.keyCode === 8) {
                return this.searchResult = [];
            }
            var self = this;
            $.ajax({
                type: 'GET',
                url: UrlMaker.make('all_api'),
                dataType: 'json',
                data: {keyword: this.searchText},
                success: function(data) {
                    self.searchResult = data;
                }
            });
        },
        getAllModule: function() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: UrlMaker.make('system_doc_category'),
                dataType: 'json',
                success: function(data) {
                    var result = [];
                    for(var i = 0, len = data.length; i<len; i += 3){
                       result.push(data.slice(i,i+3));
                    }
                    self.allModule = result;
                    self.setHeight();
                }
            })
        },
        setHeight: function() {
            this.$nextTick(function() {
                var aCard = document.querySelectorAll('.a-card');
                for (var i = 0; i < aCard.length; i++) {
                    var height = aCard[i].offsetHeight;
                    aCard[i].style.height = height + 'px';
                }
            })
        }
    }
});
