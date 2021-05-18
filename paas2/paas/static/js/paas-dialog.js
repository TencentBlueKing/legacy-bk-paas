class PaasDialog {
    constructor(config = {}){
        this.cancle = config.cancle  || null;
        this.width = config.width || '80%';
        this.url = config.url || "";
        this.setProps();
        this.init();
        this.handle();
    }
    setProps(){
        this.mask = document.querySelector(".paas-dialog-wrapper");
        this.diaglogContent = document.querySelector(".paas-dialog-content");
        this.closeIcon = document.querySelector(".paas-dialog-header>.close");
        this.maskBody = document.querySelector(".paas-dialog-body");
        this.createBtn = document.querySelector(".paas-create-btn");
    }
    init(){
        this.diaglogContent.style.width = this.width;
    }
    show(){
        this.mask.style.display = "block";
        setTimeout(()=>{
            this.diaglogContent.style.opacity = "1"
        },100)
    }
    hidden(){
        this.mask.style.display = "none";
        setTimeout(()=>{
            this.diaglogContent.style.opacity = "0"
        }, 100)
    }
    handle(){
       this.mask.addEventListener('click',event=>{
           event.stopPropagation()
           if(event.target.classList.contains(".paas-dialog-wrapper") || event.target.classList.contains(".paas-dialog-box")){
               this.hidden();
           }
       },false)
       this.closeIcon.addEventListener("click", ()=>{
           this.hidden()
       })
       this.createBtn.addEventListener("click", ()=> {
           window.open(this.url)
       })
    }
    render(domTemp){
        if(domTemp instanceof HTMLElement){
            domTemp = this.domTostring(domTemp)
        }
        this.maskBody.innerHTML = domTemp
    }   
    domTostring(node){
        let temNode = document.createElement('div');
        let clone_node = node.cloneNode(true);
        temNode.appendChild(clone_node);
        let str = temNode.innerHTML;
        temNode = clone_node = null;
        return str;
    }
}
