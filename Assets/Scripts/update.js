#pragma strict
public var scripts : GameObject;

function Start () {
}

function Update () {
	scripts.GetComponent.<hexaWorldGenerator>().generateWorld();
	scripts.GetComponent.<buildingMode>().builder();
}