#pragma strict
public var instance:GameObject;
function Start () {
	//instance.GetComponent(Rigidbody).AddForce(Vector3(0, -4000.0, 0));
	//instance.GetComponent(Physics).gravity = Vector3(0, 100.0, 0);
}

function FixedUpdate () {
	instance.GetComponent(Rigidbody).AddForce(transform.up * 100);
}
