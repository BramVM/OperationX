#pragma strict
import System.Linq;
import System.Collections.Generic;
public var player : GameObject;
public var newBlock : GameObject;
public var placeHolder : GameObject;
public var blockHeight : float;
public var breakForce : float;
public var breakTorque : float;
public var buildingMode : boolean = true;
private var joint: FixedJoint;


function enterBuildingMode(){
	Debug.Log("buildingMode");
	buildingMode=true;
	var buildingBlocks: GameObject[];
	buildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var i : int = 0; i < buildingBlocks.length; i++){
		buildingBlocks[i].GetComponent.<Rigidbody>().useGravity = false;
		buildingBlocks[i].GetComponent.<Rigidbody>().isKinematic = true;
	}
}

function exitBuildingMode(){
	Debug.Log("exit buildingMode");
	buildingMode=false;
	removePlaceholders();
	var buildingBlocks: GameObject[];
	buildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var i : int = 0; i < buildingBlocks.length; i++){
		buildingBlocks[i].GetComponent.<Rigidbody>().useGravity = true;
		buildingBlocks[i].GetComponent.<Rigidbody>().isKinematic = false;
	}
}
function removePlaceholders()
	{
		var placeholders: GameObject[];
		placeholders = player.FindGameObjectsWithTag ("placeholder");
		for(var i : int = 0; i < placeholders.length; i++)
		{
			Destroy (placeholders[i]);
		}
	}

function Update ()
{	
	if(buildingMode){
		removePlaceholders();
		var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		if (Physics.Raycast (ray,hit)){
			if(hit.collider.tag=="buildingBlock"){
				var position:Vector3=hit.collider.gameObject.GetComponent.<Rigidbody>().position;
				position.z = position.z+(blockHeight*hit.normal.z);
				position.x = position.x+(blockHeight*hit.normal.x);
				position.y = position.y+(blockHeight*hit.normal.y);
				var blockInstance : GameObject;
				if(Input.GetMouseButtonDown(0))
				{
					blockInstance = Instantiate(newBlock,position,hit.collider.gameObject.GetComponent.<Rigidbody>().rotation)as GameObject;
					blockInstance.transform.SetParent(player.transform,false);
			 		var buildingBlocks: GameObject[];
					buildingBlocks = GameObject.FindGameObjectsWithTag ("buildingBlock");
					for(var i=0;i<buildingBlocks.length;i++) {
						//if next to
						var blockPosition:Vector3=buildingBlocks[i].GetComponent.<Rigidbody>().position;
						var match1:Vector3=(position);
						match1.x=match1.x+blockHeight;
						var match2:Vector3=(position);
						match2.x=match2.x-blockHeight;
						var match3:Vector3=(position);
						match3.y=match3.y+blockHeight;
						var match4:Vector3=(position);
						match4.y=match4.y-blockHeight;
						var match5:Vector3=(position);
						match5.z=match5.z+blockHeight;
						var match6:Vector3=(position);
						match6.z=match6.z-blockHeight;
						if(blockPosition==match1||blockPosition==match2||blockPosition==match3||blockPosition==match4||blockPosition==match5||blockPosition==match6){
							joint = blockInstance.AddComponent.<FixedJoint>();
							var body= blockInstance.GetComponent.<Rigidbody>();
				 			joint.connectedBody = buildingBlocks[i].GetComponent.<Rigidbody>();
				 			joint.breakForce = breakForce;
				 			joint.breakTorque = breakTorque;
						}
					}
				}
				else
				{
					blockInstance = player.Instantiate(placeHolder,position,hit.collider.gameObject.GetComponent.<Rigidbody>().rotation)as GameObject;
					blockInstance.transform.SetParent(player.transform,false);
				}
			}	
		}
	}
}