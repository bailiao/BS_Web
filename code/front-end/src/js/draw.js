export default{
     methods:{
        fabricCanvas(){
             if(this.fabricObj){ // 如果画布已经存在，清空画布重新绘制
                 this.fabricObj.clear()
             } else {
                 this.fabricObj = new fabric.Canvas('lavel-canvas',{
                    // 此处设置画布的初始属性
                    uniformScaling: false, // 等比例缩放
                    enableRetinaScaling: false, 
                    selection: false // 禁止组选择
                 })
             }
             let Shape
             const image = new Image()
             image.src = this.imageData
             image.setAttribute('crossOrigin','anonymous') // 允许跨域访问
             image.onload = () => {
                 // 将canvas的width和height设置成图片的原始width,height
                 this.width = image.width 
                 this.height = image.height
                 this.fabricObj.setWidth(this.width)
                 this.fabricObj.setHeight(this.height)
                 // 将图片放置在外部容器中
                 let boxWidth = document.getElementById('canvas-box').offsetWidth
                 let boxHeight = document.getElementById('canvas-box').offsetHeight
                 let scaleX = boxWidth / image.width
                 let scaleY = boxHeight / image.height
                 // 确定缩放因子
                 this.scale = scaleX > scaleY ? scaleX : scaleY
                 document.querySelector('.canvas-container').style.width = this.width * this.scale + 'px'
                 document.querySelector('.canvas-container').style.height = this.height * this.scale + 'px'
                 document.querySelector('#label-canvas').style.width = this.width * this.scale + 'px'
                 document.querySelector('#label-canvas').style.height = this.height * this.scale + 'px'
                 document.querySelector('.upper-canvas').style.width = this.width * this.scale + 'px'
                 document.querySelector('.upper-canvas').style.height = this.height * this.scale + 'px'
                 
                 Shape = new fabric.Image(image)
                 this.fabric.setBackgroundImage(Shape,
                     this.fabricObj.renderAll.bind(this.fabricObj),
                     {
                         opaity: 1,
                         angle: 0
                     }
                 )
                 this.$nextTick(()=>{
                     this.fabricObj.renderAll() // 重新渲染画布
                 })
             }
        },
    
        fabricObjEvent() {
            this.fabricObj.on({
                'mouse:down': (e) => this.handleMouseDown(e),    //鼠标按下
                'mouse:move': (e) => this.handleMouseMove(e),    //鼠标移动
                'mouse:up': (e) => this.handleMouseUp(e),    //鼠标抬起
                'object:moving': (e) => this.handleObjectMoving(e),      //对象移动
                'object:modified': (e) => this.handleObjectModified(e),      //对象调整
                'object:scaling': (e) => this.handleObjectScaling(e),      //对象缩放
                'selection:created': (e) => this.handleSelectionCreated(e),  //选中画布上的对象
                'selection:updated': (e) => this.handleSelectionUpdated(e),  //选中对象变化
                'selection:cleared': (e) => this.handleSelectionCleared(e),  //取消选中
            })
        },
        handleMouseDown(e) {
            if(this.isDrag) {   //拖拽
                this.drag(e.e)
                return
            }
            //判断是否允许标注
            if(this.readOnly || !this.actions.mark || this.isEdit || this.selection)
                return
            this.doDrawing = true
            //this.limitPoint() 方法限制画笔只能在画布内部
            this.mousFrom = this.limitPoint(e.pointer.x, e.pointer.y)
        }
    }
 }