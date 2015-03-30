#pragma strict
public var thrust: float;
public var thruster: GameObject;
public var thrustLight: GameObject;

private var minIntensity = 1;
private var maxIntensity = 7;
private var random : float;
private var light : GameObject;
random = Random.Range(3,10);

function Start() {
	thrustLight = Instantiate(thrustLight,thruster.transform.position,thruster.transform.rotation)as GameObject;
	thrustLight.transform.SetParent(thruster.transform,false);
	
	thrustLight.transform.position=thruster.transform.position;
	thrustLight.transform.rotation=thruster.transform.rotation;
	
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==180&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==180){
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x+90;
		thrustLight.transform.position.y=thruster.transform.position.y+0.6;
	}
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==0){
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x-90;
		thrustLight.transform.position.y=thruster.transform.position.y-0.6;
	}
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==90&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==0){
		thrustLight.transform.rotation.eulerAngles.z=thruster.transform.rotation.z+180;
		//thrustLight.transform.rotation.eulerAngles.y=thrustLight.transform.rotation.y+0;
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x+180;
		thrustLight.transform.position.z=thruster.transform.position.z-0.6;
	}
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==270&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==0){
		//thrustLight.transform.rotation.eulerAngles.z=thrustLight.transform.rotation.z+90;
		//thrustLight.transform.rotation.eulerAngles.y=thrustLight.transform.rotation.y+0;
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x+180;
		thrustLight.transform.position.z=thruster.transform.position.z+0.6;
	}
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==90){
		thrustLight.transform.rotation.eulerAngles.z=thruster.transform.rotation.z-90;
		thrustLight.transform.rotation.eulerAngles.y=thruster.transform.rotation.y+90;
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x+180;
		thrustLight.transform.position.x=thruster.transform.position.x+0.6;
	}
	if(Mathf.Round(thruster.transform.rotation.eulerAngles.x)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.y)==0&&Mathf.Round(thruster.transform.rotation.eulerAngles.z)==270){
		thrustLight.transform.rotation.eulerAngles.z=thruster.transform.rotation.z+90;
		thrustLight.transform.rotation.eulerAngles.y=thruster.transform.rotation.y-90;
		thrustLight.transform.rotation.eulerAngles.x=thruster.transform.rotation.x+180;
		thrustLight.transform.position.x=thruster.transform.position.x-0.6;
	}
}

function FixedUpdate () {
	
	thrustLight.GetComponent.<ParticleSystem>().startLifetime =0.01;
	thrustLight.GetComponent.<Light>().intensity =0;
	if (Input.GetKey ("return")){
		thruster.GetComponent.<Rigidbody>().AddForce(-transform.up * thrust);
		thrustLight.GetComponent.<ParticleSystem>().startLifetime =0.1;
		var noise = Mathf.PerlinNoise(random, Time.time*10);
		thrustLight.GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity, maxIntensity, noise);
	}
}

function Update () {

}

