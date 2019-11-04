// class CytusFake{
//     static time = 0;
//     constructor(){
//         CytusFake.time = 0;// unit: second
//     }
//     update(){
//         CytusFake.time += 1/60;
//     }
// }

class Circ{
    constructor(col, posY, startTime){
        this.col = col;
        this.posY = posY;
        this.startTime = startTime;
        this.radius = 20;
        this.opacity = 1;
        this.success = false;
        this.hit_time = -1;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(50 + 100*(this.col-1), this.posY, this.radius, 0, 2*Math.PI);
        switch (this.col){
            case 1:
                ctx.fillStyle = 'red';
                break;
            case 2:
                ctx.fillStyle = 'green';
                break;
            case 3:
                ctx.fillStyle = 'dodgerblue';
                break;
            case 4:
                ctx.fillStyle = 'white';
                break;
            case 5:
                ctx.fillStyle = 'white';
                break;
            case 6:
                ctx.fillStyle = 'dodgerblue';
                break;
            case 7:
                ctx.fillStyle = 'green';
                break;
            case 8:
                ctx.fillStyle = 'red';
                break;
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(50 + 100*(this.col-1), this.posY, 2, 0, 2*Math.PI);
        // if (this.col < 5){
        //     ctx.fillStyle = 'black';
        // } else{
        //     ctx.fillStyle = 'white';
        // }
        // ctx.fill();
    }
    draw_success(ctx){
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "orange";
        ctx.fillText("Good", 50 + 100*(this.col-1), this.posY);
    }
    draw_miss(ctx){
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Miss", 50 + 100*(this.col-1), this.posY);
    }
    colToKey(key){
        switch (key){
            case 1: return "A";
            case 2: return "S";
            case 3: return "D";
            case 4: return "F";
            case 5: return "J";
            case 6: return "K";
            case 7: return "L";
            case 8: return ";";
        }
    }
}

// Main Class
class CircList{
    constructor(ctx, max_time, audio = null){
        this.max_time = max_time;
        this.WIDTH = 800;
        this.HEIGHT = 500;
        this.baseline = new Baseline(-5, 50, this.HEIGHT - 50, this.WIDTH);
        this.list = [];
        this.init_list = [];
        this.trash = [];
        this.ctx = ctx;
        this.ctx.textAlign = "center";
        this.time = 0;
        // this.dict = {"1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": []};
        this.score = 0;
        this.run = false;
        this.CIRC_DURATION = 0.8; // duration of a circle, unit: second
        this.CIRC_FADE = 1;
        this.CIRC_RADIUS_MAX = 50;
        this.CIRC_RADIUS_MIN = 20;
        this.dr = (this.CIRC_RADIUS_MAX - this.CIRC_RADIUS_MIN)/(this.CIRC_DURATION*60);
        this.debug = false;
        this.combo = 0;
        this.max_combo = 0;
        this.max_num = 100;
        this.audio = audio;
        this.timeline = [];
        this.name = "default";
        this.showKey == false;
    }
    remove(index){
        this.list.splice(index, 1);
    }

    add(tInit, col){
        // expected y position of baseline when it starts to leave the circle
        var v = this.baseline.get_state(tInit)["v"];
        var posY_leave = this.baseline.get_state(tInit)["posY"] + v * this.CIRC_DURATION * 60;
        var posY;
        // baseline initially going down && finally crossing the bottom line
        if (posY_leave > this.baseline.bottom){
            posY = this.baseline.bottom - (posY_leave - this.baseline.bottom) + this.CIRC_RADIUS_MAX;
        }
        // baseline initially going up && finally crossing the top line
        else if (posY_leave < this.baseline.top){
            posY = this.baseline.top + (this.baseline.top - posY_leave) - this.CIRC_RADIUS_MAX;
        }
        else{
            if (v > 0){
                posY = posY_leave - this.CIRC_RADIUS_MAX;
            } else if(v < 0){
                posY = posY_leave + this.CIRC_RADIUS_MAX;
            }
        }
        // if ((this.baseline.top <= posY) && (posY <= this.baseline.bottom)){
        try {
            var circ = new Circ(col, posY, tInit);
            this.list.push(circ);
            this.init_list.push(circ);
            return true;
        }
        catch (error){
            alert(error);
            return false;
        }
        // }
    }
    doDebug(){
        document.getElementById("baseline-posY").innerHTML = this.baseline.posY.toString();
        document.getElementById("baseline-v").innerHTML = this.baseline.v.toString();
        document.getElementById("num_circles").innerHTML = this.init_list.length.toString();
        document.getElementById("num_circles_alive").innerHTML = this.list.length.toString();
        document.getElementById("num_circles_dead").innerHTML = this.trash.length.toString();
        document.getElementById("baseline-posY-calc").innerHTML = this.baseline.get_state(this.time)["posY"].toString();
        document.getElementById("baseline-v-calc").innerHTML = this.baseline.get_state(this.time)["v"].toString();
    }
    draw(){
        for (var i = 0; i < this.list.length; i++){
            var circle = this.list[i];
            if (circle.startTime <= this.time){
                circle.draw(this.ctx);
                if (this.showKey){
                    this.ctx.font = "25px Comic Sans MS";
                    this.ctx.fillStyle = "yellow";
                    this.ctx.fillText(circle.colToKey(circle.col), 50 + 100*(circle.col-1), circle.posY + 7);
                }
            }
        }
        this.trash.forEach(function(circ){
            if (this.time - circ.hit_time < 0.5){
                if (circ.success){
                    circ.draw_success(this.ctx);
                } else{
                    circ.draw_miss(this.ctx);
                }
            }
        }, this);
        // for (var j = 0; j < this.fade_list.length; j++){
        //     var circle_fade = this.fade_list[j];
        //     circle_fade.draw(this.ctx);
        // }
        this.baseline.draw(this.ctx);
        if (this.debug){
            this.doDebug();
        }
        document.getElementById("score").innerHTML = (100 * this.score/this.max_num).toFixed(2).toString();
        document.getElementById("combo").innerHTML = this.combo.toString();
        document.getElementById("max-combo").innerHTML = this.max_combo.toString();
    }
    update(){
        if (this.time < this.max_time){
            this.baseline.update(this.time);
            for (var i = 0; i < this.list.length; i++){
                var circle = this.list[i];
                if (circle.startTime <= this.time){
                    if (circle.radius < this.CIRC_RADIUS_MAX){
                        circle.radius += this.dr;
                    }  else{
                        this.missed(i);
                    }
                }
            }
            // for (var j = 0; j < this.fade_list.length; j++){
            //     var circle_fade = this.fade_list[j];
            //     if (circle_fade.opacity > 0){
            //         circle_fade.opacity -= 0.02;
            //     } else{
            //         this.fade_list.splice(j, 1);
            //     }
            // }
            if (this.combo > this.max_combo){
                this.max_combo = this.combo;
            }
            this.time += 1/60;
        } else{
            this.run = false;
            this.audio.pause();
            document.getElementById("btn-start").innerHTML = "START";
            if (100 * this.score/this.max_num < 50){
                this.showAnimation("cry.gif", 1500);
            } else if (100 * this.score/this.max_num < 90) {
                this.showAnimation("try_again.gif", 1500);
            } else {
                this.showAnimation("good.gif", 1500);
            }
        }
    }
    set_time(time){
        this.time = time;
        this.list = [];
        this.trash = [];
        this.init_list.forEach(function(circ){
            if ((circ.startTime <= time) && (time <= circ.startTime + this.CIRC_DURATION)){
                circ.radius = this.CIRC_RADIUS_MIN + 60 * (time - circ.startTime) * this.dr;
                // alert("minimum radius: " + this.CIRC_RADIUS_MIN + ", time: " + time + ", this.dr: " + this.dr);
                this.list.push(circ);
            } else if (circ.startTime > time){
                circ.radius = this.CIRC_RADIUS_MIN;
                this.list.push(circ);
            } else{
                this.trash.push(circ);
            }
        }, this);
        this.baseline.posY = this.baseline.get_state(time)["posY"];
        this.baseline.v = this.baseline.get_state(time)["v"];
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.ctx.width, this.ctx.height);
        this.draw();
        draw_CytusFake();
    }
    restart(){
        this.score = 0;
        this.combo = 0;
        this.max_combo = 0;
        this.set_time(0);
        this.run = false;
        this.audio.resetSource();
    }
    missed(i){
        this.list[i].success = false;
        this.list[i].hit_time = this.time;
        this.trash.push(this.list[i]);
        this.remove(i);
        this.combo = 0;
    }
    keyToCol(key){
        switch (key){
            case "A": return 1;
            case "S": return 2;
            case "D": return 3;
            case "F": return 4;
            case "J": return 5;
            case "K": return 6;
            case "L": return 7;
            case "Semicolon": return 8;
        }
    }
    keyEvent(key){
        if (this.run === true){
            var missPressed = [];
            for (var i = 0; i < this.list.length; i++){
                var circle = this.list[i];
                if (this.time < circle.startTime){
                    continue;
                } else{
                    if (circle.col === this.keyToCol(key)){
                        // if hit the earliest circle
                        if (circle.posY - circle.radius <= this.baseline.posY && this.baseline.posY <= circle.posY + circle.radius){
                            this.score += 1;
                            circle.success = true;
                            circle.hit_time = this.time;
                            this.combo += 1;
                            this.trash.push(circle);
                            this.remove(i);
                            missPressed = [];
                            break;
                        }
                    } else{
                        if (circle.posY - circle.radius <= this.baseline.posY && this.baseline.posY <= circle.posY + circle.radius && missPressed.length === 0){
                            missPressed.push(i);
                        }
                    }
                }
            }
            if (missPressed.length > 0){
                this.missed(missPressed[0]);
            }
        }
    }

    touchEvent(x, y){
        // alert("this.time: " + this.time);
        if (this.run === true){
            for (var i = 0; i < this.list.length; i++){
                var circle = this.list[i];
                if (this.time < circle.startTime){
                    continue;
                } else{
                    var cX = 50 + (circle.col - 1) * 100;
                    var cY = circle.posY;
                    if (Math.pow(cX - x, 2) + Math.pow(cY - y, 2) <= Math.pow(circle.radius, 2)){
                        this.score += 1;
                        circle.success = true;
                        circle.hit_time = this.time;
                        this.combo += 1;
                        this.trash.push(circle);
                        this.remove(i);
                        break;
                    }
                }

            }
        }
    }

    randInit(num, sel){
        var len = sel.length;
        this.max_time = 102;
        this.max_num = 100 * num;
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < num; j++){
                this.add(i + j/num, sel[Math.floor(Math.random() * len)]);
            }
        }
    }
    init(l, max_time, delay = 0){
        this.init_list = [];
        this.list = [];
        this.trash = [];
        l.forEach(function(item){
            this.add(item[0] + delay - this.CIRC_DURATION + this.CIRC_RADIUS_MAX/Math.abs(this.baseline.v * 60), item[1]);
        }, this);
        this.max_num = this.init_list.length;
        this.timeline = l;
        this.max_time = max_time;
    }

    // search the indices in this.timeline that matches the specified column and time
    search_timeline(col = -1){
        var tempStr = "";
        for (var i = 0; i < this.init_list.length; i++){
            var circle = this.init_list[i];
            if (circle.startTime <= this.time && this.time <= circle.startTime + this.CIRC_DURATION && (col === -1 || circle.col === col)){
                if (circle.posY - circle.radius <= this.baseline.posY && this.baseline.posY <= circle.posY + circle.radius){
                    tempStr += ", <span style=\"color:yellow;\">[" + this.timeline[i][0] + ", " + this.timeline[i][1] + "]" + "</span>";
                    // alert("this.time: " + this.time + ", circle.startTime: " + circle.startTime + ", circle.posY: " + circle.posY);
                } else{
                    tempStr += ", [" + this.timeline[i][0] + ", " + this.timeline[i][1] + "]";
                }
            } else{
                tempStr += ", [" + this.timeline[i][0] + ", " + this.timeline[i][1] + "]";
            }
        }
        if (tempStr !== ""){
            tempStr = tempStr.slice(2);
        }
        return "[" + tempStr + "]";
    }

    showAnimation(type, duration){
        var el = document.createElement("img");
        el.setAttribute("style","width:200px;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);");
        el.src = "resources/" + type;
        setTimeout(function(){
            el.parentNode.removeChild(el);
        },duration);
        document.body.appendChild(el);
    }
}


class Baseline{
    constructor(velocity, top, bottom, width){
        this.top = top;
        this.bottom = bottom;
        this.width = width;
        this.height = this.bottom - this.top;
        this.posY = bottom;
        this.v = velocity;
        this.INIT_V = velocity;
    }
    draw(ctx){
        ctx.fillStyle = "yellow";
        ctx.fillRect(0, this.posY, this.width, 3);
        //draw vertical lines between different columns
        // for (var i = 1; i <= 7; i++){
        //     if (i === 3 || i=== 5){
        //         ctx.fillStyle = "blue";
        //     } else if (i === 4){
        //         ctx.fillStyle = "yellow";
        //     }
        //     else{
        //         ctx.fillStyle = "green";
        //     }
        //     ctx.fillRect(800 / 8 * i, 0, 1, 500);
        // }
        ctx.fillStyle = "yellow";
        ctx.fillRect(400, 0, 1, 500);

        // ctx.moveTo(0, this.posY);
        // ctx.lineTo(800, this.posY);
        // ctx.stroke();
    }
    // update(){
    //     if (this.v > 0){
    //         if (this.posY + this.v > this.bottom){
    //             this.v *= -1;
    //         } else{
    //             this.posY += this.v;
    //         }
    //     } else if (this.v < 0){
    //         if (this.posY + this.v < this.top){
    //             this.v *= -1;
    //         } else{
    //             this.posY += this.v;
    //         }
    //     }
    // }
    update(time){
        this.posY = this.get_state(time)["posY"];
        this.v = this.get_state(time)["v"];
    }
    get_state(time){
        var n = Math.floor(time * 60 * Math.abs(this.v) / this.height);
        var v;
        if (n % 2 === 1){
            v = Math.abs(this.v);
            return {"posY": (time * 60 - n * this.height / Math.abs(this.v)) * v + (500 - this.height)/2, "v": v};
        } else{
            v = - Math.abs(this.v);
            return {"posY": this.height + (time * 60 - n * this.height / Math.abs(this.v)) * v + (500 - this.height)/2, "v": v};
        }
    }
}

var canvas_CytusFake = document.getElementById("canvas_CytusFake");
var ctx_CytusFake = canvas_CytusFake.getContext("2d");
var dt = 0.7;
var delay = - 0.4;
var fadeAway = [[0.63, 1], [1.33, 2], [2, 3], [2.73, 4], [3.23, 5], [4.12, 5], [4.63, 5], [5.33, 5], [5.83, 1], [6.7, 2], [7.23, 3], [8, 4], [8.63, 5], [9.34, 6], [10, 7], [10.65, 8], [11.33, 1], [12.03, 2], [12.63, 3], [13.33, 4], [11.33, 5], [12.03, 6], [12.63, 7], [13.33, 8], [14, 1], [14.1, 2], [14.2, 3], [14.3, 4], [14.8, 5], [14.9, 6], [15, 7], [15.1, 8], [15.63, 1], [15.63, 2], [15.63, 3], [15.63, 4], [15.63, 5], [15.63, 6], [16.33, 1], [16.33, 2], [16.33, 3], [16.33, 4], [16.33, 7], [16.33, 8], [17.03, 1], [17.03, 2], [17.03, 3], [17.03, 4], [17.03, 5], [17.13, 6], [17.38, 7], [17.73, 1], [17.73, 2], [17.73, 3], [17.73, 4], [17.73, 8], [19.3, 4], [19.5, 3], [20, 8], [20.2, 4], [20.4, 7], [20.6, 4], [20.8, 8], [21, 4], [21.1, 7], [21.4, 4], [22.5, 5], [22.7, 3], [22.9, 5], [23.1, 3], [23.3, 5], [23.5, 3], [23.7, 5], [24, 3], [25, 3], [25, 6], [25.5, 3], [25.5, 6], [26, 3], [26, 6], [26.5, 3], [26.5, 6], [27, 1], [27, 8], [27.5, 2], [27.5, 7], [28, 3], [28, 6], [28.5, 4], [28.5, 5], [29.5, 4], [29.5, 5], [30, 2], [30.1, 8], [30.3, 3], [30.5, 6], [30.6, 1], [30.8, 7], [30.9, 7], [31, 7], [31.1, 7], [31.4, 2], [31.5, 2], [31.6, 2], [31.7, 2], [31.5, 5], [31.6, 5], [31.7, 5], [31.8, 5], [32.6, 2], [32.6, 5], [32.7, 2], [32.7, 5], [33.4, 4], [33.4, 7], [33.5, 4], [33.5, 7], [34.2, 4], [34.2, 5], [34.3, 4], [34.3, 5], [35, 2], [35, 7], [35.1, 2], [35.1, 7], [35.5, 4], [35.5, 5], [35.6, 4], [35.6, 5], [36.3, 3], [36.3, 6], [36.4, 3], [36.4, 6], [36.9, 2], [36.9, 7], [37, 2], [37, 7], [37.6, 1], [37.6, 8], [37.7, 1], [37.7, 8], [38.2, 2], [38.2, 5], [38.3, 2], [38.3, 5], [38.9, 4], [38.9, 7], [39, 4], [39, 7], [39.6, 4], [39.6, 5], [39.7, 4], [39.7, 5], [40.3, 2], [40.3, 7], [40.4, 2], [40.4, 7], [41, 4], [41, 5], [41.1, 4], [41.1, 5], [41.7, 3], [41.7, 6], [41.8, 3], [41.8, 6], [42.4, 2], [42.4, 7], [42.5, 2], [42.5, 7], [42.9, 1], [42.9, 8], [43, 1], [43, 8], [43.7, 3], [44, 2], [44, 6], [44.3, 4], [44.5, 7], [45, 3], [45.4, 2], [45.5, 8], [45.6, 3], [45.6, 6], [45.8, 2], [46, 3], [46, 6], [46.2, 3], [46.4, 4], [46.4, 7], [46.6, 3], [46.8, 4], [46.8, 7]];

// Initialize the game
var level = {"simple": 1, "ordinary": 2, "hard": 3, "nightmare": 4, "hell": 6};
circList = new CircList(ctx_CytusFake, 54, audio);
// circList.randInit(level["simple"]);

circList.init(fadeAway, 54, 0);
circList.name = "Faded";



function draw_CytusFake(run = false){
    // clear the canvas
    // ctx_CytusFake.clearRect(0, 0, canvas_CytusFake.width, canvas_CytusFake.height);
    ctx_CytusFake.fillStyle = "black";
    ctx_CytusFake.fillRect(0, 0, canvas_CytusFake.width, canvas_CytusFake.height);

    circList.draw();
    document.getElementById("slider").value = circList.time * (1000/circList.max_time);
    document.getElementById("time_indication").innerHTML = circList.time.toFixed(2).toString();
    if (run){
        // updaate
        circList.update();
        requestAnimationFrame(function(){
            draw_CytusFake(circList.run);
        });
    }
}
draw_CytusFake();
// listen to key pressing
document.addEventListener('keydown', function(event) {
    if (event.code == "KeyA"){
        circList.keyEvent("A");
    } else if (event.code == "KeyS"){
        circList.keyEvent("S");
    } else if (event.code == "KeyD"){
        circList.keyEvent("D");
    } else if (event.code == "KeyF"){
        circList.keyEvent("F");
    } else if (event.code == "KeyJ"){
        circList.keyEvent("J");
    } else if (event.code == "KeyK"){
        circList.keyEvent("K");
    } else if (event.code == "KeyL"){
        circList.keyEvent("L");
    } else if (event.code == "Semicolon"){
        circList.keyEvent("Semicolon");
    } else if (event.code == "KeyP" || event.code == "KeyQ"){
        event.preventDefault();
        // alert(audio.duration);
        if (circList.run === false && circList.time < circList.max_time){
            audio.play();
            circList.run = true;
            draw_CytusFake(true);
        }
        else {
            circList.run = false;
            audio.pause();
        }
    } else if (event.code == "KeyN"){
        circList.restart();
        document.getElementById("slider").value = 0;
    } else if (event.code == "KeyY"){
        circList.showKey = !circList.showKey;
        circList.draw();
    }
    // else if (event.code == "ArrowRight"){
    //     if (!($("#timeline").is(':focus'))){
    //         event.preventDefault();
    //         if (circList.time + 3 < circList.max_time){
    //             circList.set_time(circList.time + 3);
    //             audio.resetSource();
    //             audio.play(circList.time + 3);
    //         }
    //     }
    // } else if (event.code == "ArrowLeft"){
    //     if (!($("#timeline").is(':focus'))){
    //         event.preventDefault();
    //         if (circList.time - 3 >= 0){
    //             circList.set_time(circList.time - 3);
    //             audio.resetSource();
    //             audio.play(circList.time - 3);
    //         }
    //     }
    // if (circList.trash.length > 0){
    //     circList.set_time(circList.trash[circList.trash.length-1].startTime);
    // }
    // }
    else if (event.code == "KeyC"){
        if (!($("#timeline").is(':focus'))) {
            document.getElementById("timeline").innerHTML = circList.search_timeline(1);
        }
    }
});

document.getElementById("timeline").addEventListener("keydown", function(event){
    if (event.ctrlKey && (event.key === "Enter")){
        add();
    } else if (event.key === "Escape"){
        this.blur();
    }
});

function change_level(s){
    circList.set_time(0);
    circList.run = false;
    circList.list = [];
    circList.init_list = [];
    circList.trash = [];
    if (s === "simple" || s === "ordinary"){
        circList.randInit(level[s],[1,2,3,4,5,6,7,8]);
    } else if(s === "hard"){
        circList.randInit(level[s],[2,3,4,5,6,7]);
    } else if(s === "nightmare"){
        circList.randInit(level[s],[5,6,7,8]);
    } else{
        circList.randInit(level["nightmare"],[1,2,3,4,5,6,7,8]);
    }
    circList.max_time = 102;

    audio.pause();
    circList.audio = audio;
    circList.restart();
    document.getElementById("current-level").innerHTML = s;
}
function add(){
    var arr = JSON.parse(stripHtml(document.getElementById("timeline").innerHTML));
    circList.init(arr, 50);
    circList.set_time(circList.time);
    tempAlert("Updated!", 2000);
}
function cheat(){
    var cheat = document.getElementById("btn-cheat");
    if (cheat.innerHTML === "turn on cheat mode"){
        cheat.innerHTML = "turn off cheat mode";
        document.getElementById("div-cheat").style.display = "block";
    } else{
        cheat.innerHTML = "turn on cheat mode";
        document.getElementById("div-cheat").style.display = "none";
    }
}



// touch screen
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    tempList = [];
    for (var i = 0; i < touchEvent.touches.length; i++){
        try{
            tempList.push([touchEvent.touches[i].clientX - rect.left, touchEvent.touches[i].clientY - rect.top]);
        } catch(error){
            alert(error);
        }
    }
    return tempList;
}

var num_touches = 0;
// detect touch events
canvas_CytusFake.addEventListener('touchstart', function(e){
    e.preventDefault();
    var tempL = [];
    for (var i = 0; i < e.touches.length; i++){
        tempL.push(e.touches[i].clientX);
    }
    num_touches = 0;
    getTouchPos(canvas_CytusFake, e).forEach(function(item){
        num_touches += 1;
        // alert("this is " + num_touches + " touch: " + "x = " + item[0] + ", y = " + item[1]);
        circList.touchEvent(item[0], item[1]);
    });
}, false);
document.getElementById("btn-start").addEventListener("click", function(){
    if (circList.time < circList.max_time){
        if (circList.run === false){
            this.innerHTML = "PAUSE";
            circList.run = true;
            draw_CytusFake(true);
            audio.play();
        } else{
            this.innerHTML = "CONTINUE";
            circList.run = false;
            audio.pause();
        }
    } else{
        circList.restart();
        document.getElementById("slider").value = 0;
        this.innerHTML = "PAUSE";
        circList.run = true;
        draw_CytusFake(true);
        audio.play();
    }
});

document.getElementById("btn-restart").addEventListener("click", function(){
    circList.restart();
    document.getElementById("slider").value = 0;
    document.getElementById("btn-start").innerHTML = "START";
});

document.getElementById("slider").oninput = function() {
    var time = parseFloat(this.value)/(1000/circList.max_time);
    circList.set_time(time);
    // audio.resetSource();
    // audio.play(time);
    document.getElementById("time_indication").innerHTML = (parseFloat(this.value)/(1000/circList.max_time)).toFixed(2).toString();
    document.getElementById("timeline").innerHTML = circList.search_timeline();
};


// document.getElementById("slider").addEventListener("mouseup", function(){
//     var playing = audio.connected;
//     audio.resetSource();
//     audio.play(parseFloat(this.value)/(1000/circList.max_time));
//     if (!playing){
//         audio.pause();
//     }
//     circList.set_time(parseFloat(this.value)/(1000/circList.max_time));
//     document.getElementById("timeline").innerHTML = circList.search_timeline("1");
// });

"mouseup touchend".split(" ").forEach(function(e){
    document.getElementById("slider").addEventListener(e, function(){
        var playing = audio.connected;
        audio.resetSource();
        audio.play(parseFloat(this.value)/(1000/circList.max_time));
        if (!playing){
            audio.pause();
        }
        circList.set_time(parseFloat(this.value)/(1000/circList.max_time));
        document.getElementById("timeline").innerHTML = circList.search_timeline("1");
    });
});