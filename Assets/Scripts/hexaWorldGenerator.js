#pragma strict
public var player : GameObject;
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

private var tileScale;
private var grid_z : float;
 
function Start () {
    grid_z = Mathf.Sqrt((Mathf.Pow((grid_x*2), 2)-Mathf.Pow((grid_x), 2)));
	tileScale = grid_x * 1.90; //<--THIS NUMBER NEEDS TRUE VALUE
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
	//create mid tile
	midTileInstance = Instantiate(tile,midTilePosition,tile.transform.rotation )as GameObject;
	midTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	midTileInstance.name = "tileMid";
	//create right tile
	rightTilePosition = midTilePosition;
	rightTilePosition.x = rightTilePosition.x+2*grid_x;
	rightTileInstance = Instantiate(tile,rightTilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileRight";
	//create left tile
	leftTilePosition = midTilePosition;
	leftTilePosition.x = leftTilePosition.x-2*grid_x;
	leftTileInstance = Instantiate(tile,leftTilePosition,tile.transform.rotation )as GameObject;
	leftTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	leftTileInstance.name = "tileLeft";
	//create top right tile
	topRightTilePosition = midTilePosition;
	topRightTilePosition.x = topRightTilePosition.x+grid_x;
	topRightTilePosition.z = topRightTilePosition.z+grid_z;
	topRightTileInstance = Instantiate(tile,topRightTilePosition,tile.transform.rotation )as GameObject;
	topRightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	topRightTileInstance.name = "tileTopRight";
	//create top left tile
	topLeftTilePosition = midTilePosition;
	topLeftTilePosition.x = topLeftTilePosition.x-grid_x;
	topLeftTilePosition.z = topLeftTilePosition.z+grid_z;
	topLeftTileInstance = Instantiate(tile,topLeftTilePosition,tile.transform.rotation )as GameObject;
	topLeftTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	topLeftTileInstance.name = "tileTopLeft";
	//create bottom right tile
	bottomRightTilePosition = midTilePosition;
	bottomRightTilePosition.x = bottomRightTilePosition.x+grid_x;
	bottomRightTilePosition.z = bottomRightTilePosition.z-grid_z;
	bottomRightTileInstance = Instantiate(tile,bottomRightTilePosition,tile.transform.rotation )as GameObject;
	bottomRightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	bottomRightTileInstance.name = "tileBotRight";
	//create bottom left tile
	bottomLeftTilePosition = midTilePosition;
	bottomLeftTilePosition.x = bottomLeftTilePosition.x-grid_x;
	bottomLeftTilePosition.z = bottomLeftTilePosition.z-grid_z;
	bottomLeftTileInstance = Instantiate(tile,bottomLeftTilePosition,tile.transform.rotation )as GameObject;
	bottomLeftTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	bottomLeftTileInstance.name = "tileBotLeft";
};

InvokeRepeating("checkPlayerPosition", 1, 1);

function FixedUpdate(){
	var playerPos:Vector3 = player.transform.position;
	var direction = transform.TransformDirection (Vector3.down);
	var hit : RaycastHit;
	
	if (Physics.Raycast (playerPos, direction, hit, 1000)) {
		var lastHit = hit.collider.gameObject.name;
		switch (lastHit)
	    {
	    case "tileRight":
		   	Destroy(GameObject.Find("tileLeft"));
		   	Destroy(GameObject.Find("tileTopLeft"));
		   	Destroy(GameObject.Find("tileBotLeft"));
	    	GameObject.Find("tileMid").name = "tileLeft";
	    	GameObject.Find("tileTopRight").name = "tileTopLeft";
	    	GameObject.Find("tileBotRight").name = "tileBotLeft";
	        GameObject.Find("tileRight").name = "tileMid";
	        instantiateTileRight();
	        instantiateTileBotRight();
	        instantiateTileTopRight();
	        break;
	    case "tileLeft":
	    	Destroy(GameObject.Find("tileRight"));
		   	Destroy(GameObject.Find("tileTopRight"));
		   	Destroy(GameObject.Find("tileBotRight"));
	        GameObject.Find("tileMid").name = "tileRight";
	        GameObject.Find("tileTopLeft").name = "tileTopRight";
	    	GameObject.Find("tileBotLeft").name = "tileBotRight";
	    	GameObject.Find("tileLeft").name = "tileMid";
	        instantiateTileLeft();
	        instantiateTileBotLeft();
	        instantiateTileTopLeft();
	        break;
	    case "tileTopRight":
	        Destroy(GameObject.Find("tileLeft"));
		   	Destroy(GameObject.Find("tileBotLeft"));
		   	Destroy(GameObject.Find("tileBotRight"));
	        GameObject.Find("tileMid").name = "tileBotLeft";
	        GameObject.Find("tileTopLeft").name = "tileLeft";
	    	GameObject.Find("tileRight").name = "tileBotRight";
	    	GameObject.Find("tileTopRight").name = "tileMid";
	        instantiateTileRight();
	        instantiateTileTopRight();
	        instantiateTileTopLeft();
	        break;
	    case "tileTopLeft":
	        Destroy(GameObject.Find("tileRight"));
		   	Destroy(GameObject.Find("tileBotLeft"));
		   	Destroy(GameObject.Find("tileBotRight"));
	        GameObject.Find("tileMid").name = "tileBotRight";
	        GameObject.Find("tileTopLeft").name = "tileMid";
	    	GameObject.Find("tileLeft").name = "tileBotLeft";
	    	GameObject.Find("tileTopRight").name = "tileRight";
	        instantiateTileLeft();
	        instantiateTileTopRight();
	        instantiateTileTopLeft();
	        break;
	    case "tileBotRight":
	        Destroy(GameObject.Find("tileLeft"));
		   	Destroy(GameObject.Find("tileTopLeft"));
		   	Destroy(GameObject.Find("tileTopRight"));
	        GameObject.Find("tileMid").name = "tileTopLeft";
	        GameObject.Find("tileRight").name = "tileTopRight";
	    	GameObject.Find("tileBotLeft").name = "tileLeft";
	    	GameObject.Find("tileBotRight").name = "tileMid";
	        instantiateTileRight();
	        instantiateTileBotLeft();
	        instantiateTileBotRight();
	        break;
	    case "tileBotLeft":
	        Destroy(GameObject.Find("tileRight"));
		   	Destroy(GameObject.Find("tileTopLeft"));
		   	Destroy(GameObject.Find("tileTopRight"));
	        GameObject.Find("tileMid").name = "tileTopRight";
	        GameObject.Find("tileLeft").name = "tileTopLeft";
	    	GameObject.Find("tileBotRight").name = "tileRight";
	    	GameObject.Find("tileBotLeft").name = "tileMid";
	        instantiateTileLeft();
	        instantiateTileBotLeft();
	        instantiateTileBotRight();
	    default:
	        break;
	    }

	}
};

function instantiateTileRight(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x+2*grid_x;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileRight";
};
function instantiateTileTopRight(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x+grid_x;
	tilePosition.z = tilePosition.z+grid_z;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileTopRight";
};
function instantiateTileTopLeft(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x-grid_x;
	tilePosition.z = tilePosition.z+grid_z;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileTopLeft";
};
function instantiateTileLeft(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x-2*grid_x;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileLeft";
};
function instantiateTileBotRight(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x+grid_x;
	tilePosition.z = tilePosition.z-grid_z;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileBotRight";
};
function instantiateTileBotLeft(){
	var curMid = GameObject.Find("tileMid");
	var tilePosition = curMid.transform.position;
	tilePosition.x = tilePosition.x-grid_x;
	tilePosition.z = tilePosition.z-grid_z;
	rightTileInstance = Instantiate(tile,tilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileBotLeft";
};