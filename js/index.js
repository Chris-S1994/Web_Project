//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {
    navPathDataBind();
    function navPathDataBind() {
        /**
         * 思路：
         * 1、先获取路径导航的页面元素（navPath）
         * 2、再来获取所需要的数据（data.js->goodData.path）
         * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的含义:需要根据数据的数量来进行创建DOM元素
         * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
         */
            //1.获取页面导航的元素对象
        var navPath = document.querySelector('#wrap #content .contentMain #navPath');
        //2.获取数据
        var path = goodData.path;
        //3.遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {  //最后一个a标签
                //只需要创建a且没有href属性
                let aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //4.创建a标签
                let aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //5.创建i标签
                let iNode = document.createElement('i');
                iNode.innerText = '/';

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    // 放大预览的移入移出效果
    var BigImgIndex = 0; //全局变量 点击缩略图展示小图大图时要用
    var ColorIndex = 0; //商品颜色索引 0黑 1银 2白 3蓝 4金
    var storageIndex = 0; //存储容量索引 0 128G 1 256G 2 512G
    var imagesrc = goodData.imagesrc;
    bigClassBind();
    function bigClassBind() {
        /* 1.获取小图标元素对象，设置鼠标移入事件(onmouseenter) onmouseover会有事件冒泡
           2.移入时，动态创建蒙板元素和大图框和大图片元素
           3.移出时，需要移除蒙板元素和大图框
         */
        // 获取相应元素
        var smallPic = document.querySelector('#wrap #content .contentMain #center #leftView #leftTop #smallPic')
        var leftTop = document.querySelector('#wrap #content .contentMain #center #leftView #leftTop')
        // 设置鼠标移入事件
        smallPic.onmouseenter = function () {
            // 创建mask元素
            var maskDiv = document.createElement('div')
            maskDiv.className = "mask";
            // 创建大图框
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";
            // 创建大图片
            var BigImg = document.createElement('img');
            BigImg.src = imagesrc[ColorIndex][BigImgIndex].b;
            // 追加元素
            BigPic.appendChild(BigImg);
            smallPic.appendChild(maskDiv);
            leftTop.appendChild(BigPic)
            //设置鼠标在小图框上的移动事件
            smallPic.onmousemove = function (event) {
                // event.clientX 鼠标点距离浏览器左侧X轴的值
                // getBoundingClientRect().left 小图框元素距离浏览器左侧的可视距离值
                // 通过事件触发修改css中的position位置实现跟随移动
                var left = event.clientX - smallPic.getBoundingClientRect().left-maskDiv.offsetWidth/2;
                var top = event.clientY - smallPic.getBoundingClientRect().top-maskDiv.offsetHeight/2;
                                                                                        //占位宽度 带边界
                // 边界设置 判断
                if(left<0){
                    left = 0;
                }else if(left>smallPic.clientWidth-maskDiv.offsetWidth){
                    left = smallPic.clientWidth-maskDiv.offsetWidth;
                }
                if(top<0){
                    top = 0;
                }else if(top>smallPic.clientHeight-maskDiv.offsetHeight){
                    top = smallPic.clientHeight-maskDiv.offsetHeight;
                }
                maskDiv.style.left = left + 'px';
                maskDiv.style.top = top + 'px';
                BigImg.style.left = -2*left + 'px';
                BigImg.style.top = -2*top + 'px';
            }
            // 设置移出事件
            smallPic.onmouseleave = function () {
                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);
                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }

        }

    }
    // 动态渲染放大镜缩略图的数据 初次渲染
    DynamicPicData();
    function DynamicPicData() {
        /*1.先获取piclist元素下的ul
        2.再获取data.js文件下的goodData->imagesrc数组
        3.遍历数组根据数组的长度创建li元素*/
        var ul = document.querySelector('#wrap #content .contentMain #center #leftView #leftBottom #piclist ul');
        for(let i=0; i<imagesrc[ColorIndex].length;i++){
            let newLi = document.createElement('li');
            let newImg = document.createElement('img');
            newImg.src = imagesrc[ColorIndex][i].s;
            newLi.appendChild(newImg);
            ul.appendChild(newLi);
        }
    }
    // 点击商品颜色标签 改变缩略图的img路径
    function ChangePiclist() {
        let Piclist = document.querySelectorAll('#wrap #content .contentMain #center #leftView #leftBottom #piclist ul li img')
        for(let i=0; i<imagesrc[ColorIndex].length;i++){
            Piclist[i].src = imagesrc[ColorIndex][i].s
        }
    }
    // 点击商品颜色标签 改变大图的img路径
    function ChangBigPic() {
        BigImgIndex = 0
    }
    // 点击缩略图切换小图框的展示图片
    DynamicPicClick();
    function DynamicPicClick() {
        /* 1.获取所有的li元素，并循环发生点击事件
           2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src值
        */
        // 获取li元素 缩略图 数组
        var liNodes = document.querySelectorAll('#wrap #content .contentMain #center #leftView #leftBottom #piclist ul li');
        var smallPic_img = document.querySelector('#wrap #content .contentMain #center #leftView #leftTop #smallPic img');
        smallPic_img.src = imagesrc[ColorIndex][0].b  // 默认小图框路径
        // 给每个li元素添加自定义下标
        for (let i = 0; i < liNodes.length; i++) {
            liNodes[i].index = i;  // 0123456 7个
            liNodes[i].onmouseenter = function () {
                let idx = this.index;
                BigImgIndex = idx; // 对应大图框的图片也要跟着换
                // 变换小图路径
                smallPic_img.src = imagesrc[ColorIndex][idx].b;
            }
        }
    }
    // 点击箭头移动滑动缩略图
    PicmoveClick();
    function PicmoveClick() {
        // 获取a标签箭头元素
        var prev = document.querySelector('#wrap #content .contentMain #center #leftView #leftBottom a.prev');
        var next = document.querySelector('#wrap #content .contentMain #center #leftView #leftBottom a.next');
        var piclist = document.querySelector('#wrap #content .contentMain #center #leftView #leftBottom #piclist');
        var ul = document.querySelector('#wrap #content .contentMain #center #leftView #leftBottom #piclist ul');
        var liNodes = document.querySelectorAll('#wrap #content .contentMain #center #leftView #leftBottom #piclist ul li');
        // 计算 发生起点
        var start = 0;
        var step = liNodes[0].offsetWidth + 18;
        var endPosition = start + step*3;
        prev.onclick = function () {
            start-=step;
            if(start<0){
                start = 0;
            }
            ul.style.left = -start + 'px';
        }
        next.onclick = function () {
            start+=step;
            if(start>endPosition){
                start = endPosition;
            }
            ul.style.left = -start + 'px';
        }
    }
    //商品详情数据的动态渲染
    rightTopData();
    function rightTopData () {
        /*1.查找rightTop元素
        2.查找data.js中内容
        3.建立一个字符串变量，将原来的布局结构贴近来，将所对应的数据放在对应的位置上重新渲染rightTop元素*/
        var rightTop = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop');
        var goodsDetail = goodData.goodsDetail;
        var phoneColor = goodData.phoneColor
        var storage = goodData.storage
        // 模板字符串替换数据
        let s = `<h3>${goodsDetail.title}${storage[storageIndex]}${phoneColor[ColorIndex]}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配送至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;
        // 重新渲染rightTop元素
        rightTop.innerHTML = s;
    }
    //商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData() {
        // 对应data.js->goodData.goodsDetail.crumbData数据
        var chooseWrap = document.querySelector('#wrap #content .contentMain #center #rightView .rightBottom .chooseWrap');
        var crumbData = goodData.goodsDetail.crumbData;
        for(let i=0; i<crumbData.length; i++){
            let dlNode = document.createElement('dl');
            let dtNode = document.createElement('dt')
            dtNode.innerText = crumbData[i].title;
            dlNode.appendChild(dtNode);
            for(let j=0; j<crumbData[i].data.length; j++){
                let ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                ddNode.setAttribute('price',crumbData[i].data[j].changePrice);
                dlNode.appendChild(ddNode);
            }
            chooseWrap.appendChild(dlNode);
        }
    }
    //点击商品参数之后的颜色限定效果
    clickddBind();
    function clickddBind() {
        /* 每一行dd文字颜色排他
        /* 1.获取所有dl元素，取其中第一个元素下的所有dd元素先测试,再嵌套一个for循环
           2.循环所有dd元素并添加点击事件
           3.确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色#666

           点击dd后产生的mark标记
           1.创建一个可以容纳点击的dd元素值的容器(数组)，确定数组的起始长度
           2.然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上
        */

        let dlNodes = document.querySelectorAll('#wrap #content .contentMain #center #rightView .rightBottom .chooseWrap dl');
        let arr = new Array(dlNodes.length);
        arr.fill(0);  //[0,0,0,0] mark数组
        let choose = document.querySelector('#wrap #content .contentMain #center #rightView .rightBottom .choose');
        for(let i=0; i<dlNodes.length; i++){
            (function (i) {
                let ddNodes = dlNodes[i].querySelectorAll('dd');
                for(let j=0; j<ddNodes.length; j++){
                    ddNodes[j].onclick = function () {
                        //清空choose元素
                        choose.innerHTML = "";
                        for(let k=0; k<ddNodes.length; k++){
                            ddNodes[k].style.color = '#666';
                            ddNodes[k].style.border = '1px solid darkgray';
                        }
                        this.style.color = 'orangered';  //点击的dd变色 其他的基础色
                        this.style.border = '1px solid red';
                        //点击哪一个dd元素动态的产生一个新的mark标记元素
                        arr[i]=this;
                        changePriceBind(arr);

                        arr.forEach(function (value,index) {
                            if(value){  //mark数组中元素若非0 生成一个mark标签
                                let markDiv = document.createElement('div');
                                markDiv.className = 'mark';
                                markDiv.innerText = value.innerText;
                                let img = document.createElement('img')
                                img.src = 'image/xicon.png';
                                img.setAttribute('index',String(index)); //index记录点击生成choose中块的下标索引
                                // 表明这个mark标是属于哪个dl的 0 1 2 3
                                markDiv.appendChild(img);
                                choose.appendChild(markDiv);

                            }
                        })
                        //获取choose中所有的img标签，并循环发生点击事件 点击x掉mark标签是 恢复dl为初始状态
                        let aNodes = document.querySelectorAll('#wrap #content .contentMain #center #rightView .rightBottom .choose .mark img');
                        for(let n=0; n<aNodes.length; n++){
                            aNodes[n].onclick = function () {
                                //获取点击的img身上的属性值
                                let idx1 = this.getAttribute('index');
                                //恢复数组中对应下标的元素
                                arr[idx1] = 0;
                                //重置下标为颜色0和存储容量1的内容
                                if(idx1==='0'){
                                    ColorIndex = 0
                                    let goodName = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop h3')
                                    goodName.innerHTML = `${goodData.goodsDetail.title}${goodData.storage[storageIndex]}${goodData.phoneColor[ColorIndex]}`
                                    ChangePiclist()
                                    DynamicPicClick()
                                    ChangBigPic()
                                }
                                if(idx1==='1'){
                                    storageIndex = 0
                                    let goodName = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop h3')
                                    goodName.innerHTML = `${goodData.goodsDetail.title}${goodData.storage[storageIndex]}${goodData.phoneColor[ColorIndex]}`
                                }
                                //查找对应下标的那个dl行中的所有dd元素
                                let ddlist = dlNodes[idx1].querySelectorAll('dd');
                                //遍历所有的dd
                                for(let m=0; m<ddlist.length; m++){
                                    ddlist[m].style.color = '#666';
                                }
                                ddlist[0].style.color = 'orangered';
                                //删除对应mark标签 this的父元素
                                choose.removeChild(this.parentNode);
                                changePriceBind(arr);
                            }
                        }
                        if(i===0){
                            switch (this.innerText) {
                                case '亮黑色':
                                    ColorIndex = 0
                                    break;
                                case '冰霜银':
                                    ColorIndex = 1
                                    break;
                                case '零度白':
                                    ColorIndex = 2
                                    break;
                                case '深海蓝':
                                    ColorIndex = 3
                                    break;
                                case '晨曦金':
                                    ColorIndex = 4
                                    break;
                            }
                            let goodName = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop h3')
                            goodName.innerHTML = `${goodData.goodsDetail.title}${goodData.storage[storageIndex]}${goodData.phoneColor[ColorIndex]}`
                            ChangePiclist()
                            DynamicPicClick()
                            ChangBigPic()
                        }
                        if(i===1){
                            switch (this.innerText) {
                                case '128G':
                                    storageIndex = 0
                                    break;
                                case '256G':
                                    storageIndex = 1
                                    break;
                                case '512G':
                                    storageIndex = 2
                                    break;
                            }
                            let goodName = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop h3')
                            goodName.innerHTML = `${goodData.goodsDetail.title}${goodData.storage[storageIndex]}${goodData.phoneColor[ColorIndex]}`
                        }
                    }
                }
            })(i); //加立即执行，闭包函数 为了i j能在后续函数中正常调用
        }
    }
    //选择参数时价格变动的函数
    function changePriceBind(arr) {
        /**
         * 思路：
         * 1、获取价格的标签元素
         * 2、给每一个dd标签身上默认都设置一个自定义的属性，用来记录变化的价格
         * 3、遍历arr数组，将dd元素身上的新变化的价格和已有的价格（5988）相加
         * 4、最后将计算之后的结果重新渲染到p标签中
         */
            //1、原价格标签元素
        var oldPrice = document.querySelector('#wrap #content .contentMain #center #rightView .rightTop .priceWrap .priceTop .price p');
        //取出默认的价格
        var price = goodData.goodsDetail.price;
        //2、遍历arr数组
        for(let i = 0 ; i < arr.length;i++){
            if(arr[i]){
                //数据类型的强制转换
                let changeprice = Number(arr[i].getAttribute('price'));
                //最终价格
                price += changeprice;
            }

        }
        oldPrice.innerText = price;
        //变化后的价格写入左侧商品详情中的标签
        let basicPrice = document.querySelector('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        basicPrice.innerText = '￥'+price;
        //遍历选择搭配中所有的复选框
        let ipts = document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        let newprice = document.querySelector('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(let j=0; j<ipts.length; j++){
            if (ipts[j].checked){
                price += Number(ipts[j].value);
            }
        }
        newprice.innerText = '￥'+price;
    }
    //选择搭配中间区域复选框中套餐价的变动效果
    choosePrice();
    function choosePrice() {
        /* 1.获取中间区域中所有复选框元素
           2.遍历这些元素取出他们的价格，和左侧的基础价格累加，累计之后重新写入套餐价
         */
        let ipts = document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        let basicPrice = document.querySelector('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        let newprice = document.querySelector('#wrap #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(let i=0; i<ipts.length; i++){
            ipts[i].onclick = function () {
                let oldPrice = Number(basicPrice.innerText.slice(1));
                for(let j=0; j<ipts.length; j++){
                    if(ipts[j].checked){
                        oldPrice += Number(ipts[j].value);
                    }
                }
                newprice.innerText = '￥'+oldPrice;  //更新右侧套餐价格
            }
        }
    }
    //封装一个公共选项卡函数
    /**
     * ① 被点击的元素   tabBtns
     * ② 被切换显示的元素  tabConts
     */
    function Tab(tabBtns,tabConts){
        for(var i = 0;i<tabBtns.length;i++){
            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){
                for(var j = 0;j<tabBtns.length;j++){ //切换Class为active or ''
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }

    //点击左侧选项卡
    leftTab();
    function leftTab(){
        //被点击的元素
        var h4s = document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .leftAside .asideTop h3');
        //被切换显示的元素
        var divs = document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .leftAside .aslideContent>div');
        //调用函数
        Tab(h4s,divs);
    }

    //点击右侧选项卡
    rightTab();
    function rightTab(){
        //被点击的元素
        var lis =document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li');
        //被切换显示的元素
        var divs = document.querySelectorAll('#wrap #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents div');
        //调用函数
        Tab(lis,divs);
    }
    //右边侧边栏的点击效果
    rightAsideBind();
    function rightAsideBind(){
        /**
         * 思路：
         * 1、先找到按钮元素，发生点击事件
         * 2、记录一个初始的状态，在点击事件的内容进行判断,如果为关闭则展开，否则为关闭（状态取反）
         * 3、如果为展开则设置按钮和侧边栏对应的class效果，关闭亦如此
         */

            //1、找按钮元素
        var btns = document.querySelector('#wrap .rightAside .btns');

        //记录初始状态
        var flag = true; //关闭

        //查找侧边栏元素
        var rightAside = document.querySelector('#wrap .rightAside');

        //2、发生点击事件
        btns.onclick = function(){

            //判断
            if(flag){
                //展开
                //  flag = false;

                btns.className = "btns btnsOpen";

                rightAside.className = "rightAside asideOpen";

            }else{
                //关闭
                //  flag = true;
                btns.className = "btns btnsClose";

                rightAside.className = "rightAside asideClose";
            }

            //无论前面的if和else执行的到底是谁，最终flag的状态都是在原来基础之上进行取反
            flag = !flag;
        }
    }
}
//购物车商品数量加减
function NumberAdd() {
    let numElement = document.querySelector('#wrap #content .contentMain #center #rightView .rightBottom .addCart .count input');
    let num = Number(numElement.value);
    if(num<6){
        num++;
    }else{
        alert('该商品最多一次只能购买6件')
    }
    numElement.value = String(num);
}
function NumberSub() {
    let numElement = document.querySelector('#wrap #content .contentMain #center #rightView .rightBottom .addCart .count input');
    let num = Number(numElement.value);
    if(num>0){
        num--;
    }
    numElement.value = String(num);
}
