var target : Transform;
var distance = 10.0;
 
var xSpeed = 50.0;
var ySpeed = 100.0;
 
var yMinLimit = -90;
var yMaxLimit = 90;
 
var distanceMin = 5;
var distanceMax = 30;
var position;
var rotation;
var prevTargetPostion;
 
private var x = 0.0;
private var y = 0.0;
 
@script AddComponentMenu("Camera-Control/Mouse Orbit")
 
function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;
    // Make the rigid body not change rotation
   	if (GetComponent.<Rigidbody>())
		GetComponent.<Rigidbody>().freezeRotation = true;
    if (target) {
    	rotation = Quaternion.Euler(y, x, 0);
    	position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
 		transform.rotation = rotation;
		transform.position = position;
	}
}
 
function LateUpdate () {
    if (target) {
    	//on change camera
	 	if(Input.GetMouseButton(1)){
	 		x += Input.GetAxis("Mouse X") * xSpeed * distance* 0.02;
	        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
	 		y = ClampAngle(y, yMinLimit, yMaxLimit);
			rotation = Quaternion.Euler(y, x, 0);
			distance = Mathf.Clamp(distance - Input.GetAxis("Mouse ScrollWheel")*5, distanceMin, distanceMax);
	        position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
	        transform.rotation = rotation;
	        transform.position = position;
 		}
 		else{
 			//on zoom
	 		if (Input.GetAxis("Mouse ScrollWheel") != 0){
	 			distance = Mathf.Clamp(distance - Input.GetAxis("Mouse ScrollWheel")*5, distanceMin, distanceMax);
		        position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		        transform.rotation = rotation;
		        transform.position = position;
	 		}
	 		//on object mooving
	 		if (target.position!=prevTargetPostion){
		        position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		        transform.rotation = rotation;
		        transform.position = position;
	 		}
 		}
 		prevTargetPostion = target.position;
	}
 
}
 
 
static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}