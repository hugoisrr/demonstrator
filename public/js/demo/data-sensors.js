var socket = io();
    // null, moving, drill
    var states1 = [0,0,0];
    var states2 = [0,0,0]
    var states3 = [0,0,0]
    
    socket.on('state', function(state){
        // Drill
        document.getElementById("state").innerHTML = JSON.stringify(state);
        document.getElementById("ueberschrift1").innerHTML = state[0].id;
        document.getElementById("currentState1").innerHTML = state[0].state;
        document.getElementById("statesStats1").innerHTML = states1;
        // get bar elements
        document.getElementById("progressBar11").style.width = (states1[0]*100)/(states1[0]+states1[1]+states1[2])+"%";
        document.getElementById("progressBar12").style.width = (states1[1]*100)/(states1[0]+states1[1]+states1[2])+"%";
        document.getElementById("progressBar13").style.width = (states1[2]*100)/(states1[0]+states1[1]+states1[2])+"%";

        if(state[0].state === "null"){
                states1[0]++;
            }
            else if(state[0].state === "moving"){
                states1[1]++;
            }  
            else if(state[0].state === "drill"){
                states1[2]++;
        }

        // Vaccum
        document.getElementById("ueberschrift2").innerHTML = state[2].id;
        document.getElementById("currentState2").innerHTML = state[2].state;
        document.getElementById("statesStats2").innerHTML = states2;
        // get bar elements
        document.getElementById("progressBar21").style.width = (states2[0]*100)/(states2[0]+states2[1]+states2[2])+"%";
        document.getElementById("progressBar22").style.width = (states2[1]*100)/(states2[0]+states2[1]+states2[2])+"%";
        document.getElementById("progressBar23").style.width = (states2[2]*100)/(states2[0]+states2[1]+states2[2])+"%";

        if(state[2].state === "null"){
                states2[0]++;
            }
            else if(state[2].state === "heating"){
                states2[1]++;
            }  
            else if(state[2].state === "vacuum"){
                states2[2]++;
        }


        // LaserCut
        document.getElementById("ueberschrift3").innerHTML = state[1].id;
        document.getElementById("currentState3").innerHTML = state[1].state;
        document.getElementById("statesStats3").innerHTML = states3;
        // get bar elements
        document.getElementById("progressBar31").style.width = (states3[0]*100)/(states3[0]+states3[1]+states3[2])+"%";
        document.getElementById("progressBar32").style.width = (states3[1]*100)/(states3[0]+states3[1]+states3[2])+"%";
        document.getElementById("progressBar33").style.width = (states3[2]*100)/(states3[0]+states3[1]+states3[2])+"%";

        if(state[1].state === "null"){
                states3[0]++;
            }
            else if(state[1].state === "moving"){
                states3[1]++;
            }  
            else if(state[1].state === "cutting"){
                states3[2]++;
        }
    });
