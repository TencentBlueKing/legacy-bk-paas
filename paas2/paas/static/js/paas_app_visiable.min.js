APP_VISIABLE = (function() {
  return {
    init: function(app_code, init_data) {
      Vue.use(BkUserSelector)
      new Vue({
        el: '#app',
        data () {
          return {
            users: [],
            departments: [],
            isShow: false,
            initDateTime: '2019-03-03 12:12:12',
            oldCode: 'Vue.component("app-exception", Exception)\n// Vue.component("app-auth", AuthComponent)',
            newCode: 'Vue.component("app-exception", Exception)',
            topStart: {
              content: '提示信息',
              showOnInit: true,
              placements: ['top-start']
            }
          }
        },
        mounted () {
          init_data.forEach(item => {
            if (item.type === 'department') {
              this.departments.push({
                id: item.id,
                name: item.name
              })
            } else {
              this.users.push({
                id: item.id,
                username: item.name,
                display_name: item.name
              })
            }
          })
          this.showSelected(init_data)
        },
        methods: {
          handleSubmit ({ users, departments }) {
            this.users = [...users]
            this.departments = [...departments]
            this.isShow = false
            this.saveData()
          },

          showSelected (selectedList) {
            const text = selectedList.map(item => {
              // return `${item.name || item.username}(${item.id})`
              return `${item.name || item.username}`
            })
            this.$refs.selectedText.innerHTML = text.join('; ');
          },

          saveData () {
            const selectedUsers = this.users.map(item => {
              return {
                id: item.id,
                type: 'user',
                name: item.username
              }
            })
            const selectedDepartments = this.departments.map(item => {
              return {
                id: item.id,
                type: 'department',
                name: item.name
              }
            })
            var selectedList = [
              ...selectedUsers,
              ...selectedDepartments
            ]

            // console.log(selectedList)
            // ajax 保存数据 this.selectedList
            var url = BLUEKING.config.paas_host() + "app/modify/" + app_code + "/";
            $.ajax({
              type: "POST",
              url: url,
              data: {
                "operate": "visiable_labels",
                "selected_list": JSON.stringify(selectedList),
              },
              success: (data) => {
                if(!data.result) {
                  $("#error_tip").text(data.msg)
                } else {
                  this.showSelected(selectedList)
                }
              },
              dataType: 'json',
              async: false,
            })
          },

          handleCancel () {
            this.isShow = false
            // console.log("hide")
          },

          handleChoose () {
            this.isShow = true
            // console.log("show", this.isShow)
          }
        }
      });


    },
  }
})()
