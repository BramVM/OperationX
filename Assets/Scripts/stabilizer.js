#pragma strict

//@script RequireComponent(Light);

public var pom:Vector3;
public var stabilizer:GameObject;
public var sourceBlock:GameObject;
public var maxThrust:float=100;
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

private var speedModifier=100;
private var offsetModifier=0.1;
private var prevRotation:Vector3;
private var speed:Vector3;
private var alphax:float;
private var alphaz:float;
private var thrust:float;
private var startThrust:float=0;
private var wrongx:float=0;
private var wrongz:float=0;
private var minIntensity = 3;
private var maxIntensity = 10;
private var random : float;
private var power :int;
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
		speed=sourceBlock.transform.rotation.eulerAngles-prevRotation;
		if (speed.x>180){
			speed.x=sourceBlock.transform.rotation.eulerAngles.x-360-prevRotation.x;
		}
		if (speed.x<-180){
			speed.x=sourceBlock.transform.rotation.eulerAngles.x+360-prevRotation.x;
		}
		if (speed.y>180){
			speed.y=sourceBlock.transform.rotation.eulerAngles.y-360-prevRotation.y;
		}
		if (speed.y<-180){
			speed.y=sourceBlock.transform.rotation.eulerAngles.y+360-prevRotation.y;
		}
		if (speed.z>180){
			speed.z=sourceBlock.transform.rotation.eulerAngles.z-360-prevRotation.z;
		}
		if (speed.z<-180){
			speed.z=sourceBlock.transform.rotation.eulerAngles.z+360-prevRotation.z;
		}
		prevRotation=sourceBlock.transform.rotation.eulerAngles;
		if(alphax%360<180&&alphax%360>0){
			wrongx=sourceBlock.transform.rotation.eulerAngles.z;
			if(wrongx>180){
				wrongx=wrongx-360;
			}
			wrongx=wrongx*Mathf.PI/90*100/(2*Mathf.PI)*offsetModifier+speed.z*speedModifier;
			wrongx=-wrongx;
		}
		if(alphax%360<0&&alphax%360>-180){
			wrongx=sourceBlock.transform.rotation.eulerAngles.z;
			if(wrongx>180){
				wrongx=wrongx-360;
			}
			wrongx=wrongx*Mathf.PI/90*100/(2*Mathf.PI)*offsetModifier+speed.z*speedModifier;
		}
		
		if(alphaz%360<0&&alphaz%360>-180){
			wrongz=sourceBlock.transform.rotation.eulerAngles.x;
			if(wrongz>180){
				wrongz=wrongz-360;
			}
			wrongz=wrongz*Mathf.PI/90*100/(2*Mathf.PI)*offsetModifier+speed.x*speedModifier;
			wrongz=-wrongz;
		}
		if(alphaz%360<180&&alphaz%360>0){
			wrongz=sourceBlock.transform.rotation.eulerAngles.x;
			if(wrongz>180){
				wrongz=wrongz-360;
			}
			wrongz=wrongz*Mathf.PI/90*100/(2*Mathf.PI)*offsetModifier+speed.x*speedModifier;
		}
		thrust=thrust+wrongx+wrongz;
		if(thrust>maxThrust){thrust=maxThrust;}
		if(thrust<0){thrust=0;}
		power=gameObject.FindWithTag("player").GetComponent(playerProperties).power;
		if(thrust>power){
			thrust=power;
		}
		var noise = Mathf.PerlinNoise(random, Time.time*10);
		fire1.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire2.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire3.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire4.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire5.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire6.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		fire7.GetComponent.<ParticleSystem>().startLifetime =thrust/1000;
		stabilizer.GetComponent.<Rigidbody>().AddForce(-transform.up * thrust  );
		gameObject.FindWithTag("player").GetComponent(playerProperties).power=power-thrust;
	}
}