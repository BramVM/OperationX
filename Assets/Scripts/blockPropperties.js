#pragma strict
public var id:int;
public var OffsetY:float;
public var instance:GameObject;
public var proportionalHeight:float;
public var attachableNY:boolean;
public var attachablePY:boolean;
public var attachableNX:boolean;
public var attachablePX:boolean;
public var attachableNZ:boolean;
public var attachablePZ:boolean;

function Awake(){
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==180&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==180&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==0){
		instance.transform.position.y=instance.transform.position.y-OffsetY;
	}
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==0){
		instance.transform.position.y=instance.transform.position.y+OffsetY;
	}
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==90&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==0){
		instance.transform.position.x=instance.transform.position.x-OffsetY;
	}
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==270&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==0){
		instance.transform.position.x=instance.transform.position.x+OffsetY;
	}
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==90){
		instance.transform.position.z=instance.transform.position.z+OffsetY;
	}
	if(Mathf.Round(instance.transform.rotation.eulerAngles.y)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.z)==0&&Mathf.Round(instance.transform.rotation.eulerAngles.x)==270){
		instance.transform.position.z=instance.transform.position.z-OffsetY;
	}	
}