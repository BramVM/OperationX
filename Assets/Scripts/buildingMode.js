#pragma strict
import System.Linq;
import System.Collections.Generic;
import System;
import System.Runtime.Serialization.Formatters.Binary;
import System.IO;

public class blockData{
	var type : int;
	var x : int;
	var y : int;
	var z : int;
	var orientation : int;
}

public var player : GameObject;
public var blockHeight : float;
public var breakForce : float;
public var breakTorque : float;
public var buildingMode : boolean = true;
public var deleteMaterial: Material;
public var placeholderMaterial: Material;
public var pointOfMassIndicator:GameObject;

private var joint: FixedJoint;
private	var buildingBlocks = new List.<blockData>();
private var removalMode : boolean = false;
private var cam : GameObject;
private var holding : GameObject;
private var objectWithTempDeleteMaterial: Renderer;
private var originalMaterialBeforeChangedToDelete: Material;
private var sourceBlockInstance:GameObject;
private var pointOfMass:Vector3;

public var sourceBlock : GameObject;
public var sourceBlockName : String;
public var blankBlock : GameObject;
public var blankBlockName : String;
public var thrustBlock : GameObject;
public var thrustBlockName : String;
public var stabilizerBlock : GameObject;
public var stabilizerBlockName : String;

function blockSelectBlank (){
	holding=blankBlock;
	removalMode=false;
}

function blockSelectThrust (){
	holding=thrustBlock;
	removalMode=false;
}

function blockSelectStabilizer (){
	holding=stabilizerBlock;
	removalMode=false;
}

function restoreTempMaterial(){
	if(objectWithTempDeleteMaterial!=null){
		objectWithTempDeleteMaterial.material = originalMaterialBeforeChangedToDelete;
	}
}

function removePlaceholders(){
	var placeholders: GameObject[];
	placeholders = player.FindGameObjectsWithTag ("placeholder");
	for(var i : int = 0; i < placeholders.length; i++)
	{
		DestroyImmediate (placeholders[i]);
	}
}

function toggleRemovalMode(){
	if(removalMode){
		removalMode=false;
	}
	else{
		removalMode=true;
	}
	restoreTempMaterial();
	removePlaceholders();
}

function saveBuilding(){
	//format Data
	var taggedBuildingBlocks= new GameObject[0];
	//taggedBuildingBlocks.Clear();
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	buildingBlocks.Clear();
	for(var i : int = 0; i < taggedBuildingBlocks.length; i++){
		buildingBlocks.Add(new blockData());
		//orientation & position
		var yPosition = taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.y+blockHeight/2;
		var xPosition = taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.x;
		var zPosition = taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.z;
		var blockHeightModifier = taggedBuildingBlocks[i].GetComponent.<blockPropperties>().proportionalHeight;
		var xRotation = Mathf.RoundToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().rotation.eulerAngles.x);
		var yRotation = Mathf.RoundToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().rotation.eulerAngles.y);
		var zRotation = Mathf.RoundToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().rotation.eulerAngles.z);
	    if (xRotation==0){
	    	buildingBlocks[i].orientation=0;
	    	yPosition = yPosition+((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
	    if (yRotation==180 && zRotation==180){
	        buildingBlocks[i].orientation=1;
	        yPosition = yPosition-((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
	    if (xRotation==90){
	        buildingBlocks[i].orientation=2;
	        xPosition = xPosition+((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
	    if (xRotation==270){
	        buildingBlocks[i].orientation=3;
	        xPosition = xPosition-((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
	    if (zRotation==90){
	    	buildingBlocks[i].orientation=4;
	    	zPosition = zPosition+((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
	    if (zRotation==270){
	        buildingBlocks[i].orientation=5;
	        zPosition = zPosition+((1-blockHeightModifier)/2*blockHeight);
	        buildingBlocks[i].x=Mathf.RoundToInt(xPosition/blockHeight);
	        buildingBlocks[i].y=Mathf.RoundToInt(yPosition/blockHeight);
	        buildingBlocks[i].z=Mathf.RoundToInt(zPosition/blockHeight);
	    }
		//type
		if(taggedBuildingBlocks[i].name == sourceBlockName ){
			buildingBlocks[i].type=0;
		}
		if(taggedBuildingBlocks[i].name == blankBlockName ){
			buildingBlocks[i].type=1;
		}
		if(taggedBuildingBlocks[i].name == thrustBlockName ){
			buildingBlocks[i].type=2;
		}
		if(taggedBuildingBlocks[i].name == stabilizerBlockName ){
			buildingBlocks[i].type=3;
		}
	}
	//save data
	var bf : BinaryFormatter = new BinaryFormatter();
	var file : FileStream;
	if(File.Exists(Application.persistentDataPath + "/building.dat")){
		file = File.Open(Application.persistentDataPath + "/building.dat", FileMode.Create, FileAccess.Write, FileShare.None);
	}
	else{
		file = File.Create(Application.persistentDataPath + "/building.dat");
	}
	bf.Serialize(file,buildingBlocks);
	file.Close();
}

function loadBuiling(){
	if(File.Exists(Application.persistentDataPath + "/building.dat")){
		var bf : BinaryFormatter = new BinaryFormatter();
		var file : FileStream = File.Open(Application.persistentDataPath + "/building.dat", FileMode.Open);
		buildingBlocks = bf.Deserialize(file);
		file.Close();
		buildFromData();
	}
}

function buildFromData(){
	var taggedBuildingBlocks: GameObject[];
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var j : int = 0; j < taggedBuildingBlocks.length; j++){
		DestroyImmediate (taggedBuildingBlocks[j]);
	}
	var blockInstance: GameObject;
	var buildingBlock = new blockData();

	for(var i : int = 0; i < buildingBlocks.Count; i++){
		buildingBlock=buildingBlocks[i];
		var blockPosition = new Vector3();
		var rotation = new Quaternion();
	    switch (buildingBlock.type){
			case 0:
				holding=sourceBlock;
				break;
			case 1:
				holding=blankBlock;
				break;
			case 2:
				holding=thrustBlock;
				break;
			case 3:
				holding=stabilizerBlock;
				break;
		}
		var blockHeightModifier = holding.GetComponent.<blockPropperties>().proportionalHeight;
	    switch (buildingBlocks[i].orientation){
		    case 0:
		    	blockPosition.x=buildingBlock.x*blockHeight;
		    	blockPosition.z=buildingBlock.z*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2-(1-blockHeightModifier)/2*blockHeight;
		    	break;
		    case 1:
		        rotation.eulerAngles.y=rotation.eulerAngles.y+180;
		        rotation.eulerAngles.z=rotation.eulerAngles.z+180;
		        blockPosition.x=buildingBlock.x*blockHeight;
		    	blockPosition.z=buildingBlock.z*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2+(1-blockHeightModifier)/2*blockHeight;
		    	break;
		    case 2:
		    	rotation.eulerAngles.x=rotation.eulerAngles.x+90;
		        blockPosition.z=buildingBlock.z*blockHeight-(1-blockHeightModifier)/2*blockHeight;
		    	blockPosition.x=buildingBlock.x*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2;
		    	break;
		    case 3:
		        rotation.eulerAngles.x=rotation.eulerAngles.x+270;
		        blockPosition.z=buildingBlock.z*blockHeight+(1-blockHeightModifier)/2*blockHeight;
		    	blockPosition.x=buildingBlock.x*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2;
		    	break;
		    case 4:
		    	rotation.eulerAngles.z=rotation.eulerAngles.z+90;
		    	blockPosition.z=buildingBlock.z*blockHeight;
		    	blockPosition.x=buildingBlock.x*blockHeight+(1-blockHeightModifier)/2*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2;
		    	break;
		    case 5:
		        rotation.eulerAngles.z=rotation.eulerAngles.z+270;
		        blockPosition.z=buildingBlock.z*blockHeight;
		    	blockPosition.x=buildingBlock.x*blockHeight-(1-blockHeightModifier)/2*blockHeight;
		    	blockPosition.y=buildingBlock.y*blockHeight+blockHeight/2;
		        break;
	    }
	    blockInstance = Instantiate(holding,blockPosition,rotation)as GameObject;
		blockInstance.transform.SetParent(player.transform,false);
		if(blockInstance.name==sourceBlockName){
			sourceBlockInstance=blockInstance;
	    }
	    holding=null;
	}
	calcPointOfMass();
	passSourceBlockInstance(sourceBlockInstance);
}
function passSourceBlockInstance(blockInstance:GameObject){
	cam.GetComponent.<cameraMovement>().target = blockInstance.transform;
	GameObject.Find("Scripting").GetComponent.<hexaWorldGenerator>().player = blockInstance;
	var taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var i : int = 0; i < taggedBuildingBlocks.length; i++){
		if(taggedBuildingBlocks[i].name == "stabilizerBlock(Clone)"){
			Debug.Log("uhu");
			taggedBuildingBlocks[i].GetComponent.<stabilizer>().pom = pointOfMass;
         	taggedBuildingBlocks[i].GetComponent.<stabilizer>().sourceBlock = blockInstance;
         	taggedBuildingBlocks[i].GetComponent.<stabilizer>().init();
     	}
 	}
}
function createJoints(blockInstance: GameObject){
	var newBlockPosition:Vector3=blockInstance.GetComponent.<Rigidbody>().position;
	var hitAttachablePY : boolean; 
	var hitAttachableNY : boolean;
	var hitAttachablePX : boolean;
	var hitAttachableNX : boolean;
	var hitAttachablePZ : boolean;
	var hitAttachableNZ : boolean;
	var hit : RaycastHit;
	var up: Vector3=blockInstance.transform.up;
	var down: Vector3=blockInstance.transform.up*-1;
	var right: Vector3=blockInstance.transform.right;
	var left: Vector3=blockInstance.transform.right*-1;
	var front: Vector3=blockInstance.transform.forward;
	var back: Vector3=blockInstance.transform.forward*-1;
	if (Physics.Raycast(newBlockPosition,up,hit) && blockInstance.GetComponent.<blockPropperties>().attachablePY){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
	if (Physics.Raycast(newBlockPosition,down,hit) && blockInstance.GetComponent.<blockPropperties>().attachableNY){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				Debug.Log(newBlockPosition +" "+blockInstance.name + " " + hit.collider.gameObject.GetComponent.<Rigidbody>());
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
	if (Physics.Raycast(newBlockPosition,right,hit) && blockInstance.GetComponent.<blockPropperties>().attachablePX){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
	if (Physics.Raycast(newBlockPosition,left,hit) && blockInstance.GetComponent.<blockPropperties>().attachableNX){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
	if (Physics.Raycast(newBlockPosition,front,hit) && blockInstance.GetComponent.<blockPropperties>().attachablePZ){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
	if (Physics.Raycast(newBlockPosition,back,hit) && blockInstance.GetComponent.<blockPropperties>().attachableNZ){
		if(hit.distance<blockHeight&&hit.collider.tag=="buildingBlock"){
			hitAttachablePY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY;
			hitAttachableNY = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY;
			hitAttachablePX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX;
			hitAttachableNX = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX;
			hitAttachablePZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ;
			hitAttachableNZ = hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ;
			if((Mathf.RoundToInt(hit.normal.y)==-1&&hitAttachableNY)||(Mathf.RoundToInt(hit.normal.y)==1&&hitAttachablePY)||(Mathf.RoundToInt(hit.normal.x)==-1&&hitAttachableNX)||(Mathf.RoundToInt(hit.normal.x)==1&&hitAttachablePX)||(Mathf.RoundToInt(hit.normal.z)==-1&&hitAttachableNZ)||(Mathf.RoundToInt(hit.normal.z)==1&&hitAttachablePZ)){
				joint = blockInstance.AddComponent.<FixedJoint>();
				joint.connectedBody = hit.collider.gameObject.GetComponent.<Rigidbody>();
				joint.breakForce = breakForce;
				joint.breakTorque = breakTorque;
			}
		}
	}
}

function removeJoints(blockInstance: GameObject){
	var buildingBlocks: GameObject[];
	buildingBlocks = GameObject.FindGameObjectsWithTag ("buildingBlock");
	var joints: Component[];
	joints = blockInstance.GetComponents.<FixedJoint>() as Component[];
	for(var k=0;k<joints.length;k++) {
	    DestroyImmediate(joints[k] as FixedJoint);
	}
	for(var j=0;j<buildingBlocks.length;j++) {
		joints = buildingBlocks[j].GetComponents.<FixedJoint>() as Component[];
		for(var i : int = 0; i < joints.length; i++){
			joint=joints[i];
			if(joint.connectedBody == blockInstance.GetComponent.<Rigidbody>()){
	        	DestroyImmediate(joints[i] as FixedJoint);
	        }	
		}
	}
}
function calcPointOfMass(){
	var taggedBuildingBlocks: GameObject[];
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	pointOfMass=taggedBuildingBlocks[0].transform.position;
	Debug.Log(pointOfMass);
	for(var i : int = 0; i < taggedBuildingBlocks.length; i++){
		if(i!=0){
			pointOfMass=pointOfMass+taggedBuildingBlocks[i].transform.position;
		}
	}
	pointOfMass=pointOfMass/taggedBuildingBlocks.length;
	pointOfMassIndicator.transform.position=pointOfMass;
	Debug.Log(pointOfMass);
}
function enterBuildingMode(){
	buildingMode=true;
	loadBuiling();
	var buildingBlocks: GameObject[];
	buildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var i : int = 0; i < buildingBlocks.length; i++){
		removeJoints(buildingBlocks[i]);
	}
}

function exitBuildingMode(){

	buildingMode=false;
	removePlaceholders();
	loadBuiling();
	var buildingBlocks= new GameObject[0];
	buildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	for(var i : int = 0; i < buildingBlocks.length; i++){
		buildingBlocks[i].GetComponent.<Rigidbody>().useGravity = true;
		buildingBlocks[i].GetComponent.<Rigidbody>().isKinematic = false;
		createJoints(buildingBlocks[i]);
	} 
}

function Awake(){
	cam = GameObject.Find("Main Camera");
	var blockInstance: GameObject;
	var initPosition: Vector3;
	var initRotation: Quaternion;
	initPosition.x=0;
	initPosition.y=6;
	initPosition.z=0;
	blockInstance = Instantiate(sourceBlock,initPosition, initRotation)as GameObject;
	blockInstance.transform.SetParent(player.transform,false);
	sourceBlockInstance=blockInstance;
	passSourceBlockInstance(blockInstance);
}

function Start(){
	loadBuiling();
}

function builder (){
	if(buildingMode){
		var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		if(removalMode){
			restoreTempMaterial();
			if (Physics.Raycast (ray,hit)){
				var hitObject:GameObject=hit.collider.gameObject;
				if(hitObject.tag=="buildingBlock"&&hit.collider.name!=sourceBlockName){
					if(Input.GetMouseButtonDown(0)){
						DestroyImmediate(hitObject);
						saveBuilding();
						calcPointOfMass();
					}
					else{
						//temporary change material
						objectWithTempDeleteMaterial = hitObject.transform.Find('Cube').transform.GetComponent.<Renderer>();
						originalMaterialBeforeChangedToDelete = objectWithTempDeleteMaterial.material;
						objectWithTempDeleteMaterial.material = deleteMaterial;
					}
				}
			}
		}
		else{
			removePlaceholders();
			if (Physics.Raycast (ray,hit)&&holding!=null){
				if(hit.collider.tag=="buildingBlock"){
					var position:Vector3=hit.collider.gameObject.GetComponent.<Rigidbody>().position;
					//calc position
					position.z = position.z+(blockHeight*hit.normal.z);
					position.x = position.x+(blockHeight*hit.normal.x);
					position.y = position.y+(blockHeight*hit.normal.y);
					//var blockHeightModifier = holding.GetComponent.<blockPropperties>().proportionalHeight;
					//position.x = position.x-((1-blockHeightModifier)/2*blockHeight*hit.normal.x);
					//position.y = position.y-((1-blockHeightModifier)/2*blockHeight*hit.normal.y);
					//position.z = position.z-((1-blockHeightModifier)/2*blockHeight*hit.normal.z);
					//if connectable
					if( (Mathf.Round(hit.normal.y)>0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePY==true) || (Mathf.Round(hit.normal.y)<0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNY==true) || (Mathf.Round(hit.normal.x)>0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePX==true) || (Mathf.Round(hit.normal.x)<0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNX==true) || (Mathf.Round(hit.normal.z)>0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachablePZ==true) || (Mathf.Round(hit.normal.z)<0 && hit.collider.gameObject.GetComponent.<blockPropperties>().attachableNZ==true)){
						//calc rotation
						var rotation : Quaternion;
						rotation.eulerAngles.x = rotation.eulerAngles.x+(90*hit.normal.z);
						rotation.eulerAngles.z = rotation.eulerAngles.z-(90*hit.normal.x);
						if(Math.Round(hit.normal.y)<0){
							rotation.eulerAngles.x = rotation.eulerAngles.x+(180*hit.normal.y);
						}
						//create Block
						var blockInstance : GameObject;
						blockInstance = Instantiate(holding,position,rotation)as GameObject;
						blockInstance.transform.SetParent(player.transform,false);
						if(Input.GetMouseButtonDown(0))
						{
							saveBuilding();
							calcPointOfMass();
						}
						else
						{
							//change it into a placeholder
							DestroyImmediate(blockInstance.transform.GetComponent.<BoxCollider>());
							if(blockInstance.transform.Find('Cube')!=null){
								blockInstance.transform.Find('Cube').transform.GetComponent.<Renderer>().material=placeholderMaterial;
							}
							blockInstance.tag="placeholder";
						}
					}
				}
			}	
		}
	}
}