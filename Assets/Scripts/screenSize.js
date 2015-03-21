#pragma strict

function Start () {
 
     var height = Camera.main.orthographicSize * 2.0;
     var width = height * Screen.width / Screen.height;
     //width=width-100;
     transform.localScale = Vector3(width, 1, 1);
 }