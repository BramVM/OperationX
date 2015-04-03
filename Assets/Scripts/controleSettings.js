#pragma strict

public var controlePannel:GameObject;
public var keyMap:GameObject;

public var sourceBlockName : String;
public var blankBlockName : String;
public var thrustBlockName : String;
public var stabilizerBlockName : String;
public var controles = new Array();
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
 	Debug.Log(lastChar);
 	//if(buildingBlockInstance.GetComponent(thrust)!=null){
 		buildingBlockInstance.GetComponent(thrust).key=lastChar;
 	//}
}

function loadControles(){
	if(File.Exists(Application.persistentDataPath + "/controles.dat")){
		var bf : BinaryFormatter = new BinaryFormatter();
		var file : FileStream = File.Open(Application.persistentDataPath + "/controles.dat", FileMode.Open);
		controles = bf.Deserialize(file);
		file.Close();
	}
}

function saveControles(id:int,key:String){
	for(var i : int = 0; i < controles.length; i++){
		if(controles[i].id==id){
			controles[i].key=key;
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