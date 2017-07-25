<!doctype HTML>
<html>
<head>
<meta charset="utf-8" />
<title>详情页</title>
<style>

body {
font-family: Tahoma;
font-size: 10pt;
/*line-height: 170%;*/
padding-top: 10px;
margin:0px;
}
/*------------------------------------------------------------侧边导航*/
nav {
background: gray;
color: white;
text-decoration: none;
overflow-x: hidden;
overflow-y: auto;
position: fixed;
top: 0;
left: 0;
bottom: 0;
width: 200px;
}
nav a {
	text-decoration: none;
	color: white;
}
/*-------------------------------------------------------------标头*/
@keyframes move {
	0% {
		text-shadow: 5px 0px 3px rgba(0,0,0,0.5);
		transform: perspective(2000px) rotateY(0deg);
	}
	25% {
		text-shadow: 20px 0px 5px rgba(0,0,0,.3);
		transform: perspective(2000px) rotateY(40deg);
	}
	50% {
		text-shadow: 5px 0px 5px rgba(0,0,0,.5);
		transform: perspective(2000px) rotateY(0deg);
	}
	75% {
		text-shadow: -20px 0px 5px rgba(0,0,0,.3);
		transform: perspective(2000px) rotateY(-40deg);
	}
	100% {
		text-shadow: 5px 0px 3px rgba(0,0,0,0.5);
		transform: perspective(2000px) rotateY(0deg);
	}
}

@keyframes moveX {
	0% {
		text-shadow: 0px 0px 3px rgba(0,0,0,0.5);
		transform: perspective(2000px) rotateX(0deg);
	}
	25% {
		text-shadow: 0px 10px 5px rgba(0,0,0,.3);
		transform: perspective(2000px) rotateX(30deg);
	}
	50% {
		text-shadow: 0px 0px 5px rgba(0,0,0,.5);
		transform: perspective(2000px) rotateX(0deg);
	}
	75% {
		text-shadow: 0px 10px 5px rgba(0,0,0,.3);
		transform: perspective(2000px) rotateX(-30deg);
	}
	100% {
		text-shadow: 0px 0px 3px rgba(0,0,0,0.5);
		transform: perspective(2000px) rotateX(0deg);
	}
}


header {
padding-top: 10px;
padding-left: 220px;
font-size: 18px;
position: absolute;
/*margin-bottom:30px;*/
text-shadow: 5px 0px 3px rgba(0,0,0,.3);
color: black;
}

header h1 {
	
	margin:0px;
	padding: 0px;
	animation: move 6s forwards infinite;
}
/*----------------------------------------------------------主题*/
article {
margin-top: 80px;
padding-left: 220px;
}

@keyframes imgMoveOver {
	0% {
		/*text-shadow: 5px 5px 3px rgba(0,0,0,0.5);*/
		transform: scale(1) ;
	}
	100% {
		/*text-shadow: 5px 5px 3px rgba(0,0,0,0.5);*/
		/*transform: perspective(2000px) rotateY(30deg);*/
		transform: scale(1.01) translateY(-2%);
	}
}

@keyframes imgMoveOut {
	0% {
		/*text-shadow: 5px 5px 3px rgba(0,0,0,0.5);*/
		
		transform: scale(1.1) translateY(-5%);
	}
	100% {
		/*text-shadow: 5px 5px 3px rgba(0,0,0,0.5);*/
		/*transform: perspective(2000px) rotateY(30deg);*/
		transform: scale(1) ;
	}
}

img {
	/*position: relative;*/
	width: 900px;
	border-width: 5px;
	border-style: solid;
	border-color: Orange;
	transform-origin:left top;
}
img:hover {
	animation: imgMoveOver 0.5s forwards;
}
/*段落*/
h3,h4{
	/*background-color: rgba(0,0,0,.3);*/
	background-image: linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.2) 75%, white 100%);
/*	width: 500px;*/
	color: white;
	font-size: 22px;
	padding-left: 10px;
}
h4{
	width: 50%;
	font-size: 18px;
	margin-left: 5px;
}
pre {
	background-color: black;
}
pre code {
	color: yellow;
	font-size: 16px;
	font-weight: 500;
}
/*---------------------------------------------------------底部*/
footer {
padding-top: 10px;
padding-left: 220px;
padding-bottom: 10px;
background-color: black;
color: white;
}
footer h3 {
	color: white;
	background-color:transparent;
	background-image: linear-gradient(to right, black 0%,  black 100%);
}
</style>
</head>
<body>

<nav>
<x-index />
</nav>

<header>
<x-markdown src="section/00_header.md" />
</header>

<article>
<x-markdown src="section/01_body.md" />
</article>
<footer>
<x-markdown src="section/99_footer.md" />
</footer>
</body>

<script>
	var div = document.createElement("div"); 
	var body = document.getElementsByTagName('body')[0];
	console.log(body);
div.id = 'back_index';	
div.style.width = '200px';
div.style.height = '200px';
div.style.backgroundImage = "url(./back_index.png)";
div.style.backgroundSize = 'cover';
div.style.position = 'fixed';
div.style.left = '0px';
div.style.bottom = '20px';
body.appendChild(div);
document.write(div);
div.onmouseover = function () {
	/* body... */
	div.style.animation = 'imgMoveOver 0.5s forwards';
};
div.onmouseout = function () {
	/* body... */
	div.style.animation = 'imgMoveOut 0.5s forwards';
};
div.onclick = function () {
	/* body... */
	window.location.href = "https://zc3hd.github.io/";
};

</script>

</html>