#pragma strict
@script RequireComponent(Transform);
function Start () {

}

function Update () {
	GetComponent(Transform).Rotate(Vector3(0,0,10));
}