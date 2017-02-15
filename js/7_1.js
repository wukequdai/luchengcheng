+function(){
	//查找class为tree的ul
	var ul=document.getElementsByClassName("tree")[0];
	//查找ul下所有span
	var spans=ul.getElementsByTagName("span");
	//遍历spans中每个span，绑定单击事件
	for(var i=0,len=spans.length;i<len;i++){
		spans[i].onclick=toggle;
	}
	function toggle(){
		var span=this;
		//如果span是open
		if(span.className=="open")
			//设置span的class为closed
			span.className="closed";
		else{//否则
			//在ul下查找class为open的span
			var spanOpen=ul.getElementsByClassName("open")[0];
			//如果spanOpen不是undefined
			if(spanOpen!==undefined)
				//修改spanOpen为closed
			spanOpen.className="closed";
			//设置span为open
			span.className="open";
		}
	}
}()