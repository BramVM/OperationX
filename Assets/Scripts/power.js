#pragma strict
@script RequireComponent(playerProperties);

function FixedUpdate () {
	gameObject.FindWithTag("powerBar").GetComponent(Slider).maxValue=GetComponent(playerProperties).powerCapacity;
	gameObject.FindWithTag("powerBar").GetComponent(Slider).value=GetComponent(playerProperties).power;
	GetComponent(playerProperties).power=GetComponent(playerProperties).power+GetComponent(playerProperties).powerSupply;
	if(GetComponent(playerProperties).power>GetComponent(playerProperties).powerCapacity){
		GetComponent(playerProperties).power=GetComponent(playerProperties).powerCapacity;
	}
	//Debug.Log(GetComponent(playerProperties).power);
}