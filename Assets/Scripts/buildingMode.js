#pragma strict
import System.Linq;
import System.Collections.Generic;
import System;
import System.Runtime.Serialization.Formatters.Binary;
import System.IO;

//[Serializable]
public class blockData{
	var type : int;
	var x : int;
	var y : int;
	var z : int;
}

public var player : GameObject;
public var sourceBlock : GameObject;
public var newBlock : GameObject;
public var placeHolder : GameObject;
public var blockHeight : float;
public var breakForce : float;
public var breakTorque : float;
public var buildingMode : boolean = true;
public var deleteMaterial: Material;
public var placeholderMaterial: Material;

private var joint: FixedJoint;
private	var buildingBlocks = new List.<blockData>();
private var removalMode : boolean = false;
private var cam : GameObject;
private var holding : GameObject;
private var objectWithTempDeleteMaterial: Renderer;
private var originalMaterialBeforeChangedToDelete: Material;

public var blankBlockName : String;
public var sourceBlockName : String;

function removeBuildingBlock(blockInstance: GameObject){
	Destroy (blockInstance);
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
		Destroy (placeholders[i]);
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
	var taggedBuildingBlocks: GameObject[];
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	buildingBlocks.Clear();
	for(var i : int = 0; i < taggedBuildingBlocks.length; i++){
		buildingBlocks.Add(new blockData());
		//type
		if(taggedBuildingBlocks[i].name == sourceBlockName ){
			buildingBlocks[i].type=0;
		}
		if(taggedBuildingBlocks[i].name == blankBlockName ){
			buildingBlocks[i].type=1;
		}
		//positon x
		buildingBlocks[i].x=Mathf.RoundToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.x/blockHeight);
		//positon y
		buildingBlocks[i].y=Mathf.RoundToInt((taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.y-blockHeight/2)/blockHeight);
		//positon z
		buildingBlocks[i].z=Mathf.RoundToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.z/blockHeight);
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
		removeBuildingBlock(taggedBuildingBlocks[j]);
	}
	var blockInstance: GameObject;
	var buildingBlock = new blockData();
	for(var i : int = 0; i < buildingBlocks.Count; i++){
		buildingBlock=buildingBlocks[i];
		var intValue : int;
		var blockPosition : Vector3;
		//positon x
		intValue = buildingBlock.x;
		blockPosition.x=intValue*blockHeight;
		//positon y
		intValue = buildingBlock.y;
		blockPosition.y=intValue*blockHeight+blockHeight/2;
		//positon z
		intValue = buildingBlock.z;
		blockPosition.z=intValue*blockHeight;
		
		switch (buildingBlock.type){
			case 0:
				blockInstance = Instantiate(sourceBlock,blockPosition, player.transform.rotation)as GameObject;
				blockInstance.transform.SetParent(player.transform,false);
				cam.GetComponent.<cameraMovement>().target = blockInstance.transform;
				break;
			case 1:
				blockInstance = Instantiate(newBlock,blockPosition, player.transform.rotation)as GameObject;
				blockInstance.transform.SetParent(player.transform,false);
				break;
		}
		createJoints(blockInstance);
	}
}
function createJoints(blockInstance: GameObject){
	var newBlockPosition:Vector3=blockInstance.GetComponent.<Rigidbody>().position;
	var buildingBlocks: GameObject[];
	buildingBlocks = GameObject.FindGameObjectsWithTag ("buildingBlock");
	for(var i=0;i<buildingBlocks.length;i++) {
		var blockPosition:Vector3=buildingBlocks[i].GetComponent.<Rigidbody>().position;
		//if next to
		var match1:Vector3=(newBlockPosition);
		match1.x=match1.x+blockHeight;
		var match2:Vector3=(newBlockPosition);
		match2.x=match2.x-blockHeight;
		var match3:Vector3=(newBlockPosition);
		match3.y=match3.y+blockHeight;
		var match4:Vector3=(newBlockPosition);
		match4.y=match4.y-blockHeight;
		var match5:Vector3=(newBlockPosition);
		match5.z=match5.z+blockHeight;
		var match6:Vector3=(newBlockPosition);
		match6.z=match6.z-blockHeight;
		if(blockPosition==match1||blockPosition==match2||blockPosition==match3||blockPosition==match4||blockPosition==match5||blockPosition==match6){
			joint = blockInstance.AddComponent.<FixedJoint>();
			joint.connectedBody = buildingBlocks[i].GetComponent.<Rigidbody>();
			joint.breakForce = breakForce;
			joint.breakTorque = breakTorque;
		}
	}
}
function enterBuildingMode(){
	buildingMode=true;
	loadBuiling();
}

function exitBuildingMode(){
	buildingMode=false;
	removePlaceholders();
	var buildingBlocks: GameObject[];
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
	initPosition.x=0;
	initPosition.y=6;
	initPosition.z=0;
	blockInstance = Instantiate(sourceBlock,initPosition, player.transform.rotation)as GameObject;
	blockInstance.transform.SetParent(player.transform,false);
	cam.GetComponent.<cameraMovement>().target = blockInstance.transform;
}
function Start(){
	loadBuiling();
}
function removeJoints(blockInstance: GameObject){
	var buildingBlocks: GameObject[];
	buildingBlocks = GameObject.FindGameObjectsWithTag ("buildingBlock");
	var joints: Component[];
	joints = blockInstance.GetComponents.<FixedJoint>() as Component[];
	for(var k=0;k<joints.length;k++) {
	    Destroy(joints[k] as FixedJoint);
	}
	for(var j=0;j<buildingBlocks.length;j++) {
		joints = buildingBlocks[j].GetComponents.<FixedJoint>() as Component[];
		for(var i : int = 0; i < joints.length; i++){
			joint=joints[i];
			if(joint.connectedBody == blockInstance.GetComponent.<Rigidbody>()){
	        	Destroy(joints[i] as FixedJoint);
	        }	
		}
	}
}
function Update (){	
	if(buildingMode){
		var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		if(removalMode){
			restoreTempMaterial();
			if (Physics.Raycast (ray,hit)){
				if(hit.collider.tag=="buildingBlock"&&hit.collider.name!=sourceBlockName){
					if(Input.GetMouseButtonDown(0)){
						Destroy(hit.collider.gameObject);
						Debug.Log("destroy " + hit.collider.gameObject);
						saveBuilding();
					}
					else{
						//temporary change material
						objectWithTempDeleteMaterial = hit.collider.gameObject.transform.Find('Cube').transform.GetComponent.<Renderer>();
						originalMaterialBeforeChangedToDelete = objectWithTempDeleteMaterial.material;
						objectWithTempDeleteMaterial.material = deleteMaterial;
					}
				}
			}
		}
		else{
			removePlaceholders();
			if (Physics.Raycast (ray,hit)){
				if(hit.collider.tag=="buildingBlock"){
					var position:Vector3=hit.collider.gameObject.GetComponent.<Rigidbody>().position;
					position.z = position.z+(blockHeight*hit.normal.z);
					position.x = position.x+(blockHeight*hit.normal.x);
					position.y = position.y+(blockHeight*hit.normal.y);
					var blockInstance : GameObject;
					blockInstance = Instantiate(newBlock,position,hit.collider.gameObject.GetComponent.<Rigidbody>().rotation)as GameObject;
					blockInstance.transform.SetParent(player.transform,false);
					if(Input.GetMouseButtonDown(0))
					{
						saveBuilding();
					}
					else
					{
						//change it into a placeholder
						Destroy(blockInstance.transform.GetComponent.<BoxCollider>());
						blockInstance.transform.Find('Cube').transform.GetComponent.<Renderer>().material=placeholderMaterial;
						blockInstance.tag="placeholder";
					}
				}
			}	
		}
	}
}