var data = {
	coins: 0,
	prestiges: (()=>{
		let a=[];
		for (var x = 0; x < 10; x++) {
			a[x] = [];
			for (var y = 0; y < 10; y++) {
				a[x][y] = 0;
			}
		}
		return a;
	})()
};

function getGain() {
	var gain = 1;
	data.prestiges.forEach(function (el) {
		gain *= 1+el;
	})
	return gain;
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor((((10)+(10+Math.pow(data.prestiges[0],1.05)))/2)*(data.prestiges[0]+1));
	} else {
		return (id+1)*(data.prestiges[id]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (data.coins >= getRequirement(0));
	} else {
		return (data.prestiges[id-1] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			data.coins = 0;
			for (var i = 0; i < id; i++) {
				data.prestiges[i] = 0;
			}
			data.prestiges[id]++;
	}
	draw();
}

function update() {
	data.coins += getGain();
	localStorage.QUADRATIC_SHITPOST = JSON.stringify(data);
}

function draw() {
	document.getElementById("coins").innerHTML = data.coins;
	document.getElementById("gain").innerHTML = getGain();
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			let btn = document.getElementById("tier"+i+j);
			btn.innerHTML = "Tier("+i+","+j+")\nx0"
		}
	}
}

window.addEventListener("load",function () {
	// if (localStorage.QUADRATIC_SHITPOST) {
	// 	data = JSON.parse(localStorage.QUADRATIC_SHITPOST)
	// }
	let table = document.getElementById("buyables");
	for (var i = 0; i < 10; i++) {
		let tr = document.createElement("tr");
		for (var j = 0; j < 10; j++) {
			let td = document.createElement("td");
			let btn = document.createElement("button");
			btn.id = "tier"+i+j;
			td.appendChild(btn);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	draw();
	setInterval(function () {
		update();
		draw();
	}, 1000);
	console.log("interval loaded")
})
