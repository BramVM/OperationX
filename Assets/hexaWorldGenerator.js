#pragma strict

public var grid_x = 100;
public var grid_z = 173.205080757;

function Start () {
/*1.73205080757*/
var playerPos_x = GameObject.Find("Main Camera").transform.position.x;
var playerPos_z = GameObject.Find("Main Camera").transform.position.z;

/*var scale = 100; current scale is 100, make relative if necessary*/

var newHexPos_x : int;
var newHexPos_z : int;
 
var pos_xRest = playerPos_x % grid_x;   
var pos_zRest = playerPos_z % grid_z; 

var gridNumber_x = playerPos_x / 100;
var gridNumber_z = playerPos_z / 100;

/*rounding doesnt work --> because floats are possible*/

if(pos_xRest <=50){
	newHexPos_x = Mathf.Round(gridNumber_x) * grid_x;
}
else{
	newHexPos_x = Mathf.Round(gridNumber_x) * grid_x;
}

if(pos_xRest <= (grid_z/2)){
	newHexPos_z = Mathf.Round(gridNumber_z) * grid_z;
}
else{
	newHexPos_z = Mathf.Round(gridNumber_z) * grid_z;
}

Debug.Log(newHexPos_x);
}

function Update () {

}