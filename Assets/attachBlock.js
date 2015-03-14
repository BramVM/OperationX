#pragma strict
import System.Linq;
 import System.Collections.Generic;
public var newBlock : GameObject;
public var attachedTo : Rigidbody;
private var joint: FixedJoint;
public class newBlockSpotClass {
         public var position : Vector3 ;
         public var connected : GameObject;
 }
 
function positionIsUnique( building, position):boolean
{
     for(var t : Rigidbody in building)
     {
        if(t.position==position){
        	return false;
        }
    }
    return false;
}


function Update ()
{
	var foundColliders : List.<newBlockSpotClass> = new List.<newBlockSpotClass>();
	foundColliders.Capacity = 0;
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	
	var ghostRayLeft = ray;
	var ghostRayRight = ray;
	var ghostRayTop = ray;
	var ghostRayBottom = ray;
	ghostRayRight.origin.x = ray.origin.x - 2.4;
	ghostRayLeft.origin.x = ray.origin.x + 2.4;
	ghostRayTop.origin.y = ray.origin.y - 2.4;
	ghostRayBottom.origin.y = ray.origin.y + 2.4;
	
	var hit1 : RaycastHit;
	if (Physics.Raycast (ghostRayLeft,hit1))
	{
		if(hit1.collider.tag=="buildingBlock"){
			Debug.Log("Left");
			var newBlockSpot1 = newBlockSpotClass();
			newBlockSpot1.connected = hit1.collider.gameObject;
			newBlockSpot1.position = hit1.collider.gameObject.GetComponent.<Rigidbody>().position;
			newBlockSpot1.position.x = newBlockSpot1.position.x-2.4;
      		foundColliders.Add(newBlockSpot1);
        }
	}
	var hit2 : RaycastHit;
	if (Physics.Raycast (ghostRayRight,hit2))
	{
		if(hit2.collider.tag=="buildingBlock"){
			Debug.Log("Right");
      		var newBlockSpot2 = newBlockSpotClass();
			newBlockSpot2.connected = hit2.collider.gameObject;
			newBlockSpot2.position = hit2.collider.gameObject.GetComponent.<Rigidbody>().position;
			newBlockSpot2.position.x = newBlockSpot2.position.x+2.4;
      		foundColliders.Add(newBlockSpot2);
        }
	}
	var hit3 : RaycastHit;
	if (Physics.Raycast (ghostRayTop,hit3))
	{
		if(hit3.collider.tag=="buildingBlock"){
			Debug.Log("Top");
			var newBlockSpot3 = newBlockSpotClass();
			newBlockSpot3.connected = hit3.collider.gameObject;
			newBlockSpot3.position = hit3.collider.gameObject.GetComponent.<Rigidbody>().position;
			newBlockSpot3.position.y = newBlockSpot3.position.y+2.4;
      		foundColliders.Add(newBlockSpot3);
        }
	}
	var hit4 : RaycastHit;
	if (Physics.Raycast (ghostRayBottom,hit4))
	{
		if(hit4.collider.tag=="buildingBlock"){
			Debug.Log("Bottom");
      		var newBlockSpot4 = newBlockSpotClass();
			newBlockSpot4.connected = hit4.collider.gameObject;
			newBlockSpot4.position = hit4.collider.gameObject.GetComponent.<Rigidbody>().position;
			newBlockSpot4.position.y = newBlockSpot4.position.y-2.4;
      		foundColliders.Add(newBlockSpot4);
        }
	}
	var blocks;
	blocks = GameObject.FindGameObjectsWithTag ("buildingBlock");
	if (Input.GetKeyDown ("space")){
		if(foundColliders.Count>0 /*&& positionIsUnique (blocks,foundColliders[0].position)*/){
			//if position is unique
			var blockInstance : GameObject;
        	blockInstance = Instantiate(foundColliders[0].connected,foundColliders[0].position,attachedTo.rotation)as GameObject;
        	for(var i=0;i<foundColliders.Count;i++) {	
	        	joint = blockInstance.AddComponent.<FixedJoint>();
	 			joint.connectedBody = foundColliders[i].connected.GetComponent.<Rigidbody>();
	 			joint.breakForce = 100;
	 			joint.breakTorque = 100;
	 		//Debug.Log(Input.mousePosition);
	 		//Debug.Log(attachedTo.position);
	 		}
		}
    }
}