#pragma strict
public var player : GameObject;
public var tile : GameObject;
public var grid_x : float;
public var generatorRange:int;

private var midTilePosition:Vector3;
private var prevMidTilePosition:Vector3;
private var tileInstance : GameObject;

private var tileScale;
private var grid_z : float;

function initTiles(){
	/*get player position*/
	var playerPos_x = player.transform.position.x;
	var playerPos_z = player.transform.position.z;
	/*get amount of gridlines between player position and origin*/
	var gridNumber_x1: int = Mathf.FloorToInt(playerPos_x / grid_x);
	var gridNumber_z1: int = Mathf.FloorToInt(playerPos_z / grid_z);
	/*get gridline number of the line after the player startng from origin*/
	var gridNumber_x2: int = Mathf.CeilToInt(playerPos_x / grid_x) ;
	var gridNumber_z2: int = Mathf.CeilToInt(playerPos_z / grid_z) ;
	//check wich z-grid line i closest
	if(Mathf.Pow(gridNumber_z2*grid_z,2)-Mathf.Pow(playerPos_z,2) >= Mathf.Pow(playerPos_z,2)-Mathf.Pow(gridNumber_z1*grid_z,2)){
		//closer to z1
		if(gridNumber_x1%2==0&&gridNumber_x1%2==0){
			midTilePosition.x=gridNumber_x1*grid_x;
			midTilePosition.z=gridNumber_z1*grid_z;
		}
		else{
			midTilePosition.x=gridNumber_x2*grid_x;
			midTilePosition.z=gridNumber_z1*grid_z;
		}
	}
	else{
		//closer to z2
		if(gridNumber_x1%2==0&&gridNumber_x1%2==0){
			midTilePosition.x=gridNumber_x2*grid_x;
			midTilePosition.z=gridNumber_z2*grid_z;
		}
		else{
			midTilePosition.x=gridNumber_x1*grid_x;
			midTilePosition.z=gridNumber_z2*grid_z;
		}
	}
	//topRightQuarter
	var newPos = midTilePosition;
	var zRowCount:int=0;
	while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
		zRowCount++;
		if(zRowCount%2==0){
			newPos.x=newPos.x+grid_x;
		}
		while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
			//newPos.y=5*Mathf.Sin(0.2+(newPos.x*newPos.z*0.08))*Mathf.Cos(0.4+newPos.x*newPos.z*0.3);
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
			newPos.x=newPos.x+grid_x*2;
		}
		newPos.x=midTilePosition.x;
		newPos.z=newPos.z+grid_z;
	}
	//topLeftQuarter
	newPos = midTilePosition;
	newPos.x=midTilePosition.x-grid_x*2;
	zRowCount=0;
	while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
		zRowCount++;
		if(zRowCount%2==0){
			newPos.x=newPos.x+grid_x;
		}
		while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
			//newPos.y=5*Mathf.Sin(0.2+(newPos.x*newPos.z*0.08))*Mathf.Cos(0.4+newPos.x*newPos.z*0.3);
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
			newPos.x=newPos.x-grid_x*2;
		}
		newPos.x=midTilePosition.x-grid_x*2;
		newPos.z=newPos.z+grid_z;
	}
	//botRightQuarter
	newPos = midTilePosition;
	zRowCount=1;
	newPos.z=newPos.z-grid_z;
	while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
		zRowCount++;
		if(zRowCount%2==0){
			newPos.x=newPos.x+grid_x;
		}
		while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
			//newPos.y=5*Mathf.Sin(0.2+(newPos.x*newPos.z*0.08))*Mathf.Cos(0.4+newPos.x*newPos.z*0.3);
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
			newPos.x=newPos.x+grid_x*2;
		}
		newPos.x=midTilePosition.x;
		newPos.z=newPos.z-grid_z;
	}
	//botLeftQuarter
	newPos = midTilePosition;
	newPos.x=midTilePosition.x-grid_x*2;
	zRowCount=1;
	newPos.z=newPos.z-grid_z;
	while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
		zRowCount++;
		if(zRowCount%2==0){
			newPos.x=newPos.x+grid_x;
		}
		while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
			//newPos.y=5*Mathf.Sin(0.2+(newPos.x*newPos.z*0.08))*Mathf.Cos(0.4+newPos.x*newPos.z*0.3);
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			//Debug.Log(Mathf.Sin(0.2+(newPos.x*newPos.y*0.08))*Mathf.Cos(0.4+newPos.x*newPos.y*0.3));
			tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
			newPos.x=newPos.x-grid_x*2;
		}
		newPos.x=midTilePosition.x-grid_x*2;
		newPos.z=newPos.z-grid_z;
	}
	prevMidTilePosition = midTilePosition;
};
function Start () {
    grid_z = Mathf.Sqrt((Mathf.Pow((grid_x*2), 2)-Mathf.Pow((grid_x), 2)));
	tileScale = grid_x * 1.90; //<--THIS NUMBER NEEDS TRUE VALUE
	initTiles();
};
function seed(i:float){
	return 5*Mathf.Sin(0.2+(i*0.08))*Mathf.Cos(0.4+i*0.3);
}
function generateWorld(){
	/*get player position*/
	var playerPos_x = player.transform.position.x;
	var playerPos_z = player.transform.position.z;
	/*get amount of gridlines between player position and origin*/
	var gridNumber_x1: int = Mathf.FloorToInt(playerPos_x / grid_x);
	var gridNumber_z1: int = Mathf.FloorToInt(playerPos_z / grid_z);
	/*get gridline number of the line after the player startng from origin*/
	var gridNumber_x2: int = Mathf.CeilToInt(playerPos_x / grid_x) ;
	var gridNumber_z2: int = Mathf.CeilToInt(playerPos_z / grid_z) ;
	//check wich z-grid line is closest
	if(Mathf.Pow(gridNumber_z2*grid_z,2)-Mathf.Pow(playerPos_z,2) >= Mathf.Pow(playerPos_z,2)-Mathf.Pow(gridNumber_z1*grid_z,2)){
		//closer to z1
		if(gridNumber_x1%2==0&&gridNumber_x1%2==0){
			midTilePosition.x=gridNumber_x1*grid_x;
			midTilePosition.z=gridNumber_z1*grid_z;
		}
		else{
			midTilePosition.x=gridNumber_x2*grid_x;
			midTilePosition.z=gridNumber_z1*grid_z;
		}
	}
	else{
		//closer to z2
		if(gridNumber_x1%2==0&&gridNumber_x1%2==0){
			midTilePosition.x=gridNumber_x2*grid_x;
			midTilePosition.z=gridNumber_z2*grid_z;
		}
		else{
			midTilePosition.x=gridNumber_x1*grid_x;
			midTilePosition.z=gridNumber_z2*grid_z;
		}
	}
	if(prevMidTilePosition != midTilePosition){
		Debug.Log('mooved a tile');
		//moveTiles
		var translation = prevMidTilePosition-midTilePosition;
		var tiles= new GameObject[0];
		var seedRef:float;
		//taggedBuildingBlocks.Clear();
		tiles = GameObject.FindGameObjectsWithTag ("tile");
		for(var i : int = 0; i < tiles.length; i++){
			tiles[i].transform.position = tiles[i].transform.position-translation;
			seedRef = tiles[i].transform.position.x+tiles[i].transform.position.z;
			tiles[i].transform.position.y = seed(seedRef);
		}
		
	}
	prevMidTilePosition = midTilePosition;
};