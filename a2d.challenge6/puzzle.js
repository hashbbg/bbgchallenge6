//make b2Vec2 behave like a2d.Position
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("X", function() { return this.x * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("Y", function() { return this.y * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("X", function(x) { this.x = x / 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("Y", function(y) { this.y = y / 10; });
Box2D.Common.Math.b2Vec2.prototype.isInside = function (rectangle) {
		if (this.X > rectangle.topLeft.X && this.X < rectangle.bottomRight.X &&
                this.Y > rectangle.topLeft.Y && this.Y < rectangle.bottomRight.Y) {
            return true;
		}
		return false;
	};
var maze = [[{"X":111,"Y":316},{"X":95,"Y":169}],[{"X":115,"Y":318},{"X":197,"Y":317}],[{"X":279,"Y":208},{"X":205,"Y":320}],[{"X":326,"Y":385},{"X":279,"Y":208}],[{"X":389,"Y":202},{"X":326,"Y":385}],[{"X":431,"Y":359},{"X":389,"Y":201}],[{"X":541,"Y":355},{"X":431,"Y":359}],[{"X":524,"Y":102},{"X":541,"Y":355}],[{"X":724,"Y":103},{"X":524,"Y":102}],[{"X":729,"Y":526},{"X":724,"Y":103}],[{"X":363,"Y":518},{"X":729,"Y":526}],[{"X":818,"Y":102},{"X":968,"Y":105}],[{"X":824,"Y":105},{"X":820,"Y":230}],[{"X":966,"Y":396},{"X":824,"Y":233}],[{"X":910,"Y":425},{"X":822,"Y":333}],[{"X":922,"Y":558},{"X":910,"Y":425}],[{"X":969,"Y":570},{"X":922,"Y":558}],[{"X":850,"Y":482},{"X":834,"Y":465}],[{"X":878,"Y":719},{"X":854,"Y":488}],[{"X":967,"Y":749},{"X":885,"Y":721}],[{"X":9,"Y":171},{"X":98,"Y":176}],[{"X":387,"Y":805},{"X":246,"Y":468}]];

function Basket() {
	a2d.Node.apply(this);
	this.draw = function() {
		a2d.context.fillStyle = "#724000";
		a2d.context.fillRect(0, 600, 200, 800);
	}
}
function PhysicsMaze() {
	a2d.Node.apply(this);
	var fixDef = new Box2D.Dynamics.b2FixtureDef,
		fixDef2 = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef;	

	for(var i = 0; i < maze.length; i++) {
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;	
		fixDef.shape.SetAsArray([
			new Box2D.Common.Math.b2Vec2(maze[i][0].X / 10, maze[i][0].Y / 10),
			new Box2D.Common.Math.b2Vec2(maze[i][1].X / 10, maze[i][1].Y / 10)
			], 2);
		bodyDef.position.Set(0, 0);
		a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);
	}

	//basket
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;	
	fixDef.shape.SetAsArray([
		new Box2D.Common.Math.b2Vec2(20, 60),
		new Box2D.Common.Math.b2Vec2(20, 80)
		], 2);
	bodyDef.position.Set(0, 0);
	a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);

	this.draw = function() {
		for(var i = 0; i < maze.length; i++) {
			a2d.context.lineWidth = 5;
			a2d.context.beginPath();
			a2d.context.moveTo(maze[i][0].X, maze[i][0].Y);
			a2d.context.lineTo(maze[i][1].X, maze[i][1].Y);
			a2d.context.stroke();
		}		
	}
}

function PhysicsMarble(pos) {
	a2d.Tile.apply(this, [a2d.resources["marble"]])
	var self = this,
		body,
		$draw = this.draw.bind(this),
		fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef;		

	this.draw = function() {
		this.position = body.GetPosition();
		this.angle = body.GetAngle();
		$draw()
	}

	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.allowSleep = false;
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(3.2)
	
	bodyDef.position.X = pos.X; 
	bodyDef.position.Y = pos.Y; 
	body = a2d.world.CreateBody(bodyDef)
	body.CreateFixture(fixDef);
}

function PhysicsPuzzle() {
	var fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef,
		apples = new a2d.Node(),
		win = false,
		basket = new a2d.Rectangle(new a2d.Position(0, 600), new a2d.Position(200, 800));
	a2d.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 10), true)
	
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(48, 0.2);
	bodyDef.position.Set(48, 80);
	a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(48, 0.2);
	bodyDef.position.Set(48, 0);
	a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(0.2, 80);
	bodyDef.position.Set(0, 0);
	a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(0.2, 80);
	bodyDef.position.Set(96, 0);
	a2d.world.CreateBody(bodyDef).CreateFixture(fixDef);


	a2d.on("load", function () { 
		var physicsmaze = new PhysicsMaze();		
		a2d.root.push(new Basket());
		a2d.root.push(physicsmaze);		
		apples.push(new PhysicsMarble(new a2d.Position(300, 100)));
		apples.push(new PhysicsMarble(new a2d.Position(400, 100)));
		apples.push(new PhysicsMarble(new a2d.Position(500, 100)));
		a2d.root.push(apples);
		alert("Welcome to 'apples in the basket'. Use the arrow keys to change the direction of gravity to guide your apples to the basket (the brown box)");
	})
	a2d.on("draw", function() {
		if(!win) {
			a2d.world.Step(1 / 60, 10, 10);		
			a2d.world.ClearForces();
			var applesInBasket = 0;
			for(var i = 0; i < apples.length; i++) {
				//console.log(apples[i].position);
				if(apples[i].position && apples[i].position.isInside(basket)) {
					applesInBasket++;
				}
			}
			if(applesInBasket === 3) {
				win = true;
				alert("win");
			}
		}
	})
	document.addEventListener("click", function(e) {
		//a2d.root.push(new PhysicsMarble(new a2d.Position(e.clientX, e.clientY)));
	})
	document.addEventListener("keydown", function(e) {
		switch(e.keyCode) {
			case a2d.key.ARROW_UP:
				a2d.world.SetGravity(new Box2D.Common.Math.b2Vec2(0, -10));
				break;
			case a2d.key.ARROW_DOWN:
				a2d.world.SetGravity(new Box2D.Common.Math.b2Vec2(0, 10));
				break;
			case a2d.key.ARROW_LEFT:
				a2d.world.SetGravity(new Box2D.Common.Math.b2Vec2(-10, 0));
				break;
			case a2d.key.ARROW_RIGHT:
				a2d.world.SetGravity(new Box2D.Common.Math.b2Vec2(10, 0));
				break;
			default:
				break;
		}
	})
	a2d.load({ "marble": "images/apple.png" })
}

function MazeEditor() {
	var currentSegment = null;
	var segments = [];
	function Segment(a, b) {
		a2d.Node.apply(this);

		this.draw = function() {
			a2d.context.lineWidth = 5;
			a2d.context.beginPath();
			a2d.context.moveTo(a.X, a.Y);
			a2d.context.lineTo(b.X, b.Y);
			a2d.context.stroke();
		}
	}
	function addSegment(x, y) {
		if(currentSegment) {
			segments.push( [ {X: x, Y: y}, { X: currentSegment.X, Y: currentSegment.Y } ] );
			a2d.root.push( new Segment(new a2d.Position(x, y), currentSegment ));
			currentSegment = null;
		} else {
			currentSegment = new a2d.Position(x, y);
		}
	}
	document.addEventListener("click", function(e) {		
		addSegment(e.clientX, e.clientY);
	});
	document.addEventListener("keydown", function(e) {
		switch(e.keyCode) {
			case a2d.key.F2:
				console.log(segments);
				break;
			case a2d.key.F3:
				console.log(JSON.stringify(segments));
				break;				
		}
	});	
}

a2d.forceClear = true;
PhysicsPuzzle()
//MazeEditor();