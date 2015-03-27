#pragma strict
public var player : GameObject;
public var tile : GameObject;
public var midTile:GameObject;
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
	var gridNumber_x:int = Mathf.RoundToInt(playerPos_x / grid_x);
	var gridNumber_z:int = Mathf.RoundToInt(playerPos_z / grid_z);
	//check wich z-grid line is closest
	midTilePosition.x=gridNumber_x*grid_x;
	midTilePosition.z=gridNumber_z*grid_z;
	if(Mathf.Abs(gridNumber_z%2)-Mathf.Abs(gridNumber_x%2)!=0){
		if(gridNumber_x%grid_x>gridNumber_z%grid_z){
			if(gridNumber_x*grid_x-playerPos_x<0){
				midTilePosition.x=(gridNumber_x+1)*grid_x;
			}
			else{
				midTilePosition.x=(gridNumber_x-1)*grid_x;
			}
		}
		else{
			if(gridNumber_z*grid_z-playerPos_z<0){
				midTilePosition.z=(gridNumber_z+1)*grid_z;
			}
			else{
				midTilePosition.z=(gridNumber_z-1)*grid_z;
			}
		}
	}
	midTilePosition.y=midTilePosition.y;
	//topRightQuarter
	var newPos = midTilePosition;
	var zRowCount:int=0;
	while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
		zRowCount++;
		if(zRowCount%2==0){
			newPos.x=newPos.x+grid_x;
		}
		var xCount:int=0;
		while(Mathf.Sqrt(Mathf.Pow(newPos.z-midTilePosition.z, 2)+Mathf.Pow(newPos.x-midTilePosition.x, 2))<generatorRange+grid_x){
			if(xCount==0&&zRowCount==1){
				newPos.y = seed(newPos.x,newPos.z);
				tileInstance = Instantiate(midTile,newPos,tile.transform.rotation )as GameObject;
				tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
				newPos.x=newPos.x+grid_x*2;
				xCount++;
			}
			else{
				newPos.y = seed(newPos.x,newPos.z);
				tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
				tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
				newPos.x=newPos.x+grid_x*2;
				xCount++;
			}
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			tileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
			newPos.x=newPos.x+grid_x*2;
			xCount++;
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
			newPos.y = seed(newPos.x,newPos.z);
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
			newPos.y = seed(newPos.x,newPos.z);
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
			newPos.y = seed(newPos.x,newPos.z);
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
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
function seed(x:float,z:float){
	var i=x+z;
	var amplitude=50;
	var frequency=0.002;
	var offset=0;
	var newSin:float;
	var result:float;
	for (var j:int=0;j<10;j++){
		amplitude=amplitude/2;
		frequency=frequency*2;
		newSin=amplitude*Mathf.Sin(((i+offset)*frequency));
		offset=offset+1000;
		result=result+newSin;
		result=result-amplitude/2;
	}
	return result;
}
function generateWorld(){
	/*get player position*/
	var playerPos_x = player.transform.position.x;
	var playerPos_z = player.transform.position.z;
	/*get amount of gridlines between player position and origin*/
	var gridNumber_x:int = Mathf.RoundToInt(playerPos_x / grid_x);
	var gridNumber_z:int = Mathf.RoundToInt(playerPos_z / grid_z);
	//check wich z-grid line is closest
	midTilePosition.x=gridNumber_x*grid_x;
	midTilePosition.z=gridNumber_z*grid_z;
	if(Mathf.Abs(gridNumber_z%2)-Mathf.Abs(gridNumber_x%2)!=0){
		if(gridNumber_x%grid_x>gridNumber_z%grid_z){
			if(gridNumber_x*grid_x-playerPos_x<0){
				midTilePosition.x=(gridNumber_x+1)*grid_x;
			}
			else{
				midTilePosition.x=(gridNumber_x-1)*grid_x;
			}
		}
		else{
			if(gridNumber_z*grid_z-playerPos_z<0){
				midTilePosition.z=(gridNumber_z+1)*grid_z;
			}
			else{
				midTilePosition.z=(gridNumber_z-1)*grid_z;
			}
		}
	}
	
	if(prevMidTilePosition != midTilePosition){
		Debug.Log(prevMidTilePosition + " "+midTilePosition);
		var translation:Vector3;
		translation.x = prevMidTilePosition.x-midTilePosition.x;
		translation.z = prevMidTilePosition.z-midTilePosition.z;
		Debug.Log(translation.x);
		Debug.Log(translation.z);
		var tiles= new GameObject[0];
		tiles = GameObject.FindGameObjectsWithTag ("tile");
		for(var i : int = 0; i < tiles.length; i++){
			tiles[i].transform.position.x = tiles[i].transform.position.x-translation.x;
			tiles[i].transform.position.z = tiles[i].transform.position.z-translation.z;
			tiles[i].transform.position.y = seed(tiles[i].transform.position.x,tiles[i].transform.position.z);
		}
		
	}
	prevMidTilePosition = midTilePosition;
};