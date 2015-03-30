#pragma strict
public var thrust: float;
public var thruster: GameObject;
public var thrustLight: GameObject;

private var minIntensity = 3;
private var maxIntensity = 10;
private var random : float;
private var light : GameObject;
random = Random.Range(3,10);

function Start() {
	thrustLight = Instantiate(thrustLight,thruster.transform.position,thruster.transform.rotation)as GameObject;
	thrustLight.transform.SetParent(thruster.transform,false);
	thrustLight.transform.position.y=thrustLight.transform.position.y+0.7;
}

function FixedUpdate () {
	thrustLight.transform.position=thruster.transform.position;
	thrustLight.transform.position.y=thrustLight.transform.position.y+0.7;
	thrustLight.transform.rotation=thruster.transform.rotation;
	thrustLight.transform.rotation.eulerAngles.x=thrustLight.transform.rotation.x+90;
	thrustLight.GetComponent.<Light>().intensity =0;
	if (Input.GetKey ("return")){
		thruster.GetComponent.<Rigidbody>().AddForce(-transform.up * thrust);
		//Debug.Log(thrust);
		var noise = Mathf.PerlinNoise(random, Time.time*10);
		thrustLight.GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity, maxIntensity, noise);
	}
}

function Update () {

}

