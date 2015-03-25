#pragma strict
var thrust: float;
var rb: Rigidbody;
var max=1;

function Start() {
	rb = GetComponent.<Rigidbody>();
	/*GetComponent.<thrust_animation>().Play();*/
}

function FixedUpdate () {
	if (Input.GetKey ("return")){
		rb.AddForce(-transform.up * thrust);
		//Debug.Log(thrust);
	}
}

function Update () {

}

