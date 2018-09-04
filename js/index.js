'use strict';
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
var h=document.documentElement.clientHeight;
var w=document.documentElement.clientWidth;
var percentX=w/375;
var percentY=h/667;
percentY= percentY>=1?percentY:percentY-0.1;
var container=$(".container");
var bar=$(".bar");
bar.width(2*w);
bar.height(2*h);
var step0=$(".step0");
var step1=$(".step1");
var step2=$(".step2");
var step3=$(".step3");
var step4=$(".step4");
var arr=[container,step0,step1,step2,step3,step4];
for(var p of arr){
    p.width(w);
    p.height(h);
}
var isRotate=true;
var song=$("#music")[0];
song.volume=0.25;
//预加载
var imgSrcArr = [
        'img/bg1.jpg',
        'img/bg2.png',
        'img/moon.png',
        'img/tree.png'
    ];
var imgWrap = [];
function preloadImg(arr) {
    for(var i =0; i< arr.length ;i++) {
        imgWrap[i] = new Image();
        imgWrap[i].src = arr[i];
    }
}
var again=false;
// part1：进度条
$(function(){
    preloadImg(imgSrcArr);
    var rectW=60;
    var hasLoad=0;
    var progressBar = document.querySelector("#progressBar");
    var ctx = progressBar.getContext("2d");
    ctx.scale(2,2);
    var cake = new Image();
    cake.src="img/moonCake.png";
    var rabbit1=new Image();
    rabbit1.src="img/rabbit1.png";
    var rabbit2=new Image();
    rabbit2.src="img/rabbit2.png";
    var rabbit=rabbit1;
    var progress1=new Image();
    progress1.src="img/progress1.png";
    var progress2=new Image();
    progress2.src="img/progress2.png";
    var imgArr=[cake,rabbit1,rabbit2,progress1,progress2];
    var begin=false;
    init();
    animloop();
    var timer=setInterval(()=>{
        if(rabbit==rabbit1) rabbit=rabbit2;
        else rabbit=rabbit1;
    },200);
    function init(){
        ctx.clearRect(0,0,270,500);
        ctx.drawImage(progress1,0, h/2-14,270,14);
        for(var p of imgArr){
            p.onload=function(){
                hasLoad++;
            }
        }
    }
    function run(){
        if(hasLoad==imgArr.length){
            if(rectW<=242.5){
                init();
                rectW+=1.5;
                ctx.drawImage(progress2,0,0,rectW*3,42,0, h/2-14,rectW,14);
                ctx.drawImage(rabbit,rectW-60,h/2-64,50,50);
                ctx.drawImage(cake,rectW-20,h/2-32,50,50);
            }else{
                if(!begin){
                    clearInterval(timer);
                    begin=true;
                    bar.hide();
                    //step1
                    flowerInit();
                    cloudRun();
                    moonCakeRun();
                    song.play();
                    step0.show();
                    step1.show();
                }
            }
        }
    }
    function animloop() {
        run();
        requestAnimFrame(animloop);
    }
})
var loadNum=0;
var clouds=new Image();
clouds.src="img/cloud.png";
var music=new Image();
music.src="img/music_on.png";
var changE1=new Image();
changE1.src="img/changE.png";
// changE1.src="img/changE1.png";
var changE2=new Image();
changE2.src="img/changE2.png";
var changE=changE1;
var rabbit3=new Image();
rabbit3.src="img/rabbit.png";
// rabbit3.src="img/rabbit3.png";
var rabbit4=new Image();
rabbit4.src="img/rabbit4.png";
var rabbit=rabbit3;
var moonCake1 = new Image();
moonCake1.src="img/left.png";
var moonCake2 = new Image();
moonCake2.src="img/right.png";
var moonCake3 = new Image();
moonCake3.src="img/left2.png";
var moonCake4 = new Image();
moonCake4.src="img/right2.png";
var leftCake=moonCake1;
var rightCake=moonCake2;
var qxx=new Image();
qxx.src="img/font.png";
var step1Imgs=[clouds,music,changE1,changE2,rabbit3,rabbit4,moonCake1,moonCake2,moonCake3,moonCake4,qxx];
for(var p of step1Imgs){
    p.onload=function(){
        loadNum++;
    }
}
// part2：花瓣
function flowerInit() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    var webGLRenderer = new THREE.WebGLRenderer({ alpha: true } );
    webGLRenderer.setClearColor('rgba(255,255,255,0)',0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    document.getElementById("flower").appendChild(webGLRenderer.domElement);
    var texture1 =new THREE.ImageUtils.loadTexture("img/flower1.png");
    scene.add(createPointCloud("system1", texture1, 2.5,true,1,true,0xffffff));
    var texture2 =new THREE.ImageUtils.loadTexture("img/flower2.png");
    scene.add(createPointCloud("system1", texture2, 2.5,true,1,true,0xffffff));
    var texture3 =new THREE.ImageUtils.loadTexture("img/flower3.png");
    scene.add(createPointCloud("system1", texture3, 2.5,true,1,true,0xffffff));
    var texture4 =new THREE.ImageUtils.loadTexture("img/flower4.png");
    scene.add(createPointCloud("system1", texture4, 2.5,true,1,true,0xffffff));
    render();
    function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointCloudMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: sizeAttenuation,
            color: color,
            depthTest: false
        });
        var range =20;
        for (var i = 0; i < 2; i++) {
            var particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityZ = (Math.random() - 0.5) / 3;
            geom.vertices.push(particle);
        }
        var system = new THREE.PointCloud(geom, material);
        system.name = name;
        system.sortParticles = true;
        return system;
    }
    function render() {
        scene.children.forEach(function (child) {
            if (child instanceof THREE.PointCloud) {
                var vertices = child.geometry.vertices;
                vertices.forEach(function (v) {
                    v.y = v.y - (v.velocityY);
                    v.x = v.x - (v.velocityX);
                    v.z = v.z - (v.velocityZ);
                    if (v.y <= -40) v.y = 60;
                    if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -0.9;
                    if (v.z <= -10 || v.z >= 20) v.velocityZ = v.velocityZ * -0.9;
                });
            }
        });
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }
}
//part3 云
function cloudRun(){
    var cloud = document.querySelector("#cloud");
    cloud.addEventListener('touchstart',songEvent);
    var ctx = cloud.getContext("2d");
    ctx.scale(2,2);
    var musicAngle=0;
    var x=0;
    function move(){
        if(loadNum==step1Imgs.length){
            ctx.clearRect(0,0,500,400);
            x+=0.1;
            if(x>=w) x=0;
            ctx.drawImage(clouds,x,109,w,198);
            ctx.drawImage(clouds,x-w,109,w,198);
            if(isRotate){
                musicAngle++;
                ctx.save();
                ctx.translate(w-38,38);
                ctx.rotate(musicAngle*Math.PI/180);
                ctx.translate(38-w,-38);
                ctx.drawImage(music,w-64,12,52,52);
                ctx.restore();
            }
        }
    }
    function animloop() {
        move();
        requestAnimFrame(animloop);
    }
    animloop();
}
//part4 月饼
var x=0;
var y=percentY>=1.05?percentY+0.2:percentY-0.1;
var rabbitAngle=-5;
var aspect=0;//顺时针
var cakeX=0;
var hasListen=false;
var hasClick=0;
var timer=setInterval(()=>{
    if(leftCake==moonCake1) leftCake=moonCake3;
    else leftCake=moonCake1;
    if(rightCake==moonCake2) rightCake=moonCake4;
    else rightCake=moonCake2;
    },500);
var msgH=0;
function moonCakeRun(){
    var cake = document.querySelector("#cake");
    cake.addEventListener('touchstart',songEvent);
    var ctx = cake.getContext("2d");
    if(!again){
        ctx.scale(2,2);
        again=true;
    }
    // var timer2=setInterval(()=>{
    //     if(rabbit==rabbit3) rabbit=rabbit4;
    //     else rabbit=rabbit3;
    // },300);
    // var hasClear=false;
    function move(){
        if(loadNum==step1Imgs.length){
            if(x<=68 && !hasListen){
                x+=0.5;
            //嫦娥玉兔飞
                ctx.clearRect(0,0,500,800);
                ctx.drawImage(rabbit,x*percentX,200*percentY,60*percentX,66*percentX);
                ctx.drawImage(changE,w-1.5*x*percentX-144*percentX,140*percentY,144*percentX,192*percentX);
            }else{
            //飞到地方了
                if(msgH<214){
                    msgH++;
                    ctx.clearRect(0,0,500,800);
                    ctx.drawImage(rabbit,68.5*percentX,200*percentY,60*percentX,66*percentX);
                    ctx.drawImage(changE,w-1.5*68.5*percentX-144*percentX,140*percentY,144*percentX,192*percentX);
                    ctx.drawImage(qxx,0,0,72*3,msgH*3,w-41-72,75,72,msgH);
                }else{
                    if(0.1*cakeX*cakeX<120*y){
                        //扔月饼
                            cakeX+=0.4;
                            cakeInit();
                            ctx.drawImage(rabbit,68.5*percentX,200*percentY,60*percentX,66*percentX);
                            ctx.drawImage(changE,w-1.5*68.5*percentX-144*percentX,140*percentY,144*percentX,192*percentX);
                            ctx.drawImage(qxx,w-113,75,72,msgH);
                    }else{
                        //扔完月饼了
                        cakeInit();
                        if(!$(".tips").hasClass('fadeIn')) $(".tips").addClass("fadeIn");
                        if(rabbitAngle<5 && aspect==0){
                            rabbitAngle+=0.1;
                            rabbitRotate();
                        }else{
                            aspect=1;
                            rabbitAngle-=0.1;
                            rabbitRotate();
                            if(rabbitAngle<-5 && aspect==1) aspect=0;
                        }
                        ctx.drawImage(qxx,w-113,75,72,msgH);
                        if(!hasListen){
                            cake.addEventListener('touchstart',function(e){
                                var x=e.touches[0].clientX;
                                var y=e.touches[0].clientY;
                                if(x>=77-cakeX&&x<=77-cakeX+60*percentY&&y>=0.1*cakeX*cakeX+180&&y<=0.1*cakeX*cakeX+180+60*percentY){
                                    console.log("左边第一个月饼被点了！");
                                    hasClick=1;
                                }else if(x>=167-cakeX&&x<=167-cakeX+60*percentY&&y>=0.1*cakeX*cakeX+240&&y<=0.1*cakeX*cakeX+240+60*percentY){
                                    console.log("左边第二个月饼被点了！");
                                    hasClick=2;
                                }else if(x>=97-cakeX&&x<=97-cakeX+60*percentY&&y>=0.1*cakeX*cakeX+300&&y<=0.1*cakeX*cakeX+300+60*percentY){
                                    console.log("左边第三个月饼被点了！");
                                    hasClick=3;
                                }else if(x>=cakeX+w-227&&x<=cakeX+w-227+60*percentY&&y>=0.1*cakeX*cakeX+200&&y<=0.1*cakeX*cakeX+200+60*percentY){
                                    console.log("右边第一个月饼被点了！");
                                    hasClick=4;
                                }else if(x>=cakeX+w-177&&x<=cakeX+w-177+60*percentY&&y>=0.1*cakeX*cakeX+270&&y<=0.1*cakeX*cakeX+270+60*percentY){
                                    console.log("右边第二个月饼被点了！");
                                    hasClick=5;
                                }
                            });
                            hasListen=true;
                        }else{
                            if(hasClick!=0){
                                switch(hasClick)
                                {
                                    case 1:
                                        cakeScale(77-cakeX,0.1*cakeX*cakeX+180,60,moonCake1);
                                        break;
                                    case 2:
                                        cakeScale(167-cakeX,0.1*cakeX*cakeX+240,60,moonCake1);
                                        break;
                                    case 3:
                                        cakeScale(97-cakeX,0.1*cakeX*cakeX+300,90,moonCake1);
                                        break;
                                    case 4:
                                        cakeScale(cakeX+w-227,0.1*cakeX*cakeX+200,60,moonCake2);
                                        break;
                                    case 5:
                                        cakeScale(cakeX+w-177,0.1*cakeX*cakeX+270,80,moonCake2);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function cakeInit(){
        ctx.clearRect(0,0,500,800);
        ctx.drawImage(leftCake,77-cakeX,0.1*cakeX*cakeX+180,60*percentY,60*percentY);
        ctx.drawImage(leftCake,167-cakeX,0.1*cakeX*cakeX+240,60*percentY,60*percentY);
        ctx.drawImage(leftCake,97-cakeX,0.1*cakeX*cakeX+300,90*percentY,90*percentY);
        ctx.drawImage(rightCake,cakeX+w-227,0.1*cakeX*cakeX+200,60*percentY,60*percentY);
        ctx.drawImage(rightCake,cakeX+w-177,0.1*cakeX*cakeX+270,80*percentY,80*percentY);
    }
    function rabbitRotate(){
        ctx.save();
        ctx.translate(98,253);
        ctx.rotate(rabbitAngle*Math.PI/180);
        ctx.translate(-98,-253);
        ctx.drawImage(rabbit,68.5*percentX,200*percentY,60*percentX,66*percentX);
        ctx.translate(w-177,246);
        ctx.rotate(0.001*rabbitAngle*Math.PI/180);
        ctx.translate(177-w,-246);
        ctx.drawImage(changE,w-1.5*68.5*percentX-144*percentX,140*percentY,144*percentX,192*percentX);
        ctx.restore();
    }
    var scaleNum=1;
    var big=true;
    function cakeScale(x,y,w,p){
        if(scaleNum<1.1 && big){
            scaleNum+=0.005;
            var d=(w*percentY*scaleNum*(scaleNum-1)/2);
            ctx.drawImage(p,x-d,y-d,w*percentY*scaleNum,w*percentY*scaleNum);
        }else{
            big=false;
            scaleNum-=0.005;
            var d=(w*percentY*scaleNum*(scaleNum-1)/2);
            ctx.drawImage(p,x-d,y-d,w*percentY*scaleNum,w*percentY*scaleNum);
            if(scaleNum<=1){
                scaleNum=1;
                //step2
                step1.hide();
                console.log(hasClick);
                rabbitAngle=-5;
                aspect=0;//顺时针
                cakeX=0;
                hasListen=false;
                hasClick=0;
                console.log(hasClick);
                x=0;
                big=true;
                msgH=0;
                clearInterval(timer);
                step2.show();
            }
        }

    }
    function animloop() {
        if(step1.css("display")=="block") move();
        requestAnimFrame(animloop);
    }
    animloop();
};
//part5 音乐
var musicPause=$(".music-pause");
function songEvent(e){
    var x=e.touches[0].clientX;
    var y=e.touches[0].clientY;
    if( x>=w-64 && x<=w-12 && y>=12 && y<=64 ){
        if(song.paused){
            song.play();
            isRotate=true;
            musicPause.hide();
        }else{
            song.pause();
            isRotate=false;
            musicPause.show();
        }
    }
}
$(".music-position").click(()=>{
    if(song.paused){
            song.play();
            isRotate=true;
            musicPause.hide();
        }else{
            song.pause();
            isRotate=false;
            musicPause.show();
        }
});
//part6 选月饼
var cakes=$("#moonCakes");
var cards=$("#cards");
var mooncakes=$("#list");
var l=255;
cakes.css("left",(w-l)/2+"px");
var startX=0;
var startY=0;
var tx=0;
var ty=0;
var i=0;
var j=0;
var hasMove=false;
step2[0].addEventListener('touchstart',function(e){
    hasMove=false;
    startX=e.touches[0].clientX;
    startY=e.touches[0].clientY;
});
step2[0].addEventListener('touchmove',function(e){
    hasMove=true;
    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;
    tx = currentX - startX;
    ty = currentY - startY;
});
function cakeEvent(){
    if(hasMove){
        if (Math.abs(tx) > Math.abs(ty)) {
            if (tx < 0) {  //左滑
                if(i<7) i++;
            }else if(tx > 0){ //右滑
                if(i>0) i--;
            }
        cakes.css("left",(w-l)/2-l*i+"px");
        }
    }
}
function cardEvent(){
            if(hasMove){
                if (Math.abs(tx) > Math.abs(ty)) {
                    if (tx < 0) {  //左滑
                        if(j<4) j++;
                    }else if(tx > 0){ //右滑
                        if(j>0) j--;
                    }
                cards.css("left",(w-l)/2-l*j+"px");
                }
            }
}
step2[0].addEventListener('touchend',cakeEvent);
//part7 选贺卡
var clickTimes=0;
$(".btn1").click(()=>{
    clickTimes++;
    if(clickTimes==1){
        mooncakes.css("transition","all 0s");
        cakes.addClass("fadeOut");
        setTimeout(()=>{
            mooncakes.css("top",0);
            console.log("选的是第"+(i+1)+"个月饼");
            i=0;
            l=272;
            cards.css("left",(w-l)/2+"px");
            cakes.hide();
            cards.show();
            step2[0].removeEventListener('touchend',cakeEvent);
            step2[0].addEventListener('touchend',cardEvent);
        },500);
    }else{
        console.log("选的是第"+(j+1)+"个卡片");
        cards.removeClass('fadeIn').addClass('fadeOut');
        //step3
        setTimeout(()=>{
            step2.hide().removeClass("fadeOut");
            step3.show();
            mooncakes.css({"transition":"opacity 1s linear","top":"0.71rem"});
            j=0;
            l=255;
            cakes.removeClass("fadeOut").show().css("left",(w-l)/2+"px");
            cards.removeClass("fadeOut").hide().css("left",(w-l)/2+"px");
            step2[0].removeEventListener('touchend',cardEvent);
            step2[0].addEventListener('touchend',cakeEvent);
            clickTimes=0;
        },1000);
    }
});
//part8 写祝福
var msg = ["张三","李四","王五","赵六","田七","雷老虎"];
var msgArr = msg[Math.floor(Math.random() * (msg.length-1))];
var textarea = $("#textarea");
var $textArea = textarea.val(msgArr);
var inputVal = $('#input').val();
var current = 0;
var preview = $('.preview')
var previewOne=$('.previewOne');
var img1=$(".img1");
var img2=$(".img2");
var bgImg=$('.bgImg');
var oneName=$('.oneName');
$("#refresh").click(function() {
    current = (current+90)%900;
    $('.images').css({
        transform: 'rotate('+current+'deg)',
        transition: 'transform 1s'})
    textarea.val(msg[parseInt(Math.random()*(msg.length-1))]);
})
textarea.keyup(function(){
    $('.max').hide();
    var len = $(this).val().length;
    if(len > 30){
     $(this).val($(this).val().substring(0,30));
    }
});
preview.click(function() {
    var $textArea = textarea.val();
    var inputVal = $('#inputVal').val();
    oneName.html(inputVal);
    $('.one').html($textArea);
    //限制字符个数
    oneName.each(function(){
        var maxwidth=5;
        if($(this).text().length>maxwidth){
        $(this).text($(this).text().substring(0,maxwidth));
        $(this).html($(this).html()+"...");
        }
        bgImg.css({
            transform: "rotateY(-180deg)",
        });
        setTimeout(() =>{
            //图的src换成卡片 rotateY变成180度
            img1.hide();
            img2.show();
           preview.hide();
            previewOne.show();
        },500)
    });
})
$('.back').click(function() {
    bgImg.css({
        transform:'rotateY(0deg)'
    })
    img2.css({
        transform:'rotateY(180deg)'
    })
    setTimeout(() =>{
        //图的src换成卡片 rotateY变成180度
        img2.hide();
        img1.show()
        preview.show();
        previewOne.hide();
    },500)
})
// 生成祝福
var fadeItem=$(".fadeItem");
$(".generate").click(function() {
    fadeItem.addClass('fadeOut');
    setTimeout(()=>{
        step3.hide();
        makeUserImg();
        step4.show();
        fadeItem.removeClass('fadeOut');
        img2.hide();
        img1.show()
        preview.show();
        previewOne.hide();
        bgImg.css({
            transform: "rotateY(0)",
        })
    },1000);
})
$("#makeAgain").click(()=>{
    step4.hide();
    moonCakeRun();
    step1.show();
});
//part9 生成canvas
function makeUserImg(){
    var loaded=0;
    var card=new Image();
    card.src="img/card.jpg";
    var code=new Image();
    code.src="img/code.jpg";
    var cakeImg=new Image();
    cakeImg.src="img/wuren1.png";
    var arr=[card,code,cakeImg];
    for(var p of arr){
        p.onload=loaded++;
    }
    var userCvs = document.querySelector("#userCvs");
    var ctx = userCvs.getContext("2d");
    CanvasRenderingContext2D.prototype.fillTextVertical = function (text, x, y) {
        var context = this;
        var canvas = context.canvas;
        var arrText = text.split('');
        var arrWidth = arrText.map(function (letter) {
            return context.measureText(letter).width;
        });
        var align = context.textAlign;
        var baseline = context.textBaseline;

        if (align == 'left') {
            x = x + Math.max.apply(null, arrWidth) / 2;
        } else if (align == 'right') {
            x = x - Math.max.apply(null, arrWidth) / 2;
        }
        if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
            y = y - arrWidth[0] / 2;
        } else if (baseline == 'top' || baseline == 'hanging') {
            y = y + arrWidth[0] / 2;
        }
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        arrText.forEach(function (letter, index) {
            var letterWidth = arrWidth[index];
            var code = letter.charCodeAt(0);
            context.setTransform(2, 0, 0, 2, 0, 0);
            if (code <= 256) {
                context.translate(x, y);
                context.rotate(90 * Math.PI / 180);
                context.translate(-x, -y);
            } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
                y = y + arrWidth[index-1] / 2;
            }
            context.fillText(letter, x, y);
            var letterWidth = arrWidth[index];
            y = y + letterWidth+5;
        });
        context.textAlign = align;
        context.textBaseline = baseline;
    };
    var t=setInterval(()=>{
        if(loaded==3){
            ctx.scale(2,2);
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(270, 0);
            ctx.arc(270, 10, 10, 1.5 * Math.PI, 0);
            ctx.lineTo(280,363);
            ctx.arc(270,363, 10, 0, 0.5 * Math.PI);
            ctx.lineTo(10, 373);
            ctx.arc(10, 363, 10, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(0, 10);
            ctx.arc(10, 10, 10, Math.PI, 1.5 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(card,0,0,280,373);
            ctx.fillStyle="#FFF299";
            ctx.font = '12px Microsoft Yahei';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillTextVertical('hello,中秋节快乐！',264,16);
            ctx.drawImage(cakeImg,280-14-92,373-14-92,92,92);
            ctx.drawImage(code,15,373-15-57,57,57);
            clearInterval(t);
        }
    },100);

}
//part10 保存图片
var timeOutEvent = null;
var userImgX = null;
var userImgY = null;
$(".userImg").on({
    touchstart: function(e){
        console.log(e)
        userImgX = e.originalEvent.changedTouches[0].clientX;
        userImgY = e.originalEvent.changedTouches[0].clientY;
        timeOutEvent = setTimeout("longPress()",500);
        e.preventDefault();
    },
    touchmove: function(e){
        console.log("touchMove")
         if(e.clientX-userImgX>50 || e.clientY -userImgY>50) clearTimeout(timeOutEvent);
    },
     touchend: function(){
         console.log("touchEnd")
        clearTimeout(timeOutEvent);
    }
 })
// 取消保存
$('.clearImg').on({
    touchstart: function(e){
       $('.step5').hide()
    },
    touchmove: function(){
        clearTimeout(timeOutEvent);
    },
    touchend: function(){
        clearTimeout(timeOutEvent);
    }
})
function longPress(){
    console.log("长按啦...");
    $('.step5').show();
}
//part11 手机返回事件
var stepArr = ["step1", "step2", "step3", "step4"]

$(function(){
    pushHistory();

    window.addEventListener("popstate", function(e) {
        stepArr.forEach(item=>{
            // debugger
            if(!$('.'+item).is(':hidden')){
                console.log(item)
                switch (item) {
                    case 'step1':
                        closeWindow()
                        break;
                    case 'step2':
                        step1.show();
                        step2.hide();
                        break;
                    case 'step3':
                        step2.show();
                        step3.hide();
                        break;
                    case 'step4':
                        step3.show();
                        step4.hide();
                        break;
                    default:
                        break;
                }
            }
        })
    }, false);
    function closeWindow(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {

            WeixinJSBridge.call('closeWindow'); //微信
        } else if(ua.indexOf("alipay")!=-1){
            AlipayJSBridge.call('closeWebview'); //支付宝
        }else if(ua.indexOf("baidu")!=-1){
            BLightApp.closeWindow(); //百度
        }else{
            window.close(); //普通浏览器
        }
    }
    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState({page:1},null, "#qiphon");
    }
});