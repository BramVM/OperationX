#pragma strict
import System.Collections.Generic;
public var player : GameObject;
public var tile : GameObject;
public var midTile:GameObject;
public var grid_x : float;
public var generatorRange:int;
public var floorMaterial:Material;

private var midTilePosition:Vector3;
private var prevMidTilePosition:Vector3;
private var tileInstance : GameObject;

private var tileScale;
private var grid_z : float;
function checkMidTilePosition(){
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
}
function initTiles(){
	checkMidTilePosition();
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
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			drawHexagonMesh(tileInstance);
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
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			drawHexagonMesh(tileInstance);
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
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			drawHexagonMesh(tileInstance);
			newPos.x=newPos.x+grid_x*2;
		}
		newPos.x=midTilePosition.x*2;
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
			tileInstance = Instantiate(tile,newPos,tile.transform.rotation )as GameObject;
			drawHexagonMesh(tileInstance);
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
private var Vertices: Vector3[] = new Vector3[12];
private var UV: Vector2[] = new Vector2[12];
private var Triangles:int[] = new int[12];
function drawHexagonMesh(tile:GameObject){
 	MeshSetup(tile.transform.position);
    var stuff:Mesh  = new Mesh();
    stuff.vertices = Vertices;
    stuff.triangles = Triangles;
    stuff.uv = UV;
    tile.AddComponent.<MeshFilter>().mesh = stuff;
    tile.AddComponent.<MeshRenderer>();
    tile.GetComponent.<Renderer>().material=floorMaterial;
    tile.AddComponent.<MeshCollider>().sharedMesh = stuff;
}
function MeshSetup(mid:Vector3){
	var hexSide = 2*grid_x/Mathf.Tan(60*Mathf.PI/180);
 	Vertices[0] = new Vector3(-grid_x,seed(mid.x-grid_x,mid.z+hexSide/2),hexSide/2);
 	Vertices[1] = new Vector3(grid_x,seed(mid.x+grid_x,mid.z+hexSide/2),hexSide/2);
 	Vertices[2] = new Vector3(-grid_x,seed(mid.x-grid_x,mid.z-hexSide/2),-hexSide/2);
 	Vertices[3] = new Vector3(grid_x,seed(mid.x+grid_x,mid.z-hexSide/2),-hexSide/2);
 	Vertices[4] = new Vector3(-grid_x,seed(mid.x-grid_x,mid.z-hexSide/2),-hexSide/2);
 	Vertices[5] = new Vector3(grid_x,seed(mid.x+grid_x,mid.z+hexSide/2),hexSide/2);
 	Vertices[6] = new Vector3(0,seed(mid.x,mid.z-hexSide),-hexSide);
 	Vertices[7] = new Vector3(-grid_x,seed(mid.x-grid_x,mid.z-hexSide/2),-hexSide/2);
 	Vertices[8] = new Vector3(grid_x,seed(mid.x+grid_x,mid.z-hexSide/2),-hexSide/2);
 	Vertices[9] = new Vector3(grid_x,seed(mid.x+grid_x,mid.z+hexSide/2),hexSide/2);
 	Vertices[10] = new Vector3(-grid_x,seed(mid.x-grid_x,mid.z+hexSide/2),hexSide/2);
 	Vertices[11] = new Vector3(0,seed(mid.x,mid.z+hexSide),hexSide);
 	var uvRes=1;
 	UV[0] = new Vector2(0,1-(0.5/Mathf.Tan(60*Mathf.PI/180)));
 	UV[1] = new Vector2(1,1-(0.5/Mathf.Tan(60*Mathf.PI/180)));
 	UV[2] = new Vector2(0,0.5/Mathf.Tan(60*Mathf.PI/180));
 	UV[3] = new Vector2(1,0.5/Mathf.Tan(60*Mathf.PI/180));
 	UV[4] = new Vector2(0,0.5/Mathf.Tan(60*Mathf.PI/180));
 	UV[5] = new Vector2(1,1-(0.5/Mathf.Tan(60*Mathf.PI/180)));
 	UV[6] = new Vector2(0.5,0);
 	UV[7] = new Vector2(0,0.5/Mathf.Tan(60*Mathf.PI/180));
 	UV[8] = new Vector2(1,0.5/Mathf.Tan(60*Mathf.PI/180));
 	UV[9] = new Vector2(1,1-(0.5/Mathf.Tan(60*Mathf.PI/180)));
 	UV[10] = new Vector2(0,1-(0.5/Mathf.Tan(60*Mathf.PI/180)));
 	UV[11] = new Vector2(0.5,1);
 	Triangles[0] = 0;
 	Triangles[1] = 1;
 	Triangles[2] = 2;
 	Triangles[3] = 3;
 	Triangles[4] = 4;
 	Triangles[5] = 5;
 	Triangles[6] = 6;
 	Triangles[7] = 7;
 	Triangles[8] = 8;
 	Triangles[9] = 9;
 	Triangles[10] = 10;
 	Triangles[11] = 11;	
}
function generateWorld(){
	checkMidTilePosition();
	if(prevMidTilePosition != midTilePosition){
		//destroy out of reach
		
		//if none existing 
		
	}
	prevMidTilePosition = midTilePosition;
};