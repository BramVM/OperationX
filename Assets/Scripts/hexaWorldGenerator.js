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
	tileScale = grid_x * 1.15470041009; //<--THIS NUMBER NEEDS TRUE VALUE
	Debug.Log(grid_z);
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

InvokeRepeating("checkPlayerPosition", 1, 4);

function checkPlayerPosition(){
	var playerPos_x = player.transform.position.x;
	var playerPos_y = player.transform.position.y;
	var playerPos_z = player.transform.position.z;
	var playerPos = Vector3(playerPos_x,playerPos_y,playerPos_z);
	
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
	    	midTileInstance.name = "tileLeft";
	    	topRightTileInstance.name = "tileTopLeft";
	    	bottomRightTileInstance.name = "tileBotLeft";
	        rightTileInstance.name = "tileMid";
	        
	        instantiateTileRight();
	        break;
	    case "tileLeft":
	    	Destroy(GameObject.Find("tileRight"));
		   	Destroy(GameObject.Find("tileTopRight"));
		   	Destroy(GameObject.Find("tileBotRight"));
	        midTileInstance.name = "tileRight";
	        topLeftTileInstance.name = "tileTopRight";
	    	bottomLeftTileInstance.name = "tileBotRight";
	    	leftTileInstance.name = "tileMid";
	  
	        instantiateTileLeft();
	        break;
	    case "tileTopRight":
	        print ("tileTopRight");
	        break;
	    case "tileTopRight":
	        print ("tileLeft");
	        break;
	    case "tileBotRight":
	        print ("tileBotRight");
	        break;
	    case "tileBotLeft":
	        print ("tileBotLeft");
	        break;
	    default:
	        print ("Default");
	        break;
	    }

	}
};

function instantiateTileRight(){
	var curMid = GameObject.Find("tileMid");
	var curMid_x = curMid.transform.position.x;
	var curMid_z = curMid.transform.position.z;
	Debug.Log(curMid_x);
	var rightTilePosition = Vector3(curMid_x+curMid_x*grid_x,0,curMid_z);
	rightTileInstance = Instantiate(tile,rightTilePosition,tile.transform.rotation )as GameObject;
	rightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	rightTileInstance.name = "tileRight";
	Debug.Log(curMid_z);
	
	var topRightTilePosition = Vector3(curMid_x + grid_x, 0, curMid_z + grid_z);
	topRightTileInstance = Instantiate(tile,topRightTilePosition,tile.transform.rotation )as GameObject;
	topRightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	topRightTileInstance.name = "tileTopRight";
	
	var bottomRightTilePosition = Vector3(curMid_x + grid_x, 0, curMid_z - grid_z);
	bottomRightTileInstance = Instantiate(tile,bottomRightTilePosition,tile.transform.rotation )as GameObject;
	bottomRightTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	bottomRightTileInstance.name = "tileBotRight";
};

function instantiateTileLeft(){
	var curMid = GameObject.Find("tileMid");
	var curMid_x = curMid.transform.position.x;
	var leftTilePosition = Vector3(curMid_x-2*grid_x,0,curMid.transform.position.z);
	leftTileInstance = Instantiate(tile,leftTilePosition,tile.transform.rotation )as GameObject;
	leftTileInstance.transform.localScale = new Vector3(tileScale, tileScale, tileScale);
	leftTileInstance.name = "tileLeft";
};