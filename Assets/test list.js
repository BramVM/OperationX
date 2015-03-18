#pragma strict

function Start () {
	var test = new List.<int>();
	for(var i : int = 0; i < 5; i++){
		test.Add(i);
		Debug.Log(i + ' ' + test[i]);
	}
	for(var j : int = 0; j < test.Count; j++){
		Debug.Log(j + ' ' + test[j]);
	}
}

function Update () {

}