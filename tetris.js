var game={
  OFFSET:15,CSIZE:26,//游戏主界面的内边距和格子大小
  shape:null,//保存主角图形
  pg:null,//保存游戏容器
  interval:500,//保存下落的时间间隔
  timer:null,//保存定时器序号
  CN:10,RN:20,//保存总列数和行数
  wall:null,//保存方块墙
  nextShape:null,//保存备胎图形
  score:0,lines:0,//保存分数和行数
  SCORES:[0,10,30,60,100],
        //0 1  2  3  4
  state:0,//保存游戏状态
  GAMEOVER:0,//游戏结束
  RUNNING:1,//运行中
  PAUSE:2,//暂停
  start(){//游戏启动
    this.state=this.RUNNING;//设置游戏状态为运行中
    this.score=this.lines=0;//分数和行数清零
    this.wall=[];//创建空数组保存在wall中
    //创建一个CN*RN的二维数组
    for(var r=0;r<this.RN;r++){
      this.wall[r]=new Array(this.CN);
    }
    //查找class为playground的div保存在pg属性中
    this.pg=document.querySelector(".playground");
    //新建一个T图形,保存在shape属性中
    this.shape=this.randomShape();
    this.nextShape=this.randomShape();
    this.paint();//重绘一切
    //启动周期性定时器，每隔interval，调用一次moveDown
    this.timer=setInterval(
      this.moveDown.bind(this),this.interval);
    //为document绑定键盘按下事件
    document.onkeydown=function(e){
      switch(e.keyCode){//判断按键号
        case 37: //是37,就左移
          this.state==this.RUNNING
            &&this.moveLeft(); break;
        case 39: //是39,就右移
          this.state==this.RUNNING
            &&this.moveRight(); break;
        case 32: //是32,就一落到底
          this.state==this.RUNNING
            &&this.hardDrop(); break;
        case 40: //是40,就下移
          this.state==this.RUNNING
            &&this.moveDown(); break;
        case 38: //是38,就顺时针旋转
          this.state==this.RUNNING
            &&this.rotateR(); break;
        case 90: //是90,就逆时针旋转
          this.state==this.RUNNING
            &&this.rotateL(); break;
        case 80: //是80,就暂停
          this.state==this.RUNNING
            &&this.pause(); break;
        case 67: //是67,就从暂停状态恢复
          this.state==this.PAUSE
            &&this.myContinue(); break;
        case 81: //是81,就游戏结束
          this.state!=this.GAMEOVER
            &&this.quit(); break;
        case 83: //是83,就重新启动游戏
          this.state==this.GAMEOVER
            &&this.start(); break;
      }
    }.bind(this);
  },
  pause(){
    clearInterval(this.timer);
    this.state=this.PAUSE;
    this.paint();
  },
  myContinue(){
    this.state=this.RUNNING;
    this.timer=setInterval(
      this.moveDown.bind(this),this.interval);
    this.paint();
  },
  quit(){
    this.state=this.GAMEOVER;
    clearInterval(this.timer);
    this.paint();
  },
  randomShape(){//随机生成图形
    //在0~2之间生成随机整数r
    switch(Math.floor(Math.random()*3)){//判断r 
      case 0: return new O();//是0就返回一个新的O
      case 1: return new I();//是1就返回一个新的I
      case 2: return new T();//是2就返回一个新的T
    }
  },
  canRotate(){//旋转后判断是否越界或撞墙
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前cell临时保存在cell中
      var cell=this.shape.cells[i];
      //如果cell的r<0或>=RN或cell的c<0或>=CN或在wall中相同位置有格
      if(cell.r<0||cell.r>=this.RN
          ||cell.c<0||cell.c>=this.CN
          ||this.wall[cell.r][cell.c]!==undefined)
        return false;//返回false
    }//(遍历结束) 
    return true;//返回true
  },
  rotateR(){//顺时针旋转
    this.shape.rotateR();
    if(!this.canRotate())//如果不能旋转
      this.shape.rotateL();
  },
  rotateL(){
    this.shape.rotateL();
    if(!this.canRotate())//如果不能转
      this.shape.rotateR();
  },
  hardDrop(){
    //反复: 只要可以下落，就
    while(this.canDown())
      this.moveDown();//游戏的moveDown
  },
  canLeft(){//判断能否左移
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前cell另存为
      var cell=this.shape.cells[i];
      //如果cell的c等于0或wall中cell左侧不是undefined
      if(cell.c==0
        ||this.wall[cell.r][cell.c-1]!==undefined)
        return false;//返回false
    }//(遍历结束)
    return true;//返回true
  },
  moveLeft(){//左移
    if(this.canLeft()){//如果可以左移
      //调用shape的moveLeft方法
      this.shape.moveLeft();
      this.paint();//重绘一切
    }
  },
  canRight(){//判断能否右移
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      var cell=this.shape.cells[i];//cell另存为
      //如果cell的c等于CN-1或wall中右侧有格
      if(cell.c==this.CN-1
         ||this.wall[cell.r][cell.c+1]!==undefined)
        return false;//返回false
    }//(遍历结束)
    return true;//返回true
  },
  moveRight(){//右移
    if(this.canRight())//如果可以右移
      this.shape.moveRight();//调用shape的moveRight
      this.paint();//重绘一切
  },
  canDown(){//判断能否下落
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      var cell=this.shape.cells[i];
      //如果cell的r等于RN-1，就返回false
      if(cell.r==this.RN-1) return false;
      //否则，如果wall中cell的下方位置不为undefined，就返回false
      else if(this.wall[cell.r+1][cell.c]!==undefined) 
        return false;
    }//(遍历结束)
    return true;//就返回true
  },
  landIntoWall(){//主角图形落入墙中
    //遍历shape的cells中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前cell另存在变量cell中
      var cell=this.shape.cells[i];
      //将cell保存到wall中相同r行c列的位置
      this.wall[cell.r][cell.c]=cell;
    }
  },
  moveDown(){//让主角图形下落一步
    if(this.canDown())//如果可以下落
      this.shape.moveDown();//只改内存,不改页面
    else{//否则
      this.landIntoWall();//旧图形落入墙中
      var ln=this.deleteRows();//删除行
      this.lines+=ln;//将ln累加到总行数上
      this.score+=this.SCORES[ln];
      if(!this.isGameOver()){//如果游戏没有结束
        //将备胎转正，再生成新的备胎
        this.shape=this.nextShape;
        this.nextShape=this.randomShape();
      }else{//否则
        this.quit();//调用quit
      }
    }
    this.paint();//重绘一切
  },
  isGameOver(){
    //遍历备胎图形的cells中每个cell
    for(var i=0;i<this.nextShape.cells.length;i++){
      //将cell另存为cell
      var cell=this.nextShape.cells[i];
      //如果在wall中cell相同位置有格
      if(this.wall[cell.r][cell.c]!==undefined)
        return true;//返回true
    }//(遍历结束)
    return false;//返回false
  },
  deleteRows(){//删除所有满格行
    //自底向上遍历wall中每一行
    for(var r=this.RN-1,ln=0;r>=0&&ln<4;r--){
      //如果当前行是空行，就退出循环
      if(this.wall[r].join("")=="") break;
      //如果当前行是满格，就删除当前行
      if(this.isFullRow(r)){
        this.deleteRow(r);
        r++;//r留在原地继续判断新的r行
        ln++;
      }
    }
    return ln;
  },
  deleteRow(r){//删除第r行
    //从r行开始，反向遍历wall中每一行
    for(;r>=0;r--){
      //将wall中r-1行赋值给r行
      this.wall[r]=this.wall[r-1];
      //将wall中r-1行赋值为CN个空元素的数组
      this.wall[r-1]=new Array(this.CN);
      //遍历wall中r行每个格
      for(var c=0;c<this.CN;c++){
        //如果当前格不是undefined
        if(this.wall[r][c]!==undefined)
          this.wall[r][c].r++;//就将当前格的r+1
      }//(遍历结束)
      //如果wall中r-2行是空行
      if(this.wall[r-2].join("")=="")
        break;//就退出循环
    }
  },
  isFullRow(r){//判断第r行是否满格
    //如果在当前行的字符串中没有找到开头的逗号或结尾的逗号或连续的两个逗号，说明是满格
    return String(this.wall[r]).search(/^,|,,|,$/)==-1
  },
  paintScore(){
    //找到id为score的span，设置其内容为score属性
    document.getElementById("score").innerHTML
      =this.score;
    //找到id为lines的span，设置其内容为lines属性
    document.getElementById("lines").innerHTML
      =this.lines;
  },
  paint(){//重绘一切
    //先清除所有img
    var reg=/<img [^>]+>/g;
    this.pg.innerHTML=
      this.pg.innerHTML.replace(reg,"");
    this.paintShape();//再重绘
    this.paintWall();
    this.paintNext();
    this.paintScore();
    this.paintState();
  },
  paintState(){//根据游戏状态绘制图片
    if(this.state==this.GAMEOVER){
      var img=new Image();
      img.src="img/game-over.png";
      img.style.width="100%";
      this.pg.appendChild(img);
    }else if(this.state==this.PAUSE){
      var img=new Image();
      img.src="img/pause.png";
      img.style.width="100%";
      this.pg.appendChild(img);
    }
  },
  paintNext(){//重绘备胎图形
    //创建文档片段frag
    var frag=document.createDocumentFragment();
    //遍历nextShape中cells数组中每个cell
    for(var i=0;i<this.nextShape.cells.length;i++){
      //将当前cell保存在变量cell中
      var cell=this.nextShape.cells[i];
      var img=this.paintCell(cell,frag);//绘制格
      //设置img的left为当前left+10*CSIZE
      img.style.left=
     parseFloat(img.style.left)+10*this.CSIZE+"px";
      //设置img的top为当前top+CSZIE
      img.style.top=
        parseFloat(img.style.top)+this.CSIZE+"px";
    }//(遍历结束)
    this.pg.appendChild(frag);//将frag追加到pg中  
  },
  paintWall(){//绘制墙
    //创建frag
    var frag=document.createDocumentFragment();
    //自底向上遍历wall中行
    for(var r=this.RN-1;r>=0;r--){
      //如果当前行是空行就退出循环
      if(this.wall[r].join("")=="") break;
      else//否则，就遍历当前行中每一列
        for(var c=0;c<this.CN;c++)
          //如果wall中当前格不是undefined
          if(this.wall[r][c]!==undefined)
            //绘制wall中当前格
            this.paintCell(this.wall[r][c],frag)
    }//(遍历结束)
    this.pg.appendChild(frag);//将frag追加到pg中
  },
  paintCell(cell,frag){
    var img=new Image();//新建一个img
    //设置img的left为OFFSET+CSIZE*cell的c+px
    img.style.left=
      this.OFFSET+this.CSIZE*cell.c+"px";
    //设置img的top为OFFSET+CSIZE*cell的r+px
    img.style.top=
      this.OFFSET+this.CSIZE*cell.r+"px";
    img.src=cell.src;//设置img的src为cell的src
    frag.appendChild(img);//将img追加到frag中
    return img;
  },
  paintShape(){//绘制主角图形
    //创建文档片段frag
    var frag=document.createDocumentFragment();
    //遍历shape中cells数组中每个cell
    for(var i=0;i<this.shape.cells.length;i++){
      //将当前cell保存在变量cell中
      var cell=this.shape.cells[i];
      this.paintCell(cell,frag)//绘制格
    }//(遍历结束)
    this.pg.appendChild(frag);//将frag追加到pg中
  }
}
game.start();