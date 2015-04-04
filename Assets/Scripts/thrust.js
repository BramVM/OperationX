#pragma strict
public var thrust: float;
public var thruster: GameObject;
public var fire: GameObject;
public var lighting: GameObject;
public var key: String="";

private var minIntensity = 1;
private var maxIntensity = 7;
private var random : float;
private var light : GameObject;
random = Random.Range(3,10);

function FixedUpdate () {
	fire.GetComponent.<ParticleSystem>().startLifetime =0;
	lighting.GetComponent.<Light>().intensity =0;
	if(key.Length>0){
		if (Input.GetKey(key)){
			thruster.GetComponent.<Rigidbody>().AddForce(-transform.up * thrust);
			fire.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
			var noise = Mathf.PerlinNoise(random, Time.time*10);
			lighting.GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity, maxIntensity, noise);
		}
	}
}

