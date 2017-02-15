+function(){
	
	/*找到按钮绑定事件*/
	//数量变化
	//查找id为data的table
	var table=document.getElementById("data");
	//在table下查找所有button元素
	//奇数行变色
	var odd_trs=table.querySelectorAll(
		"tbody>tr:nth-child(odd)"	
	);
	for(var i=0;i<odd_trs.length;i++){
		odd_trs[i].style.backgroundColor="#afa";
	};
	var btns=table.getElementsByTagName("button");
	//遍历所有button
	for(var i=0,len=btns.length;i<len;i++){
		//为button添加单击事件处理函数
		btns[i].onclick=calc;
			//事件处理函数中this->事件绑定到的.前的对象
		//alert(this.innerHTML);//输出当前button的内容
	}
	function calc(){
		var btn=this;//this->btn
		/*数量变化*/
		var td=btn.parentNode;//获得btn的父元素td
		//获得td下唯一的一个span
		var span=td.getElementsByTagName("span")[0];
		//获得span的内容的浮点数
		var n=parseFloat(span.innerHTML);
		//如果btn的内容是+，就n+1，
		//否则，如果n>1,才n-1
		//否则，n不变       
		n+=btn.innerHTML=="+"?1:
											n>1?-1:
													0;
		span.innerHTML=n;//修改span的内容为n
		/*小计*/
		//获得单价“td的前一个兄弟的内容，去掉¥转为浮点数
		var price=parseFloat(
			td.previousElementSibling.innerHTML.slice(1));
		var subTotal=price*n;//计算小计
		//设置td的下一个兄弟的内容为subTotal;
		td.nextElementSibling.innerHTML=
			"¥"+subTotal.toFixed(2);
		/*总计*/
		//获得table的tbody
		var tbody=table.getElementsByTagName("tbody")[0];
		//获得tbody下所有td
		var tds=tbody.getElementsByTagName("td");
		//i从3开始，每隔4个遍历一次td
		for(var i=3,len=tds.length,sum=0;i<len;i+=4){
			//将当前td的内容去掉¥，转为浮点数加到sum中
			sum+=parseFloat(tds[i].innerHTML.slice(1));
		}
		//获得table的tfoot
	/*	var tfoot=table.getElementsByTagName("tfoot")[0];
		//获得tfoot下所有td的第二个
		var td=tfoot.getElementsByTagName("td")[1];
		//设置td的内容为总价
		td.innerHTML="¥"+sum.toFixed(2);*/
		table.querySelector("tfoot td:last-child")
				 .innerHTML="¥"+sum.toFixed(2);
	}
}();





