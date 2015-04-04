#pragma strict

//@script RequireComponent(Light);

public var pom:Vector3;
public var stabilizer:GameObject;
public var sourceBlock:GameObject;
public var maxThrust:float=100;
private var amplitude:float=500;
public var fire1: GameObject;
public var fire2: GameObject;
public var fire3: GameObject;
public var fire4: GameObject;
public var fire5: GameObject;
public var fire6: GameObject;
public var fire7: GameObject;

private var y:float;
private var x:float;
private var sx:float;
private var z:float;
private var sz:float;

private var alphax:float;
private var alphaz:float;
private var thrust:float;
private var startThrust:float=0;
private var wrongx:float=0;
private var wrongz:float=0;
private var minIntensity = 3;
private var maxIntensity = 10;
private var random : float;
random = Random.Range(3,10);


public function init() {
	if(Mathf.Round(stabilizer.transform.rotation.eulerAngles.x)==0&&Mathf.Round(stabilizer.transform.rotation.eulerAngles.y)==180&&Mathf.Round(stabilizer.transform.rotation.eulerAngles.z)==180){
		//thrust up
		y=stabilizer.transform.position.y-pom.y;
		x=stabilizer.transform.position.x-pom.x;
		sx=Mathf.Sqrt(Mathf.Pow(y,2)+Mathf.Pow(x,2));
		alphax= Mathf.Asin(x/sx) * 180/Mathf.PI;
		z=stabilizer.transform.position.z-pom.z;
		sz=Mathf.Sqrt(Mathf.Pow(y,2)+Mathf.Pow(z,2));
		alphaz= Mathf.Asin(z/sz) * 180/Mathf.PI;;
	}
	if(Mathf.Round(stabilizer.transform.rotation.eulerAngles.x)==0&&Mathf.Round(stabilizer.transform.rotation.eulerAngles.y)==0&&Mathf.Round(stabilizer.transform.rotation.eulerAngles.z)==0){
		//thrust up
		y=stabilizer.transform.position.y-pom.y;
		x=stabilizer.transform.position.x-pom.x;
		sx=Mathf.Sqrt(Mathf.Pow(y,2)+Mathf.Pow(x,2));
		alphax= 0-(Mathf.Asin(x/sx) * 180/Mathf.PI);
		z=stabilizer.transform.position.z-pom.z;
		sz=Mathf.Sqrt(Mathf.Pow(y,2)+Mathf.Pow(z,2));
		alphaz= 0-(Mathf.Asin(z/sz) * 180/Mathf.PI);
	}
}

function FixedUpdate () {
	if(sourceBlock!=null){
		if(alphax%360<180&&alphax%360>0){
			wrongx = sourceBlock.transform.rotation.eulerAngles.z*Mathf.PI/180;
			if(wrongx<Mathf.PI){
				wrongx=wrongx*-1;
				wrongx=wrongx/2;
				wrongx=wrongx*amplitude;
			}
			else{
				wrongx=wrongx/2;
				wrongx=Mathf.PI-wrongx;
				wrongx=wrongx*amplitude;
			}
		}
		if(alphax%360<0&&alphax%360>-180){
			wrongx = sourceBlock.transform.rotation.eulerAngles.z*Mathf.PI/180;
			if(wrongx>Mathf.PI){
				wrongx=wrongx/2;
				wrongx=Mathf.PI-wrongx;
				wrongx=wrongx*-1;
				wrongx=wrongx*amplitude;
			}
			else{
				wrongx=wrongx/2;
				wrongx=wrongx*amplitude;
			}
		}
		
		if(alphaz%360<0&&alphaz%360>-180){
			wrongz = sourceBlock.transform.rotation.eulerAngles.x*Mathf.PI/180;
			if(wrongz<Mathf.PI){
				wrongz=wrongz*-1;
				wrongz=wrongz/2;
				wrongz=wrongz*amplitude;
			}
			else{
				wrongz=wrongz/2;
				wrongz=Mathf.PI-wrongz;
				wrongz=wrongz*amplitude;
			}
		}
		if(alphaz%360<180&&alphaz%360>0){
			wrongz = sourceBlock.transform.rotation.eulerAngles.x*Mathf.PI/180;
			if(wrongz>Mathf.PI){
				wrongz=wrongz/2;
				wrongz=Mathf.PI-wrongz;
				wrongz=wrongz*-1;
				wrongz=wrongz*amplitude;
			}
			else{
				wrongz=wrongz/2;
				wrongz=wrongz*amplitude;
			}
		}
		var thrust=wrongx+wrongz;
		if(thrust>maxThrust){thrust=maxThrust;}
		if(thrust<0){thrust=0;}
		var noise = Mathf.PerlinNoise(random, Time.time*10);
		fire1.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire2.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire3.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire4.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire5.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire6.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire7.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		//GetComponent.<Light>().intensity = Mathf.Lerp(minIntensity/maxThrust*(wrongx+wrongz), maxIntensity/maxThrust*(wrongx+wrongz), noise);
		stabilizer.GetComponent.<Rigidbody>().AddForce(-transform.up * thrust  );
	}
}