let data = {
	coins: 0,
	prestiges: (()=>{
		let a=[];
		for (let x = 0; x < 10; x++) {
			a[x] = [];
			for (let y = 0; y < 10; y++) {
				a[x][y] = 0;
			}
		}
		return a;
	})()
};

let names = [
	"nano",
	"micro",
	"mini",
	"small",
	"partial",
	"full",
	"multi",
	"hyper",
	"ultra",
	"final"
];

let descriptions;

function getGain() {
	let gain = 1;
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			gain *= data.prestiges[x][y]+1;
		}
	}
	return gain;
}

function getRequirement(x,y) {
	if (x===0 && y===0) {
		return Math.floor(Math.pow(1.5,data.prestiges[0][0])*10);
	} else {
		return (x+y+2)*(data.prestiges[x][y]+1);
	}
}

function canActivatePrestige(x,y) {
	if (x===0 && y===0) {
		return (data.coins >= getRequirement(x,y));
	} else if (x===0) {
		return (data.prestiges[0][y-1] >= getRequirement(x,y));
	} else if (y===0) {
		return (data.prestiges[x-1][0] >= getRequirement(x,y));
	} else {
		return (data.prestiges[x-1][y] >= getRequirement(x,y)) && (data.prestiges[x][y-1] >= getRequirement(x,y));
	}
}

function activatePrestige(x,y) {
	console.log(x,y);
	if (canActivatePrestige(x,y)) {
		data.coins = 0;
		for (let i = 0; i <= x; i++) {
			for (var j = 0; j <= y; j++) {
				if (!(i === x && j === y)) {
					data.prestiges[i][j] = 0;
				}
			}
		}
		data.prestiges[x][y]++;
		updateDescriptions();
		draw();
	}
}

function update() {
	data.coins += getGain();
	localStorage.QUADRATIC_SHITPOST = JSON.stringify(data);
}

function draw() {
	document.getElementById("coins").innerHTML = data.coins;
	document.getElementById("gain").innerHTML = getGain();
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			let btn = document.getElementById("tier"+i+j);
			btn.innerHTML = "Tier("+i+","+j+")\nx0"
		}
	}
}

function updateDescriptions() {
	descriptions = (()=>{
		let a=[];
		for (var x = 0; x < 10; x++) {
			a[x] = [];
			for (var y = 0; y < 10; y++) {
				a[x][y] = "Tier("+x+","+y+"): "+names[i]+names[j]+"prestige\nPrestige requirements:";
				if (x===0 && y===0) {
					a[x][y] += "\n" + getRequirement(x,y) + " coins";
				}
				if (x!==0) {
					a[x][y] += "\n" + getRequirement(x,y) +" of tier("+(x-1)+","+y+")";
				}
				if (y!==0) {
					a[x][y] += "\n" + getRequirement(x,y) +" of tier("+x+","+(y-1)+")";
				}
			}
		}
		return a;
	})()
}

window.addEventListener("load",function () {
	if (localStorage.QUADRATIC_SHITPOST) {
		data = JSON.parse(localStorage.QUADRATIC_SHITPOST)
	}
	let table = document.getElementById("buyables");
	for (let i = 0; i < 10; i++) {
		let tr = document.createElement("tr");
		for (let j = 0; j < 10; j++) {
			let td = document.createElement("td");
			let btn = document.createElement("button");
			btn.id = "tier"+i+j;
			btn.addEventListener("click", ((x,y)=>{return (()=>{activatePrestige(x,y);})})(i,j));
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
