#pragma strict

public var controlePannel:GameObject;
public var keyMap:GameObject;
public var player : GameObject;
public var sourceBlockName : String;
public var blankBlockName : String;
public var thrustBlockName : String;
public var stabilizerBlockName : String;
public var controles = new List.<controleData>();
public class controleData{
	var id : int;
	var key : String;
}

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
 	var lastChar: String = keyMap.GetComponent(InputField).text.Substring(keyMap.GetComponent(InputField).text.Length-1);
 	keyMap.GetComponent(InputField).text=lastChar;
 	if(buildingBlockInstance.GetComponent(thrust)!=null){
 		buildingBlockInstance.GetComponent(thrust).key=lastChar;
 	}
 	saveControles();
}
function removeControle(){
	saveControles();
}
function generateControles(){
	for(var i : int = 0; i < controles.Count; i++){
		var taggedBuildingBlocks= new GameObject[0];
		taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
		if(controles[i].id<taggedBuildingBlocks.Length){
			if(taggedBuildingBlocks[controles[i].id].GetComponent(thrust)!=null){
	 			taggedBuildingBlocks[controles[i].id].GetComponent(thrust).key=controles[i].key;
	 		}
	 	}
	}
}

function loadControles(){
	if(File.Exists(Application.persistentDataPath + "/controles.dat")){
		var bf : BinaryFormatter = new BinaryFormatter();
		var file : FileStream = File.Open(Application.persistentDataPath + "/controles.dat", FileMode.Open);
		controles = bf.Deserialize(file);
		file.Close();
		generateControles();
	}
}

function saveControles(){
	var taggedBuildingBlocks= new GameObject[0];
	taggedBuildingBlocks = player.FindGameObjectsWithTag ("buildingBlock");
	var notFound = true;
	var key:String;
	for(var j : int = 0; j < taggedBuildingBlocks.length; j++){
		if(taggedBuildingBlocks[j].GetComponent(thrust)!=null){
			key = taggedBuildingBlocks[j].GetComponent(thrust).key;
			if (key.Length>0){
				notFound = true;
				for(var i : int = 0; i < controles.Count; i++){
					if(controles[i].id==j){
						notFound=false;
						controles[i].key=key;
					}
				}
				if(notFound){
					controles.Add(new controleData());
					controles[controles.Count-1].id=j;
					controles[controles.Count-1].key=key;
				}
			}
		}
	}
	//save data
	var bf : BinaryFormatter = new BinaryFormatter();
	var file : FileStream;
	if(File.Exists(Application.persistentDataPath + "/controles.dat")){
		file = File.Open(Application.persistentDataPath + "/controles.dat", FileMode.Create, FileAccess.Write, FileShare.None);
	}
	else{
		file = File.Create(Application.persistentDataPath + "/controles.dat");
	}
	bf.Serialize(file,controles);
	file.Close();
}