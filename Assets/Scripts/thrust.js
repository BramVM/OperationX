#pragma strict
var thrust: float;
var rb: Rigidbody;
@script RequireComponent(Light);

var minIntensity = 3; var maxIntensity = 10;
private var random : float;
random = Random.Range(3,10);

function Start() {
	rb = GetComponent.<Rigidbody>();
	/*GetComponent.<thrust_animation>().Play();*/
}

function FixedUpdate () {
	GetComponent.<Light>().intensity =0;
	if (Input.GetKey ("return")){
		rb.AddForce(-transform.up * thrust);
		//Debug.Log(thrust);
		var noise = Mathf.PerlinNoise(random, Time.time*10);
		GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity, maxIntensity, noise);
	}
}

function Update () {

}

