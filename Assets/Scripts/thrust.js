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
private var power :int;
private var actualThrust :float;
random = Random.Range(3,10);

function FixedUpdate () {
	fire.GetComponent.<ParticleSystem>().startLifetime =0;
	lighting.GetComponent.<Light>().intensity =0;
	if(key.Length>0){
		if (Input.GetKey(key)){
			power=gameObject.FindWithTag("player").GetComponent(playerProperties).power;
			actualThrust=thrust;
			if(thrust>power){
				actualThrust=power;
			}
			thruster.GetComponent.<Rigidbody>().AddForce(-transform.up * actualThrust);
			fire.GetComponent.<ParticleSystem>().startLifetime =actualThrust/3000;
			var noise = Mathf.PerlinNoise(random, Time.time*10);
			lighting.GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity, maxIntensity, noise);
			gameObject.FindWithTag("player").GetComponent(playerProperties).power=power-actualThrust;
		}
	}
}

