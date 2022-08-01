function change_img()
{
    element = document.getElementById('click_img')
    if (element.src.match("click_off"))
    {
        element.src="image/click_on.gif";
        element.style.position="absolute";
        element.style.right="18px";
        element.width="240";
        element.heigth="210";
    }
    else
    {
        element.src="image/click_off.png";
        element.style.position="absolute";
        element.style.right="35px";
        element.width="195";
        element.heigth="200";
    }
}

var moveX =0;
var moveY = 0; //Y轴方向上移动的距离
var stepY = 4; //图片Y轴移动的速度
var directionY = 0; //设置图片在Y轴方向上的移动方向   0:向下  1:向上

function changePos() {
    timer = setInterval(function() {
        var img = document.getElementById("float_div"); //获得图片所在层的ID
        var height = document.documentElement.clientHeight; //浏览器的高度
        var imgHeight = document.getElementById("float_img").height; //飘浮图片的高度
        //设置飘浮图片距离浏览器右侧位置
        img.style.left = parseInt(moveX + document.documentElement.scrollLeft) + "px";
        img.style.top = parseInt(moveY + document.documentElement.scrollTop) + "px";

        //设置图片在Y轴上的移动规律
        if(directionY == 0) {
            //飘浮图片在Y轴方从上向下移动
            moveY += stepY;
        } else {
            //飘浮图片在Y轴方从下向上移动
            moveY -= stepY;
        }
        if(moveY < 0) {
            //如果飘浮图片飘浮到顶端的时候，设置图片在Y轴方向上向下移动
            directionY = 0;
            moveY = 0;
        }
        if(moveY > (height - imgHeight)) {
            //如果飘浮图片飘浮到浏览器底端的时候，设置图片在Y轴方向上向上移动
            directionY = 1;
            moveY = (height - imgHeight);
        }
    }, 60)
}
changePos();

function clearPos1() {
    clearInterval(timer);
}