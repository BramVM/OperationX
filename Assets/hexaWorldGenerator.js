#pragma strict
public var target : GameObject;
public var tile : GameObject;
public var grid_x : float;

private var midTilePosition:Vector3;
private var midTileInstance : GameObject;
private var rightTilePosition:Vector3;
private var rightTileInstance : GameObject;
private var leftTilePosition:Vector3;
private var leftTileInstance : GameObject;
private var topRightTilePosition:Vector3;
private var topRightTileInstance : GameObject;
private var topLeftTilePosition:Vector3;
private var topLeftTileInstance : GameObject;
private var bottomRightTilePosition:Vector3;
private var bottomRightTileInstance : GameObject;
private var bottomLeftTilePosition:Vector3;
private var bottomLeftTileInstance : GameObject;

private var grid_z : float;
 
function Start () {
	var grid_z = Mathf.Sqrt((Mathf.Pow((grid_x*2), 2)-Mathf.Pow((grid_x), 2)));
	Debug.Log(grid_z);
	/*get player position*/
	var playerPos_x = target.transform.position.x;
	var playerPos_z = target.transform.position.z;
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
	//create mid tile
	midTileInstance = Instantiate(tile,midTilePosition,tile.transform.rotation )as GameObject;
	//create right tile
	rightTilePosition = midTilePosition;
	rightTilePosition.x = rightTilePosition.x+2*grid_x;
	rightTileInstance = Instantiate(tile,rightTilePosition,tile.transform.rotation )as GameObject;
	//create left tile
	leftTilePosition = midTilePosition;
	leftTilePosition.x = leftTilePosition.x-2*grid_x;
	leftTileInstance = Instantiate(tile,leftTilePosition,tile.transform.rotation )as GameObject;
	//create top right tile
	topRightTilePosition = midTilePosition;
	topRightTilePosition.x = topRightTilePosition.x+grid_x;
	topRightTilePosition.z = topRightTilePosition.z+grid_z;
	topRightTileInstance = Instantiate(tile,topRightTilePosition,tile.transform.rotation )as GameObject;
	//create top left tile
	topLeftTilePosition = midTilePosition;
	topLeftTilePosition.x = topLeftTilePosition.x-grid_x;
	topLeftTilePosition.z = topLeftTilePosition.z+grid_z;
	topLeftTileInstance = Instantiate(tile,topLeftTilePosition,tile.transform.rotation )as GameObject;
	//create bottom right tile
	bottomRightTilePosition = midTilePosition;
	bottomRightTilePosition.x = bottomRightTilePosition.x+grid_x;
	bottomRightTilePosition.z = bottomRightTilePosition.z-grid_z;
	bottomRightTileInstance = Instantiate(tile,bottomRightTilePosition,tile.transform.rotation )as GameObject;
	//create bottom left tile
	bottomLeftTilePosition = midTilePosition;
	bottomLeftTilePosition.x = bottomLeftTilePosition.x-grid_x;
	bottomLeftTilePosition.z = bottomLeftTilePosition.z-grid_z;
	bottomLeftTileInstance = Instantiate(tile,bottomLeftTilePosition,tile.transform.rotation )as GameObject;
}
function Update () {
	//if closest tile is now left
		//delete tile right, bot right and topright
		//create ..
	//if closest tile is now right
		//delete tile left, botleft and topleft
		//create ..
	//if closest tile is now topLeft
		//delete tile right, botright and botleft 
		//create ..
	//if closest tile is now topRight
		//delete ..
		//create ..
	//if closest tile is now bottomleft
		//delete ..
		//create ..
	//if closest tile is now botttmright
		//delete ..
		//create ..
}