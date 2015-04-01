#pragma strict

public var controlePannel:GameObject;
public var keyMap:GameObject;

public var sourceBlockName : String;
public var blankBlockName : String;
public var thrustBlockName : String;
public var stabilizerBlockName : String;

private var buildingBlockInstance : GameObject;

function setControleOptions (selectedBlock:GameObject) {
	buildingBlockInstance=selectedBlock;
	controlePannel.SetActive(true);
	keyMap.SetActive(false);
	if(buildingBlockInstance.name==thrustBlockName){
		keyMap.SetActive(true);
	}
}

function mapKey (){
	Debug.Log(keyMap.GetComponent(InputField).text);
}