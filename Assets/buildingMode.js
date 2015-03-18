﻿#pragma strict
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
public	var buildingBlocks = new List.<blockData>();


public var player : GameObject;
public var sourceBlock : GameObject;
public var newBlock : GameObject;
public var placeHolder : GameObject;
public var blockHeight : float;
public var breakForce : float;
public var breakTorque : float;
public var buildingMode : boolean = true;
private var joint: FixedJoint;

public var blankBlockName : String;
public var sourceBlockName : String;

function saveBuiling(){
	var test = new List.<int>();
	for(var k : int = 0; k < 5; k++){
		test.Add(k);
		Debug.Log(k + ' ' + test[k]);
	}
	for(var l : int = 0; l < test.Count; l++){
		Debug.Log(l + ' ' + test[l]);
	}
	//format Data
	var taggedBuildingBlocks: GameObject[];
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	var buildingBlock = new blockData();
	for(var i : int = 0; i < taggedBuildingBlocks.length; i++){
		buildingBlocks.Add(buildingBlock);
		//type
		if(taggedBuildingBlocks[i].name == sourceBlockName ){
			buildingBlocks[i].type=0;
		}
		if(taggedBuildingBlocks[i].name == blankBlockName ){
			buildingBlocks[i].type=1;
		}
		//positon x
		buildingBlocks[i].x=Mathf.FloorToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.x/blockHeight);
		//positon y
		buildingBlocks[i].y=Mathf.FloorToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.y/blockHeight);
		//positon z
		buildingBlocks[i].z=Mathf.FloorToInt(taggedBuildingBlocks[i].GetComponent.<Rigidbody>().position.z/blockHeight);
		Debug.Log(i + ' ' + buildingBlocks[i].x);
	}
	for(var j : int = 0; j < buildingBlocks.Count; j++){
		Debug.Log(j + ' ' + buildingBlocks[j].x);
	}
	//save data
	var bf : BinaryFormatter = new BinaryFormatter();
	var file : FileStream;
	if(File.Exists(Application.persistentDataPath + "/building.dat")){
		file = File.Open(Application.persistentDataPath + "/building.dat", FileMode.Open);
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
		buildFromData();
	}
}

function buildFromData(){
	var blockInstance: GameObject;
	var buildingBlock = new blockData();
	for(var i : int = 0; i < buildingBlocks.Count; i++){
		buildingBlock=buildingBlocks[i];
		var intValue : int;
		var blockPosition : Vector3;
		//positon x
		intValue = buildingBlock.x;
		Debug.Log(buildingBlock.x);
		blockPosition.x=intValue*blockHeight;
		//positon y
		intValue = buildingBlock.y;
		blockPosition.y=intValue*blockHeight;
		//positon z
		intValue = buildingBlock.z;
		blockPosition.z=intValue*blockHeight;
		
		switch (buildingBlock.type){
			case 0:
				blockInstance = Instantiate(sourceBlock,blockPosition, player.transform.rotation)as GameObject;
				blockInstance.transform.SetParent(player.transform,false);
				break;
			case 1:
				blockInstance = Instantiate(newBlock,blockPosition, player.transform.rotation)as GameObject;
				blockInstance.transform.SetParent(player.transform,false);
				break;
		}
	}
}

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

function removePlaceholders(){
	var placeholders: GameObject[];
	placeholders = player.FindGameObjectsWithTag ("placeholder");
	for(var i : int = 0; i < placeholders.length; i++)
	{
		Destroy (placeholders[i]);
	}
}
function Start(){
	var blockInstance: GameObject;
	var initPosition: Vector3;
	initPosition.x=0;
	initPosition.y=6;
	initPosition.z=0;
	blockInstance = Instantiate(sourceBlock,initPosition, player.transform.rotation)as GameObject;
	blockInstance.transform.SetParent(player.transform,false);
}
function Update (){	
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