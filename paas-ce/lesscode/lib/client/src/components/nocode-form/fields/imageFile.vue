<template>
    <div class="image-file">
        <div v-if="!viewMode" :class="['image-upload-wrapper', { disabled }]">
            <div class="upload-text">
                <i class="bk-icon icon-plus"></i>
                <div>点击上传</div>
            </div>
            <input
                ref="file"
                class="upload-input"
                type="file"
                accept=".png, .jpeg, .jpg, .svg, .gif"
                :multiple="true"
                :disabled="disabled"
                @change="change" />
        </div>
        <div v-for="(img, index) in imgList" :class="['image-item', { disabled: disabled || viewMode }]" :key="index">
            <img :src="getFullPath(img)" />
            <i class="delete-icon bk-icon icon-close" @click="handleDelete(index)"></i>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ImageFile',
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: Array,
                default: () => []
            },
            disabled: {
                type: Boolean,
                default: false
            },
            viewMode: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                imgList: [...this.value]
            }
        },
        watch: {
            field () {
                this.imgList = [...this.value]
            }
        },
        methods: {
            async change (e) {
                const files = Array.prototype.slice.call(e.target.files)
                if (files.length === 0) {
                    return
                }
                this.$refs.file.value = null
                files.forEach(file => {
                    this.uploadFile(file)
                })
            },
            async uploadFile (file) {
                try {
                    this.uploading = true
                    const data = new FormData()
                    data.append('field_file', file)
                    const res = await this.$store.dispatch('common/uploadFile', data)
                    Object.keys(res.data.succeed_files).forEach(key => {
                        this.imgList.push(res.data.succeed_files[key])
                    })
                    this.update()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.uploading = false
                }
            },
            getFullPath (img) {
                return typeof img === 'string'
                    ? `${window.location.origin}${window.SITE_URL}${img}`
                    : `${window.location.origin}${window.SITE_URL}${img.path}`
            },
            handleDelete (index) {
                this.imgList.splice(index, 1)
                this.update()
            },
            update () {
                this.$emit('change', this.imgList)
            }
        }
    }
</script>
<style lang="postcss">
.image-file {
  display: flex;
  flex-wrap: wrap;
}
.image-upload-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  font-size: 12px;
  color: #63656e;
  text-align: center;
  background: #fafbfd;
  border: 1px dashed #c4c6cc;
  border-radius: 2px;
  cursor: pointer;
  &:not(.disabled):hover {
    border-color: #3a84ff;
    color: #3a84ff;
  }
  &.disabled {
    cursor: not-allowed;
  }
  i {
    font-size: 24px;
  }
}
.upload-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
  opacity: 0;
}
.image-item {
  position: relative;
  display: inline-block;
  margin-left: 8px;
  margin-bottom: 8px;
  padding: 5px;
  width: 100px;
  height: 100px;
  background: #fafbfd;
  border: 1px solid #c4c6cc;
  border-radius: 2px;
  img {
    width: 100%;
  }
  &:not(.disabled):hover {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
    }
    .delete-icon {
      display: block;
    }
  }
  .delete-icon {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    color: #c4c6cc;
    font-size: 18px;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
