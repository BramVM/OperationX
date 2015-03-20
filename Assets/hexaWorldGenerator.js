#pragma strict

public var grid_x : float = 100;
var grid_z = Mathf.Sqrt((Mathf.Pow((grid_x*2), 2)-Mathf.Pow((grid_x), 2)));

function Start () {

/*get player position*/
var playerPos_x = GameObject.Find("Main Camera").transform.position.x;
var playerPos_z = GameObject.Find("Main Camera").transform.position.z;

/*instantiate position of new hexagon*/
var newHexPos_x : float;
var newHexPos_z : float;

/*get amount of gridlines between player position and origin*/
var gridNumber_x : float = playerPos_x / grid_x;
var gridNumber_z : float = playerPos_z / grid_z;

/*round the amount of gridlines to get the closest hexagon origin*/
newHexPos_x = Mathf.Round(gridNumber_x) * grid_x;
newHexPos_z = Mathf.Round(gridNumber_z) * grid_z;

Debug.Log(newHexPos_x);
Debug.Log(newHexPos_z);

/*Debug.Log(GameObject.Find("hexagon").bounds.size.x);

/*var cube : GameObject  = GameObject.CreatePrimitive(PrimitiveType.Cube);
cube.transform.position = Vector3(newHexPos_x, 0.5, newHexPos_z);*/
}

function Update () {

}