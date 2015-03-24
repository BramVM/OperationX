#pragma strict
var thrust: float;
var rb: Rigidbody;

function Start() {
	rb = GetComponent.<Rigidbody>();
}

function FixedUpdate () {
	if (Input.GetKey ("return")){
	rb.AddForce(-transform.up * thrust);
	}
}

function Update () {

}